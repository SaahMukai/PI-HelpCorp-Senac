import { config } from "../config.js";
import { MemoryTicketsRepository } from "./memoryRepository.js";
import { PostgresTicketsRepository } from "./postgresRepository.js";
import type { TicketsRepository } from "./ticketsRepository.js";

export const repository: TicketsRepository = config.useInMemory
  ? new MemoryTicketsRepository()
  : (() => {
      if (!config.databaseUrl) {
        throw new Error(
          "DATABASE_URL é obrigatória quando USE_IN_MEMORY=false."
        );
      }
      return new PostgresTicketsRepository(config.databaseUrl);
    })();
