import { Router } from "express";
import type { TicketsRepository } from "../repositories/ticketsRepository.js";

export const createCategoriesRouter = (repository: TicketsRepository) => {
  const router = Router();

  router.get("/", async (_req, res, next) => {
    try {
      res.json(await repository.listCategories());
    } catch (error) {
      next(error);
    }
  });

  return router;
};
