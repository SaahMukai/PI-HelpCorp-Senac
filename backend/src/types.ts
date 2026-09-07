export const ticketStatuses = [
  "new",
  "triage",
  "in_progress",
  "resolved",
  "closed"
] as const;

export type TicketStatus = (typeof ticketStatuses)[number];

export const priorities = ["low", "medium", "high", "critical"] as const;
export type Priority = (typeof priorities)[number];

export const eventTypes = [
  "created",
  "status",
  "comment",
  "assignment"
] as const;

export type EventType = (typeof eventTypes)[number];

export type UserRole = "requester" | "attendant";

export interface User {
  id: string;
  name: string;
  initials: string;
  role: UserRole;
  department: string;
  email?: string;
}

export interface Category {
  id: string;
  sector: string;
  name: string;
  path: string;
  description: string;
}

export interface TicketAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
}

export interface TicketEvent {
  id: string;
  type: EventType;
  message: string;
  author: User;
  createdAt: string;
}

export interface Ticket {
  id: string;
  protocol: string;
  title: string;
  description: string;
  category: Category;
  priority: Priority;
  status: TicketStatus;
  requester: User;
  assignee: User | null;
  createdAt: string;
  updatedAt: string;
  slaDueAt: string;
  attachments: TicketAttachment[];
  timeline: TicketEvent[];
}

export interface CreateTicketInput {
  title: string;
  description: string;
  categoryId: string;
  priority: Priority;
  attachments: TicketAttachment[];
}

export interface UpdateTicketInput {
  status?: TicketStatus;
  priority?: Priority;
  assigneeId?: string | null;
}

export interface ListTicketsQuery {
  scope?: "mine" | "queue" | "all";
  status?: TicketStatus;
  priority?: Priority;
  categoryId?: string;
  search?: string;
}
