# Modelo Físico de Banco de Dados — HelpCorp

```mermaid
erDiagram
    USERS {
        varchar id PK
        varchar name
        varchar initials
        varchar role
        varchar department
        varchar email UK
    }

    CATEGORIES {
        varchar id PK
        varchar sector
        varchar name
        varchar path
        text description
    }

    TICKETS {
        varchar id PK
        varchar protocol UK
        varchar title
        text description
        varchar category_id FK
        varchar priority
        varchar status
        varchar requester_id FK
        varchar assignee_id FK
        timestamptz created_at
        timestamptz updated_at
        timestamptz sla_due_at
    }

    TICKET_EVENTS {
        varchar id PK
        varchar ticket_id FK
        varchar type
        text message
        varchar author_id FK
        timestamptz created_at
    }

    TICKET_ATTACHMENTS {
        varchar id PK
        varchar ticket_id FK
        varchar name
        bigint size
        varchar type
    }

    USERS ||--o{ TICKETS : abre
    USERS ||--o{ TICKETS : atende
    CATEGORIES ||--o{ TICKETS : classifica
    TICKETS ||--o{ TICKET_EVENTS : possui
    USERS ||--o{ TICKET_EVENTS : registra
    TICKETS ||--o{ TICKET_ATTACHMENTS : possui
```

## Relacionamentos
- Um usuário solicitante pode abrir vários chamados.
- Um atendente pode ser responsável por vários chamados.
- Uma categoria pode classificar vários chamados.
- Um chamado pode possuir vários eventos e anexos.
- Um usuário pode ser autor de vários eventos.

## Domínios controlados
- `status`: `new`, `triage`, `in_progress`, `resolved`, `closed`
- `priority`: `low`, `medium`, `high`, `critical`
- `role`: `requester`, `attendant`
- `type`: `created`, `status`, `comment`, `assignment`
