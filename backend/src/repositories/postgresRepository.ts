import { Pool, type PoolClient } from "pg";
import type {
  Category,
  Ticket,
  TicketAttachment,
  TicketEvent,
  User
} from "../types.js";
import type { TicketsRepository } from "./ticketsRepository.js";

type TicketRow = {
  id: string;
  protocol: string;
  title: string;
  description: string;
  category_id: string;
  priority: Ticket["priority"];
  status: Ticket["status"];
  requester_id: string;
  assignee_id: string | null;
  created_at: Date;
  updated_at: Date;
  sla_due_at: Date;
};

const toIso = (value: Date | string) =>
  value instanceof Date ? value.toISOString() : new Date(value).toISOString();

export class PostgresTicketsRepository implements TicketsRepository {
  private readonly pool: Pool;

  constructor(databaseUrl: string) {
    this.pool = new Pool({
      connectionString: databaseUrl,
      ssl:
        databaseUrl.includes("localhost") || databaseUrl.includes("127.0.0.1")
          ? undefined
          : { rejectUnauthorized: false }
    });
  }

  private async getUserWithClient(
    client: Pool | PoolClient,
    id: string
  ): Promise<User | null> {
    const result = await client.query(
      `SELECT id, name, initials, role, department, email
       FROM users
       WHERE id = $1`,
      [id]
    );

    if (!result.rowCount) return null;
    return result.rows[0] as User;
  }

  private async getCategoryWithClient(
    client: Pool | PoolClient,
    id: string
  ): Promise<Category | null> {
    const result = await client.query(
      `SELECT id, sector, name, path, description
       FROM categories
       WHERE id = $1`,
      [id]
    );

    if (!result.rowCount) return null;
    return result.rows[0] as Category;
  }

  private async hydrateTicket(row: TicketRow): Promise<Ticket> {
    const [category, requester, assignee, attachmentsResult, eventsResult] =
      await Promise.all([
        this.getCategoryWithClient(this.pool, row.category_id),
        this.getUserWithClient(this.pool, row.requester_id),
        row.assignee_id
          ? this.getUserWithClient(this.pool, row.assignee_id)
          : Promise.resolve(null),
        this.pool.query(
          `SELECT id, name, size, type
           FROM ticket_attachments
           WHERE ticket_id = $1
           ORDER BY id`,
          [row.id]
        ),
        this.pool.query(
          `SELECT
             e.id,
             e.type,
             e.message,
             e.created_at,
             u.id AS author_id,
             u.name AS author_name,
             u.initials AS author_initials,
             u.role AS author_role,
             u.department AS author_department,
             u.email AS author_email
           FROM ticket_events e
           JOIN users u ON u.id = e.author_id
           WHERE e.ticket_id = $1
           ORDER BY e.created_at ASC`,
          [row.id]
        )
      ]);

    if (!category || !requester) {
      throw new Error(`Dados relacionados ausentes para o chamado ${row.id}.`);
    }

    const attachments: TicketAttachment[] = attachmentsResult.rows.map((item) => ({
      id: item.id,
      name: item.name,
      size: Number(item.size),
      type: item.type
    }));

    const timeline: TicketEvent[] = eventsResult.rows.map((item) => ({
      id: item.id,
      type: item.type,
      message: item.message,
      author: {
        id: item.author_id,
        name: item.author_name,
        initials: item.author_initials,
        role: item.author_role,
        department: item.author_department,
        email: item.author_email
      },
      createdAt: toIso(item.created_at)
    }));

    return {
      id: row.id,
      protocol: row.protocol,
      title: row.title,
      description: row.description,
      category,
      priority: row.priority,
      status: row.status,
      requester,
      assignee,
      createdAt: toIso(row.created_at),
      updatedAt: toIso(row.updated_at),
      slaDueAt: toIso(row.sla_due_at),
      attachments,
      timeline
    };
  }

  async listTickets(): Promise<Ticket[]> {
    const result = await this.pool.query<TicketRow>(
      `SELECT *
       FROM tickets
       ORDER BY created_at DESC`
    );

    return Promise.all(result.rows.map((row) => this.hydrateTicket(row)));
  }

  async getTicket(id: string): Promise<Ticket | null> {
    const result = await this.pool.query<TicketRow>(
      `SELECT *
       FROM tickets
       WHERE id = $1`,
      [id]
    );

    if (!result.rowCount) return null;
    return this.hydrateTicket(result.rows[0]);
  }

  async createTicket(ticket: Ticket): Promise<Ticket> {
    const client = await this.pool.connect();

    try {
      await client.query("BEGIN");

      await client.query(
        `INSERT INTO tickets (
          id, protocol, title, description, category_id,
          priority, status, requester_id, assignee_id,
          created_at, updated_at, sla_due_at
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
        [
          ticket.id,
          ticket.protocol,
          ticket.title,
          ticket.description,
          ticket.category.id,
          ticket.priority,
          ticket.status,
          ticket.requester.id,
          ticket.assignee?.id ?? null,
          ticket.createdAt,
          ticket.updatedAt,
          ticket.slaDueAt
        ]
      );

      for (const attachment of ticket.attachments) {
        await client.query(
          `INSERT INTO ticket_attachments (id, ticket_id, name, size, type)
           VALUES ($1,$2,$3,$4,$5)`,
          [
            attachment.id,
            ticket.id,
            attachment.name,
            attachment.size,
            attachment.type
          ]
        );
      }

      for (const event of ticket.timeline) {
        await client.query(
          `INSERT INTO ticket_events (
            id, ticket_id, type, message, author_id, created_at
          )
          VALUES ($1,$2,$3,$4,$5,$6)`,
          [
            event.id,
            ticket.id,
            event.type,
            event.message,
            event.author.id,
            event.createdAt
          ]
        );
      }

      await client.query("COMMIT");
      return ticket;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async updateTicket(
    id: string,
    changes: Partial<Pick<Ticket, "status" | "priority" | "assignee" | "updatedAt">>,
    events: TicketEvent[]
  ): Promise<Ticket | null> {
    const existing = await this.getTicket(id);
    if (!existing) return null;

    const client = await this.pool.connect();

    try {
      await client.query("BEGIN");

      await client.query(
        `UPDATE tickets
         SET status = $2,
             priority = $3,
             assignee_id = $4,
             updated_at = $5
         WHERE id = $1`,
        [
          id,
          changes.status ?? existing.status,
          changes.priority ?? existing.priority,
          changes.assignee !== undefined
            ? changes.assignee?.id ?? null
            : existing.assignee?.id ?? null,
          changes.updatedAt ?? existing.updatedAt
        ]
      );

      for (const event of events) {
        await client.query(
          `INSERT INTO ticket_events (
            id, ticket_id, type, message, author_id, created_at
          )
          VALUES ($1,$2,$3,$4,$5,$6)`,
          [
            event.id,
            id,
            event.type,
            event.message,
            event.author.id,
            event.createdAt
          ]
        );
      }

      await client.query("COMMIT");
      return this.getTicket(id);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async addEvent(id: string, event: TicketEvent): Promise<Ticket | null> {
    const existing = await this.getTicket(id);
    if (!existing) return null;

    const client = await this.pool.connect();

    try {
      await client.query("BEGIN");

      await client.query(
        `INSERT INTO ticket_events (
          id, ticket_id, type, message, author_id, created_at
        )
        VALUES ($1,$2,$3,$4,$5,$6)`,
        [event.id, id, event.type, event.message, event.author.id, event.createdAt]
      );

      await client.query(
        `UPDATE tickets SET updated_at = $2 WHERE id = $1`,
        [id, event.createdAt]
      );

      await client.query("COMMIT");
      return this.getTicket(id);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async listCategories(): Promise<Category[]> {
    const result = await this.pool.query(
      `SELECT id, sector, name, path, description
       FROM categories
       ORDER BY sector, name`
    );

    return result.rows as Category[];
  }

  async getCategory(id: string): Promise<Category | null> {
    return this.getCategoryWithClient(this.pool, id);
  }

  async getUser(id: string): Promise<User | null> {
    return this.getUserWithClient(this.pool, id);
  }
}
