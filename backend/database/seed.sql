BEGIN;

INSERT INTO users (id, name, initials, role, department, email)
VALUES
  ('usr-camila', 'Camila Rodrigues', 'CR', 'requester', 'Marketing', 'camila.rodrigues@helpcorp.com.br'),
  ('usr-ricardo', 'Ricardo Mendes', 'RM', 'attendant', 'Suporte de TI', 'ricardo.mendes@helpcorp.com.br')
ON CONFLICT (id) DO NOTHING;

INSERT INTO categories (id, sector, name, path, description)
VALUES
  ('ti-hardware', 'Tecnologia da Informação', 'Hardware', 'TI > Hardware', 'Computadores, notebooks e periféricos.'),
  ('ti-software', 'Tecnologia da Informação', 'Software e Acessos', 'TI > Software e Acessos', 'Sistemas, aplicativos, permissões e acessos.'),
  ('rh-beneficios', 'Recursos Humanos', 'Benefícios', 'RH > Benefícios', 'Dúvidas e solicitações relacionadas a benefícios.'),
  ('financeiro-reembolso', 'Financeiro', 'Reembolso', 'Financeiro > Reembolso', 'Solicitações e dúvidas relacionadas a reembolsos.'),
  ('facilities-manutencao', 'Facilities', 'Manutenção', 'Facilities > Manutenção', 'Solicitações de manutenção predial e infraestrutura.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO tickets (
  id, protocol, title, description, category_id, priority, status,
  requester_id, assignee_id, created_at, updated_at, sla_due_at
)
VALUES (
  'tkt-4821',
  '#4821',
  'Notebook corporativo travando durante a campanha',
  'Meu notebook apresenta travamentos frequentes durante o trabalho.',
  'ti-hardware',
  'high',
  'in_progress',
  'usr-camila',
  'usr-ricardo',
  '2026-09-06T19:00:00.000Z',
  '2026-09-06T19:30:00.000Z',
  '2026-09-07T03:00:00.000Z'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO ticket_events (id, ticket_id, type, message, author_id, created_at)
VALUES
  ('evt-1', 'tkt-4821', 'created', 'Chamado aberto por Camila Rodrigues.', 'usr-camila', '2026-09-06T19:00:00.000Z'),
  ('evt-2', 'tkt-4821', 'assignment', 'Chamado atribuído a Ricardo Mendes.', 'usr-ricardo', '2026-09-06T19:20:00.000Z'),
  ('evt-3', 'tkt-4821', 'status', 'Status alterado para Em atendimento.', 'usr-ricardo', '2026-09-06T19:30:00.000Z')
ON CONFLICT (id) DO NOTHING;

COMMIT;
