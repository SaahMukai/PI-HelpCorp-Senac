import type { Category, Ticket, User } from "../types.js";

export const seedUsers: User[] = [
  {
    id: "usr-camila",
    name: "Camila Rodrigues",
    initials: "CR",
    role: "requester",
    department: "Marketing",
    email: "camila.rodrigues@helpcorp.com.br"
  },
  {
    id: "usr-ricardo",
    name: "Ricardo Mendes",
    initials: "RM",
    role: "attendant",
    department: "Suporte de TI",
    email: "ricardo.mendes@helpcorp.com.br"
  }
];

export const seedCategories: Category[] = [
  {
    id: "ti-hardware",
    sector: "Tecnologia da Informação",
    name: "Hardware",
    path: "TI > Hardware",
    description: "Computadores, notebooks e periféricos."
  },
  {
    id: "ti-software",
    sector: "Tecnologia da Informação",
    name: "Software e Acessos",
    path: "TI > Software e Acessos",
    description: "Sistemas, aplicativos, permissões e acessos."
  },
  {
    id: "rh-beneficios",
    sector: "Recursos Humanos",
    name: "Benefícios",
    path: "RH > Benefícios",
    description: "Dúvidas e solicitações relacionadas a benefícios."
  },
  {
    id: "financeiro-reembolso",
    sector: "Financeiro",
    name: "Reembolso",
    path: "Financeiro > Reembolso",
    description: "Solicitações e dúvidas relacionadas a reembolsos."
  },
  {
    id: "facilities-manutencao",
    sector: "Facilities",
    name: "Manutenção",
    path: "Facilities > Manutenção",
    description: "Solicitações de manutenção predial e infraestrutura."
  }
];

const camila = seedUsers[0];
const ricardo = seedUsers[1];
const hardware = seedCategories[0];

export const seedTickets: Ticket[] = [
  {
    id: "tkt-4821",
    protocol: "#4821",
    title: "Notebook corporativo travando durante a campanha",
    description: "Meu notebook apresenta travamentos frequentes durante o trabalho.",
    category: hardware,
    priority: "high",
    status: "in_progress",
    requester: camila,
    assignee: ricardo,
    createdAt: "2026-09-06T19:00:00.000Z",
    updatedAt: "2026-09-06T19:30:00.000Z",
    slaDueAt: "2026-09-07T03:00:00.000Z",
    attachments: [],
    timeline: [
      {
        id: "evt-1",
        type: "created",
        message: "Chamado aberto por Camila Rodrigues.",
        author: camila,
        createdAt: "2026-09-06T19:00:00.000Z"
      },
      {
        id: "evt-2",
        type: "assignment",
        message: "Chamado atribuído a Ricardo Mendes.",
        author: ricardo,
        createdAt: "2026-09-06T19:20:00.000Z"
      },
      {
        id: "evt-3",
        type: "status",
        message: "Status alterado para Em atendimento.",
        author: ricardo,
        createdAt: "2026-09-06T19:30:00.000Z"
      }
    ]
  }
];
