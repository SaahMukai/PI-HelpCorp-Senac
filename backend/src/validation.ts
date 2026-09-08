import { z } from "zod";
import { priorities, ticketStatuses } from "./types.js";

export const listTicketsQuerySchema = z.object({
  scope: z.enum(["mine", "queue", "all"]).optional(),
  status: z.enum(ticketStatuses).optional(),
  priority: z.enum(priorities).optional(),
  categoryId: z.string().min(1).optional(),
  search: z.string().optional()
});

export const createTicketSchema = z.object({
  title: z.string().trim().min(1, "title é obrigatório."),
  description: z
    .string()
    .trim()
    .min(15, "description deve possuir pelo menos 15 caracteres."),
  categoryId: z.string().trim().min(1, "categoryId é obrigatório."),
  priority: z.enum(priorities),
  attachments: z
    .array(
      z.object({
        id: z.string().min(1),
        name: z.string().min(1),
        size: z.number().nonnegative(),
        type: z.string().min(1)
      })
    )
    .default([])
});

export const updateTicketSchema = z
  .object({
    status: z.enum(ticketStatuses).optional(),
    priority: z.enum(priorities).optional(),
    assigneeId: z.string().min(1).nullable().optional()
  })
  .refine(
    (value) =>
      value.status !== undefined ||
      value.priority !== undefined ||
      value.assigneeId !== undefined,
    { message: "Envie ao menos um campo para atualização." }
  );

export const commentSchema = z.object({
  message: z.string().trim().min(1, "message é obrigatória."),
  author: z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    initials: z.string().min(1),
    role: z.enum(["requester", "attendant"]),
    department: z.string().min(1),
    email: z.string().email().optional()
  })
});
