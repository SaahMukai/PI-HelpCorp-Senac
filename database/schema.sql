BEGIN;

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(80) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  initials VARCHAR(10) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('requester','attendant')),
  department VARCHAR(120) NOT NULL,
  email VARCHAR(180) UNIQUE
);

CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(80) PRIMARY KEY,
  sector VARCHAR(120) NOT NULL,
  name VARCHAR(120) NOT NULL,
  path VARCHAR(220) NOT NULL,
  description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tickets (
  id VARCHAR(80) PRIMARY KEY,
  protocol VARCHAR(30) NOT NULL UNIQUE,
  title VARCHAR(180) NOT NULL,
  description TEXT NOT NULL,
  category_id VARCHAR(80) NOT NULL REFERENCES categories(id),
  priority VARCHAR(20) NOT NULL CHECK (priority IN ('low','medium','high','critical')),
  status VARCHAR(30) NOT NULL CHECK (status IN ('new','triage','in_progress','resolved','closed')),
  requester_id VARCHAR(80) NOT NULL REFERENCES users(id),
  assignee_id VARCHAR(80) REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  sla_due_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS ticket_events (
  id VARCHAR(80) PRIMARY KEY,
  ticket_id VARCHAR(80) NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  type VARCHAR(30) NOT NULL CHECK (type IN ('created','status','comment','assignment')),
  message TEXT NOT NULL,
  author_id VARCHAR(80) NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS ticket_attachments (
  id VARCHAR(120) PRIMARY KEY,
  ticket_id VARCHAR(80) NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  size BIGINT NOT NULL CHECK (size >= 0),
  type VARCHAR(120) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tickets_requester ON tickets(requester_id);
CREATE INDEX IF NOT EXISTS idx_tickets_assignee ON tickets(assignee_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_priority ON tickets(priority);
CREATE INDEX IF NOT EXISTS idx_tickets_category ON tickets(category_id);
CREATE INDEX IF NOT EXISTS idx_ticket_events_ticket_created ON ticket_events(ticket_id, created_at);

COMMIT;
