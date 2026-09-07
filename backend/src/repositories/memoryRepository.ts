import { seedCategories, seedTickets, seedUsers } from "../data/seeds.js";
import type {
  Category,
  Ticket,
  TicketEvent,
  User
} from "../types.js";
import type { TicketsRepository } from "./ticketsRepository.js";

const clone = <T>(value: T): T => structuredClone(value);

export class MemoryTicketsRepository implements TicketsRepository {
  private tickets = clone(seedTickets);
  private categories = clone(seedCategories);
  private users = clone(seedUsers);

  async listTickets(): Promise<Ticket[]> {
    return clone(this.tickets);
  }

  async getTicket(id: string): Promise<Ticket | null> {
    const ticket = this.tickets.find((item) => item.id === id);
    return ticket ? clone(ticket) : null;
  }

  async createTicket(ticket: Ticket): Promise<Ticket> {
    this.tickets.unshift(clone(ticket));
    return clone(ticket);
  }

  async updateTicket(
    id: string,
    changes: Partial<Pick<Ticket, "status" | "priority" | "assignee" | "updatedAt">>,
    events: TicketEvent[]
  ): Promise<Ticket | null> {
    const index = this.tickets.findIndex((item) => item.id === id);
    if (index < 0) return null;

    this.tickets[index] = {
      ...this.tickets[index],
      ...clone(changes),
      timeline: [...this.tickets[index].timeline, ...clone(events)]
    };

    return clone(this.tickets[index]);
  }

  async addEvent(id: string, event: TicketEvent): Promise<Ticket | null> {
    const index = this.tickets.findIndex((item) => item.id === id);
    if (index < 0) return null;

    this.tickets[index].timeline.push(clone(event));
    this.tickets[index].updatedAt = event.createdAt;
    return clone(this.tickets[index]);
  }

  async listCategories(): Promise<Category[]> {
    return clone(this.categories);
  }

  async getCategory(id: string): Promise<Category | null> {
    const category = this.categories.find((item) => item.id === id);
    return category ? clone(category) : null;
  }

  async getUser(id: string): Promise<User | null> {
    const user = this.users.find((item) => item.id === id);
    return user ? clone(user) : null;
  }
}
