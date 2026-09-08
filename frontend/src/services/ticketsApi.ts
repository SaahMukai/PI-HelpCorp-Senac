import { categories, getCategoryById } from '../data/categories'
import { attendantUser, requesterUser, supportUsers } from '../data/users'
import type {
  AddCommentInput,
  Category,
  CreateTicketInput,
  ListTicketsParams,
  Ticket,
  TicketEvent,
  TicketStatus,
  UpdateTicketInput,
  User,
} from '../types'

const STORAGE_KEY = 'helpcorp:tickets:v1'

export interface TicketsApi {
  list(params?: ListTicketsParams): Promise<Ticket[]>
  get(id: string): Promise<Ticket>
  create(input: CreateTicketInput): Promise<Ticket>
  update(id: string, input: UpdateTicketInput): Promise<Ticket>
  addComment(id: string, input: AddCommentInput): Promise<Ticket>
  listCategories(): Promise<Category[]>
}

const now = Date.now()

const seedTickets: Ticket[] = [
  {
    id: 'tkt-4821',
    protocol: '#4821',
    title: 'Notebook corporativo travando durante a campanha',
    description:
      'Meu notebook apresenta travamentos frequentes e reinicia durante o uso de ferramentas de marketing. Preciso de apoio para não comprometer a entrega da campanha desta semana.',
    category: categories[0],
    priority: 'high',
    status: 'in_progress',
    requester: requesterUser,
    assignee: attendantUser,
    createdAt: new Date(now - 1000 * 60 * 60 * 20).toISOString(),
    updatedAt: new Date(now - 1000 * 60 * 18).toISOString(),
    slaDueAt: new Date(now + 1000 * 60 * 60 * 12).toISOString(),
    attachments: [{ id: 'att-1', name: 'erro-notebook.jpg', size: 780000, type: 'image/jpeg' }],
    timeline: [
      event('created', 'Chamado aberto por Camila Rodrigues.', requesterUser, now - 1000 * 60 * 60 * 20),
      event('assignment', 'Chamado atribuído a Ricardo Mendes.', attendantUser, now - 1000 * 60 * 60 * 19),
      event('status', 'Status alterado para Em atendimento.', attendantUser, now - 1000 * 60 * 18),
      event(
        'comment',
        'Olá, Camila! Vou acessar seu equipamento remotamente ainda hoje para investigar os travamentos.',
        attendantUser,
        now - 1000 * 60 * 17,
      ),
    ],
  },
  {
    id: 'tkt-4817',
    protocol: '#4817',
    title: 'Solicitação de acesso ao painel de campanhas',
    description: 'Preciso de acesso de leitura ao painel de campanhas para acompanhar os indicadores semanais.',
    category: categories[1],
    priority: 'medium',
    status: 'triage',
    requester: requesterUser,
    assignee: attendantUser,
    createdAt: new Date(now - 1000 * 60 * 60 * 36).toISOString(),
    updatedAt: new Date(now - 1000 * 60 * 60 * 2).toISOString(),
    slaDueAt: new Date(now + 1000 * 60 * 60 * 28).toISOString(),
    attachments: [],
    timeline: [
      event('created', 'Chamado aberto por Camila Rodrigues.', requesterUser, now - 1000 * 60 * 60 * 36),
      event('status', 'Status alterado para Em triagem.', attendantUser, now - 1000 * 60 * 60 * 2),
    ],
  },
  {
    id: 'tkt-4809',
    protocol: '#4809',
    title: 'Dúvida sobre declaração de vínculo',
    description: 'Gostaria de saber onde encontro a declaração de vínculo atualizada para uma inscrição.',
    category: categories[3],
    priority: 'low',
    status: 'resolved',
    requester: requesterUser,
    assignee: {
      id: 'usr-juliana',
      name: 'Juliana Alves',
      initials: 'JA',
      role: 'attendant',
      department: 'Recursos Humanos',
      email: 'juliana.alves@helpcorp.com.br',
    },
    createdAt: new Date(now - 1000 * 60 * 60 * 90).toISOString(),
    updatedAt: new Date(now - 1000 * 60 * 60 * 48).toISOString(),
    slaDueAt: new Date(now - 1000 * 60 * 60 * 18).toISOString(),
    attachments: [],
    timeline: [
      event('created', 'Chamado aberto por Camila Rodrigues.', requesterUser, now - 1000 * 60 * 60 * 90),
      event('assignment', 'Chamado atribuído a Juliana Alves.', attendantUser, now - 1000 * 60 * 60 * 88),
      event('status', 'Status alterado para Resolvido.', {
        id: 'usr-juliana',
        name: 'Juliana Alves',
        initials: 'JA',
        role: 'attendant',
        department: 'Recursos Humanos',
      }, now - 1000 * 60 * 60 * 48),
      event('comment', 'A declaração está disponível no Portal de Pessoas > Meus documentos.', {
        id: 'usr-juliana',
        name: 'Juliana Alves',
        initials: 'JA',
        role: 'attendant',
        department: 'Recursos Humanos',
      }, now - 1000 * 60 * 60 * 48),
    ],
  },
  {
    id: 'tkt-4802',
    protocol: '#4802',
    title: 'Internet indisponível na sala de reunião 3',
    description: 'A rede sem fio não aparece na sala de reunião 3 desde o início da manhã.',
    category: categories[2],
    priority: 'critical',
    status: 'closed',
    requester: { ...requesterUser, name: 'Mariana Costa', initials: 'MC', department: 'Comercial' },
    assignee: attendantUser,
    createdAt: new Date(now - 1000 * 60 * 60 * 120).toISOString(),
    updatedAt: new Date(now - 1000 * 60 * 60 * 112).toISOString(),
    slaDueAt: new Date(now - 1000 * 60 * 60 * 114).toISOString(),
    attachments: [],
    timeline: [
      event('created', 'Chamado aberto por Mariana Costa.', requesterUser, now - 1000 * 60 * 120),
      event('status', 'Status alterado para Encerrado.', attendantUser, now - 1000 * 60 * 112),
    ],
  },
]

function event(type: TicketEvent['type'], message: string, author: User, timestamp: number): TicketEvent {
  return {
    id: `${type}-${timestamp}`,
    type,
    message,
    author,
    createdAt: new Date(timestamp).toISOString(),
  }
}

function makeId(prefix: string) {
  return `${prefix}-${globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2)}`
}

function getStoredTickets(): Ticket[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as Ticket[]
  } catch {
    // A memória continua sendo usada quando o storage do navegador não está disponível.
  }
  return structuredClone(seedTickets)
}

function saveTickets(tickets: Ticket[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets))
  } catch {
    // A aplicação continua funcional durante a sessão mesmo sem persistência local.
  }
}

function delay<T>(value: T, milliseconds = 180) {
  return new Promise<T>((resolve) => window.setTimeout(() => resolve(value), milliseconds))
}

function isNearSla(ticket: Ticket) {
  const hoursUntilDue = (new Date(ticket.slaDueAt).getTime() - Date.now()) / (1000 * 60 * 60)
  return hoursUntilDue <= 24 && !['resolved', 'closed'].includes(ticket.status)
}

export const mockTicketsApi: TicketsApi = {
  async list(params = {}) {
    let result = getStoredTickets()
    const search = params.search?.trim().toLowerCase()

    if (params.scope === 'mine') result = result.filter((ticket) => ticket.requester.id === requesterUser.id)
    if (params.scope === 'queue') result = result.filter((ticket) => ticket.status !== 'closed')
    if (params.status && params.status !== 'all') result = result.filter((ticket) => ticket.status === params.status)
    if (params.priority && params.priority !== 'all') result = result.filter((ticket) => ticket.priority === params.priority)
    if (params.categoryId && params.categoryId !== 'all') result = result.filter((ticket) => ticket.category.id === params.categoryId)
    if (search) {
      result = result.filter((ticket) =>
        [ticket.protocol, ticket.title, ticket.description, ticket.category.path, ticket.requester.name]
          .join(' ')
          .toLowerCase()
          .includes(search),
      )
    }

    return delay(result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()))
  },

  async get(id) {
    const ticket = getStoredTickets().find((item) => item.id === id)
    if (!ticket) throw new Error('Chamado não encontrado.')
    return delay(ticket)
  },

  async create(input) {
    const category = getCategoryById(input.categoryId)
    if (!category) throw new Error('Categoria inválida.')

    const createdAt = new Date().toISOString()
    const nextProtocol = 4822 + getStoredTickets().length
    const ticket: Ticket = {
      id: makeId('tkt'),
      protocol: `#${nextProtocol}`,
      title: input.title.trim(),
      description: input.description.trim(),
      category,
      priority: input.priority,
      status: 'new',
      requester: requesterUser,
      createdAt,
      updatedAt: createdAt,
      slaDueAt: new Date(Date.now() + 1000 * 60 * 60 * (input.priority === 'critical' ? 4 : input.priority === 'high' ? 8 : 24)).toISOString(),
      attachments: input.attachments,
      timeline: [event('created', 'Chamado aberto por Camila Rodrigues.', requesterUser, Date.now())],
    }

    const tickets = [ticket, ...getStoredTickets()]
    saveTickets(tickets)
    return delay(ticket)
  },

  async update(id, input) {
    const tickets = getStoredTickets()
    const index = tickets.findIndex((item) => item.id === id)
    if (index === -1) throw new Error('Chamado não encontrado.')

    const current = tickets[index]
    const updatedAt = new Date().toISOString()
    const next = { ...current, ...input, updatedAt }
    const events = [...current.timeline]

    if (input.status && input.status !== current.status) {
      events.push(event('status', `Status alterado para ${statusLabels[input.status]}.`, attendantUser, Date.now()))
    }
    if (input.assigneeId && input.assigneeId !== current.assignee?.id) {
      const assignee = supportUsers.find((user) => user.id === input.assigneeId)
      if (assignee) {
        next.assignee = assignee
        events.push(event('assignment', `Chamado atribuído a ${assignee.name}.`, attendantUser, Date.now()))
      }
    }

    next.timeline = events
    tickets[index] = next
    saveTickets(tickets)
    return delay(next)
  },

  async addComment(id, input) {
    const tickets = getStoredTickets()
    const index = tickets.findIndex((item) => item.id === id)
    if (index === -1) throw new Error('Chamado não encontrado.')

    const current = tickets[index]
    const next = {
      ...current,
      updatedAt: new Date().toISOString(),
      timeline: [...current.timeline, event('comment', input.message.trim(), input.author, Date.now())],
    }
    tickets[index] = next
    saveTickets(tickets)
    return delay(next)
  },

  async listCategories() {
    return delay(categories)
  },
}

const statusLabels: Record<TicketStatus, string> = {
  new: 'Novo',
  triage: 'Em triagem',
  in_progress: 'Em atendimento',
  resolved: 'Resolvido',
  closed: 'Encerrado',
}

async function httpRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options?.headers ?? {}) },
  })
  if (!response.ok) throw new Error(`A API retornou o erro ${response.status}.`)
  return response.json() as Promise<T>
}

export const httpTicketsApi: TicketsApi = {
  list: (params = {}) => {
    const query = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => value && value !== 'all' && query.set(key, String(value)))
    return httpRequest<Ticket[]>(`/api/tickets${query.size ? `?${query.toString()}` : ''}`)
  },
  get: (id) => httpRequest<Ticket>(`/api/tickets/${id}`),
  create: (input) => httpRequest<Ticket>('/api/tickets', { method: 'POST', body: JSON.stringify(input) }),
  update: (id, input) => httpRequest<Ticket>(`/api/tickets/${id}`, { method: 'PATCH', body: JSON.stringify(input) }),
  addComment: (id, input) => httpRequest<Ticket>(`/api/tickets/${id}/comments`, { method: 'POST', body: JSON.stringify(input) }),
  listCategories: () => httpRequest<Category[]>('/api/categories'),
}

export const ticketsApi: TicketsApi = import.meta.env.VITE_USE_MOCK !== 'false' ? mockTicketsApi : httpTicketsApi

export { isNearSla, statusLabels }
