# Contrato da API — HelpCorp

Este backend foi implementado para atender ao contrato consumido pelo frontend da PoC.

## Tipos

### Status
- `new`
- `triage`
- `in_progress`
- `resolved`
- `closed`

### Prioridade
- `low`
- `medium`
- `high`
- `critical`

### Eventos
- `created`
- `status`
- `comment`
- `assignment`

Datas são retornadas em ISO 8601.

## Endpoints

### GET `/api/tickets`

Query params opcionais:
- `scope=mine|queue|all`
- `status`
- `priority`
- `categoryId`
- `search`

### GET `/api/tickets/:id`

Retorna o objeto completo do chamado.

### POST `/api/tickets`

```json
{
  "title": "Notebook com travamentos",
  "description": "O notebook apresenta travamentos frequentes durante o trabalho.",
  "categoryId": "ti-hardware",
  "priority": "high",
  "attachments": []
}
```

Cria o chamado com `status = "new"`.

### PATCH `/api/tickets/:id`

```json
{
  "status": "in_progress",
  "priority": "high",
  "assigneeId": "usr-ricardo"
}
```

Todos os campos são opcionais, mas ao menos um deve ser informado.

### POST `/api/tickets/:id/comments`

```json
{
  "message": "Atendimento iniciado.",
  "author": {
    "id": "usr-ricardo",
    "name": "Ricardo Mendes",
    "initials": "RM",
    "role": "attendant",
    "department": "Suporte de TI"
  }
}
```

### GET `/api/categories`

Lista categorias para filtros e abertura de chamados.

## Erro

```json
{
  "error": {
    "code": "TICKET_NOT_FOUND",
    "message": "Chamado não encontrado.",
    "details": []
  }
}
```
