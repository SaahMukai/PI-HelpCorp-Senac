import { app } from "./app.js";
import { config } from "./config.js";

app.listen(config.port, () => {
  console.log(
    `HelpCorp API ativa em http://localhost:${config.port} (${config.useInMemory ? "memória" : "PostgreSQL"})`
  );
});
