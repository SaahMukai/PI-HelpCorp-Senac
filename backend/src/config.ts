import dotenv from "dotenv";

dotenv.config();

const splitOrigins = (value: string | undefined) =>
  (value ?? "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

export const config = {
  port: Number(process.env.PORT ?? 3000),
  useInMemory: (process.env.USE_IN_MEMORY ?? "true").toLowerCase() === "true",
  databaseUrl: process.env.DATABASE_URL ?? "",
  frontendOrigins: splitOrigins(process.env.FRONTEND_ORIGIN),
  demoRequesterId: process.env.DEMO_REQUESTER_ID ?? "usr-camila",
  demoAttendantId: process.env.DEMO_ATTENDANT_ID ?? "usr-ricardo"
};
