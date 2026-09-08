import { randomUUID } from "node:crypto";
import { config } from "../config.js";
import { AppError } from "../errors.js";
import type { TicketsRepository } from "../repositories/ticketsRepository.js";
import type {
  CreateTicketInput,
  ListTicketsQuery,
  Priority,
  Ticket,
  TicketEvent,
  TicketStatus,
  UpdateTicketInput,
  User
} from "../types.js";

const statusLabels: Record<TicketStatus, string> = {
  new: "Novo",
  triage: "Em triagem",
  in_progress: "Em atendimento",
  resolved: "Resolvido",
  closed: "Encerrado"
};

const slaHours: Record<Priority, number> = {
  low: 72,
  medium: 24,
  high: 8,
  critical: 4
};

const eventId = () => `evt-${randomUUID().slice(0, 8)}`;
const ticketId = () => `tkt-${randomUUID().slice(0, 8)}`;
const protocol = () => `#${Math.floor(1000 + Math.random() * 9000)}`;

const includesSearch = (ticket: Ticket, raw: string) => {
  const search = raw.trim().toLowerCase();
  if (!search) return true;

  return [
    ticket.protocol,
    ticket.title,
    ticket.description,
    ticket.category.name,
    ticket.category.path,
    ticket.category.sector,
    ticket.requester.name
  ].some((value) => value.toLowerCase().includes(search));
};

export class TicketsService {
  constructor(private readonly repository: TicketsRepository) {}

  async list(query: ListTicketsQuery): Promise<Ticket[]> {
    let tickets = await this.repository.listTickets();

    if (query.scope === "mine") {
      tickets = tickets.filter(
        (ticket) => ticket.requester.id === config.demoRequesterId
      );
    }

    if (query.scope === "queue") {
      tickets = tickets.filter((ticket) => ticket.status !== "closed");
    }

    if (query.status) {
      tickets = tickets.filter((ticket) => ticket.status === query.status);
    }

    if (query.priority) {
      tickets = tickets.filter((ticket) => ticket.priority === query.priority);
    }

    if (query.categoryId) {
      tickets = tickets.filter(
        (ticket) => ticket.category.id === query.categoryId
      );
    }

    if (query.search) {
      tickets = tickets.filter((ticket) => includesSearch(ticket, query.search!));
    }

    return tickets;
  }

  async getById(id: string): Promise<Ticket> {
    const ticket = await this.repository.getTicket(id);

    if (!ticket) {
      throw new AppError(404, "TICKET_NOT_FOUND", "Chamado não encontrado.");
    }

    return ticket;
  }

  async create(input: CreateTicketInput): Promise<Ticket> {
    const category = await this.repository.getCategory(input.categoryId);

    if (!category) {
      throw new AppError(
        404,
        "CATEGORY_NOT_FOUND",
        "Categoria não encontrada."
      );
    }

    const requester = await this.repository.getUser(config.demoRequesterId);

    if (!requester) {
      throw new AppError(
        500,
        "DEMO_REQUESTER_NOT_FOUND",
        "Usuário demonstrativo não foi encontrado."
      );
    }

    const now = new Date();
    const slaDueAt = new Date(
      now.getTime() + slaHours[input.priority] * 60 * 60 * 1000
    );

    const ticket: Ticket = {
      id: ticketId(),
      protocol: protocol(),
      title: input.title,
      description: input.description,
      category,
      priority: input.priority,
      status: "new",
      requester,
      assignee: null,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      slaDueAt: slaDueAt.toISOString(),
      attachments: input.attachments,
      timeline: [
        {
          id: eventId(),
          type: "created",
          message: `Chamado aberto por ${requester.name}.`,
          author: requester,
          createdAt: now.toISOString()
        }
      ]
    };

    return this.repository.createTicket(ticket);
  }

  async update(id: string, input: UpdateTicketInput): Promise<Ticket> {
    const current = await this.getById(id);
    const now = new Date().toISOString();
    const events: TicketEvent[] = [];

    let assignee = current.assignee;

    if (input.assigneeId !== undefined) {
      if (input.assigneeId === null) {
        assignee = null;
      } else {
        const found = await this.repository.getUser(input.assigneeId);

        if (!found || found.role !== "attendant") {
          throw new AppError(
            422,
            "INVALID_ASSIGNEE",
            "O atendente informado é inválido."
          );
        }

        assignee = found;
      }
    }

    const eventAuthor =
      assignee ??
      (await this.repository.getUser(config.demoAttendantId)) ??
      current.requester;

    if (
      input.assigneeId !== undefined &&
      current.assignee?.id !== assignee?.id
    ) {
      events.push({
        id: eventId(),
        type: "assignment",
        message: assignee
          ? `Chamado atribuído a ${assignee.name}.`
          : "Atribuição do chamado removida.",
        author: eventAuthor,
        createdAt: now
      });
    }

    if (input.status && input.status !== current.status) {
      events.push({
        id: eventId(),
        type: "status",
        message: `Status alterado para ${statusLabels[input.status]}.`,
        author: eventAuthor,
        createdAt: now
      });
    }

    const updated = await this.repository.updateTicket(
      id,
      {
        status: input.status ?? current.status,
        priority: input.priority ?? current.priority,
        assignee,
        updatedAt: now
      },
      events
    );

    if (!updated) {
      throw new AppError(404, "TICKET_NOT_FOUND", "Chamado não encontrado.");
    }

    return updated;
  }

  async addComment(
    id: string,
    message: string,
    authorPayload: User
  ): Promise<Ticket> {
    await this.getById(id);

    const author = await this.repository.getUser(authorPayload.id);

    if (!author) {
      throw new AppError(
        422,
        "INVALID_COMMENT_AUTHOR",
        "Autor do comentário não encontrado."
      );
    }

    const event: TicketEvent = {
      id: eventId(),
      type: "comment",
      message,
      author,
      createdAt: new Date().toISOString()
    };

    const updated = await this.repository.addEvent(id, event);

    if (!updated) {
      throw new AppError(404, "TICKET_NOT_FOUND", "Chamado não encontrado.");
    }

    return updated;
  }
}
