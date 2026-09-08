const baseUrl = process.env.API_BASE_URL ?? "http://localhost:3000";

async function request(path, options) {
  const response = await fetch(`${baseUrl}${path}`, options);
  const body = await response.json();

  if (!response.ok) {
    throw new Error(
      `${options?.method ?? "GET"} ${path} -> ${response.status}\n${JSON.stringify(body, null, 2)}`
    );
  }

  console.log(`✓ ${options?.method ?? "GET"} ${path} -> ${response.status}`);
  return body;
}

const categories = await request("/api/categories");
const categoryId = categories[0]?.id ?? "ti-hardware";

const created = await request("/api/tickets", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    title: "Teste de integração",
    description: "Chamado criado pelo smoke test da API HelpCorp.",
    categoryId,
    priority: "medium",
    attachments: []
  })
});

await request(`/api/tickets/${created.id}`);

await request(`/api/tickets/${created.id}`, {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    status: "in_progress",
    assigneeId: "usr-ricardo"
  })
});

await request(`/api/tickets/${created.id}/comments`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    message: "Atendimento iniciado.",
    author: {
      id: "usr-ricardo",
      name: "Ricardo Mendes",
      initials: "RM",
      role: "attendant",
      department: "Suporte de TI"
    }
  })
});

await request("/api/tickets?scope=queue");

console.log("\nSmoke test concluído com sucesso.");
