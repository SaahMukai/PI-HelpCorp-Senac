import { Router } from "express";
import type { TicketsService } from "../services/ticketsService.js";
import {
  commentSchema,
  createTicketSchema,
  listTicketsQuerySchema,
  updateTicketSchema
} from "../validation.js";

export const createTicketsRouter = (service: TicketsService) => {
  const router = Router();

  router.get("/", async (req, res, next) => {
    try {
      const query = listTicketsQuerySchema.parse(req.query);
      res.json(await service.list(query));
    } catch (error) {
      next(error);
    }
  });

  router.get("/:id", async (req, res, next) => {
    try {
      res.json(await service.getById(req.params.id));
    } catch (error) {
      next(error);
    }
  });

  router.post("/", async (req, res, next) => {
    try {
      const payload = createTicketSchema.parse(req.body);
      res.status(201).json(await service.create(payload));
    } catch (error) {
      next(error);
    }
  });

  router.patch("/:id", async (req, res, next) => {
    try {
      const payload = updateTicketSchema.parse(req.body);
      res.json(await service.update(req.params.id, payload));
    } catch (error) {
      next(error);
    }
  });

  router.post("/:id/comments", async (req, res, next) => {
    try {
      const payload = commentSchema.parse(req.body);
      res
        .status(201)
        .json(
          await service.addComment(
            req.params.id,
            payload.message,
            payload.author
          )
        );
    } catch (error) {
      next(error);
    }
  });

  return router;
};
