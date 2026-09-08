import { Filter, Plus, Search, SlidersHorizontal, Ticket as TicketIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { EmptyState } from '../components/EmptyState'
import { PageHeader } from '../components/PageHeader'
import { TicketCard } from '../components/TicketCard'
import { ticketsApi } from '../services/ticketsApi'
import type { Category, Priority, Ticket, TicketStatus } from '../types'

export function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [status, setStatus] = useState<TicketStatus | 'all'>('all')
  const [priority, setPriority] = useState<Priority | 'all'>('all')
  const [categoryId, setCategoryId] = useState('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([ticketsApi.list({ scope: 'mine' }), ticketsApi.listCategories()])
      .then(([nextTickets, nextCategories]) => {
        setTickets(nextTickets)
        setCategories(nextCategories)
      })
      .catch(() => setError('Não foi possível carregar seus chamados.'))
      .finally(() => setLoading(false))
  }, [])

  const filteredTickets = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim()
    return tickets.filter((ticket) => {
      const matchesSearch = !normalizedSearch || `${ticket.protocol} ${ticket.title} ${ticket.category.path}`.toLowerCase().includes(normalizedSearch)
      const matchesStatus = status === 'all' || ticket.status === status
      const matchesPriority = priority === 'all' || ticket.priority === priority
      const matchesCategory = categoryId === 'all' || ticket.category.id === categoryId
      return matchesSearch && matchesStatus && matchesPriority && matchesCategory
    })
  }, [tickets, search, status, priority, categoryId])

  const openCount = tickets.filter((ticket) => !['resolved', 'closed'].includes(ticket.status)).length
  const resolvedCount = tickets.filter((ticket) => ['resolved', 'closed'].includes(ticket.status)).length

  return (
    <>
      <PageHeader
        eyebrow="Espaço do solicitante"
        title="Meus chamados"
        description="Acompanhe suas solicitações e encontre ajuda para resolver o que precisa."
        action={<Link className="button button-primary" to="/chamados/novo"><Plus size={17} /> Abrir chamado</Link>}
      />

      <div className="metric-grid requester-metrics">
        <Metric label="Chamados em aberto" value={openCount} hint="Precisam de acompanhamento" tone="blue" icon={<TicketIcon size={18} />} />
        <Metric label="Resolvidos" value={resolvedCount} hint="Neste histórico" tone="green" icon={<Filter size={18} />} />
        <Metric label="Tempo médio de resposta" value="2h 14m" hint="Dentro do SLA combinado" tone="purple" icon={<SlidersHorizontal size={18} />} />
      </div>

      <section className="panel tickets-section">
        <div className="section-heading">
          <div><h2>Histórico de solicitações</h2><span>{tickets.length} chamados registrados</span></div>
          <div className="view-toggle"><button className="view-toggle-active"><span className="view-grid-icon" /></button><button><span className="view-list-icon" /></button></div>
        </div>
        <div className="filter-bar">
          <div className="search-input"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por protocolo ou título" /></div>
          <select value={status} onChange={(event) => setStatus(event.target.value as TicketStatus | 'all')} aria-label="Filtrar por status"><option value="all">Todos os status</option><option value="new">Novo</option><option value="triage">Em triagem</option><option value="in_progress">Em atendimento</option><option value="resolved">Resolvido</option><option value="closed">Encerrado</option></select>
          <select value={priority} onChange={(event) => setPriority(event.target.value as Priority | 'all')} aria-label="Filtrar por prioridade"><option value="all">Todas as prioridades</option><option value="critical">Crítica</option><option value="high">Alta</option><option value="medium">Média</option><option value="low">Baixa</option></select>
          <select value={categoryId} onChange={(event) => setCategoryId(event.target.value)} aria-label="Filtrar por categoria"><option value="all">Todas as categorias</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.path}</option>)}</select>
        </div>
        {loading && <div className="loading-state"><span className="spinner" /> Carregando chamados...</div>}
        {error && <div className="error-state">{error} <button className="text-button" onClick={() => window.location.reload()}>Tentar novamente</button></div>}
        {!loading && !error && filteredTickets.length === 0 && <EmptyState title="Nenhum chamado encontrado" description="Ajuste os filtros ou abra um novo chamado para começar." />}
        {!loading && !error && filteredTickets.length > 0 && <div className="ticket-card-grid">{filteredTickets.map((ticket) => <TicketCard key={ticket.id} ticket={ticket} />)}</div>}
      </section>
    </>
  )
}

function Metric({ label, value, hint, tone, icon }: { label: string; value: string | number; hint: string; tone: string; icon: React.ReactNode }) {
  return <div className="metric-card"><span className={`metric-icon metric-${tone}`}>{icon}</span><div><span>{label}</span><strong>{value}</strong><small>{hint}</small></div></div>
}
