import cors from "cors";
import express from "express";
import { config } from "./config.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { repository } from "./repositories/index.js";
import { createCategoriesRouter } from "./routes/categories.js";
import { createTicketsRouter } from "./routes/tickets.js";
import { TicketsService } from "./services/ticketsService.js";

const service = new TicketsService(repository);

export const app = express();

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || config.frontendOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origem não permitida pelo CORS: ${origin}`));
    }
  })
);

app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "helpcorp-api",
    persistence: config.useInMemory ? "memory" : "postgresql",
    timestamp: new Date().toISOString()
  });
});

app.use("/api/categories", createCategoriesRouter(repository));
app.use("/api/tickets", createTicketsRouter(service));

app.use((_req, res) => {
  res.status(404).json({
    error: {
      code: "ROUTE_NOT_FOUND",
      message: "Rota não encontrada.",
      details: []
    }
  });
});

app.use(errorHandler);
