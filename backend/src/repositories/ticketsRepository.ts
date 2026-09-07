import type {
  Category,
  Ticket,
  TicketEvent,
  User
} from "../types.js";

export interface TicketsRepository {
  listTickets(): Promise<Ticket[]>;
  getTicket(id: string): Promise<Ticket | null>;
  createTicket(ticket: Ticket): Promise<Ticket>;
  updateTicket(
    id: string,
    changes: Partial<Pick<Ticket, "status" | "priority" | "assignee" | "updatedAt">>,
    events: TicketEvent[]
  ): Promise<Ticket | null>;
  addEvent(id: string, event: TicketEvent): Promise<Ticket | null>;
  listCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | null>;
  getUser(id: string): Promise<User | null>;
}
