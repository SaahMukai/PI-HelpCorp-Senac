# Banco de Dados — HelpCorp

Modelo físico em PostgreSQL para a PoC da HelpCorp.

## Arquivos
- `schema.sql` — DDL com tabelas, PKs, FKs, constraints e índices.
- `seed.sql` — dados iniciais para teste.
- `modelo-fisico.md` — diagrama físico em Mermaid.

## Entidades
`users`, `categories`, `tickets`, `ticket_events`, `ticket_attachments`.

Esse modelo suporta abertura de chamados, categorização, associação de solicitante/atendente, atualização de status, comentários, histórico e anexos.
