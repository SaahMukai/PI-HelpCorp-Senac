# HelpCorp Backend

API REST da **PoC HelpCorp**, implementada de acordo com o contrato utilizado pelo frontend.

## Stack

- Node.js
- TypeScript
- Express
- Zod
- PostgreSQL (`pg`)
- persistência em memória opcional para teste rápido

## Execução rápida — sem banco

Essa opção permite validar a integração com o frontend imediatamente.

```bash
npm install
```

Crie `.env` copiando `.env.example` e mantenha:

```env
PORT=3000
USE_IN_MEMORY=true
FRONTEND_ORIGIN=http://localhost:5173
DEMO_REQUESTER_ID=usr-camila
DEMO_ATTENDANT_ID=usr-ricardo
```

Execute:

```bash
npm run dev
```

API:

```text
http://localhost:3000
```

Health check:

```text
GET http://localhost:3000/api/health
```

## Configuração do frontend

No `.env.local` do frontend:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_USE_MOCK=false
```

Depois reinicie o frontend:

```bash
npm run dev
```

## Endpoints implementados

| Método | Endpoint | Uso |
|---|---|---|
| GET | `/api/health` | Verifica a API |
| GET | `/api/categories` | Lista categorias |
| GET | `/api/tickets` | Lista e filtra chamados |
| GET | `/api/tickets/:id` | Retorna chamado completo |
| POST | `/api/tickets` | Abre chamado |
| PATCH | `/api/tickets/:id` | Atualiza status, prioridade ou atendente |
| POST | `/api/tickets/:id/comments` | Adiciona comentário ao histórico |

Filtros suportados em `GET /api/tickets`:

- `scope=mine|queue|all`
- `status`
- `priority`
- `categoryId`
- `search`

## Teste automático simples

Com a API rodando em outro terminal:

```bash
npm run smoke
```

O teste:

1. consulta categorias;
2. cria um chamado;
3. consulta o chamado;
4. atribui Ricardo e muda o status;
5. adiciona comentário;
6. lista a fila.

## PostgreSQL

Quando o banco estiver disponível, altere:

```env
USE_IN_MEMORY=false
DATABASE_URL=postgresql://usuario:senha@host:5432/helpcorp
```

Crie as tabelas:

```bash
psql "$DATABASE_URL" -f database/schema.sql
psql "$DATABASE_URL" -f database/seed.sql
```

O modelo implementado possui:

- `users`
- `categories`
- `tickets`
- `ticket_events`
- `ticket_attachments`

> O `schema.sql` deste backend é um modelo de integração compatível com o contrato. Antes da entrega, alinhem o arquivo final com o modelo físico oficial desenvolvido pela frente de Banco de Dados.

## SLA utilizado na PoC

| Prioridade | Prazo |
|---|---:|
| `low` | 72 h |
| `medium` | 24 h |
| `high` | 8 h |
| `critical` | 4 h |

O SLA é calculado automaticamente no `POST /api/tickets`.

## Observações da PoC

A aplicação ainda não possui autenticação real. Para manter o contrato do frontend:

- novos chamados são associados ao usuário `usr-camila`;
- ações operacionais usam `usr-ricardo` como atendente demonstrativo;
- comentários continuam recebendo `author` do frontend, conforme definido no contrato.

Em uma versão produtiva, a identidade deve vir de sessão/token e não do payload enviado pelo cliente.

## Build

```bash
npm run build
npm start
```

## Deploy

O arquivo `render.yaml` contém uma configuração inicial para publicação da API em um serviço Node compatível com Render.

Para deploy persistente:

1. disponibilize um PostgreSQL;
2. execute `schema.sql` e `seed.sql`;
3. configure `DATABASE_URL`;
4. configure `FRONTEND_ORIGIN` com a URL pública do frontend;
5. mantenha `USE_IN_MEMORY=false`.
