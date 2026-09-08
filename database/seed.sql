BEGIN;

INSERT INTO users (id,name,initials,role,department,email) VALUES
('usr-camila','Camila Rodrigues','CR','requester','Marketing','camila.rodrigues@helpcorp.com.br'),
('usr-ricardo','Ricardo Mendes','RM','attendant','Suporte de TI','ricardo.mendes@helpcorp.com.br')
ON CONFLICT (id) DO NOTHING;

INSERT INTO categories (id,sector,name,path,description) VALUES
('ti-hardware','Tecnologia da Informação','Hardware','TI > Hardware','Computadores, notebooks e periféricos.'),
('ti-software','Tecnologia da Informação','Software e Acessos','TI > Software e Acessos','Sistemas, aplicativos, permissões e acessos.'),
('rh-beneficios','Recursos Humanos','Benefícios','RH > Benefícios','Dúvidas e solicitações relacionadas a benefícios.'),
('financeiro-reembolso','Financeiro','Reembolso','Financeiro > Reembolso','Solicitações e dúvidas relacionadas a reembolsos.'),
('facilities-manutencao','Facilities','Manutenção','Facilities > Manutenção','Solicitações de manutenção predial e infraestrutura.')
ON CONFLICT (id) DO NOTHING;

COMMIT;
