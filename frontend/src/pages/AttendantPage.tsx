import { AlertTriangle, CheckCircle2, Clock3, Filter, Search, SlidersHorizontal, Ticket as TicketIcon, Users } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { EmptyState } from '../components/EmptyState'
import { PageHeader } from '../components/PageHeader'
import { TicketTableRow } from '../components/TicketCard'
import { isNearSla, ticketsApi } from '../services/ticketsApi'
import type { Category, Priority, Ticket, TicketStatus } from '../types'

export function AttendantPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [status, setStatus] = useState<TicketStatus | 'all'>('all')
  const [priority, setPriority] = useState<Priority | 'all'>('all')
  const [categoryId, setCategoryId] = useState('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = () => {
    setLoading(true)
    Promise.all([ticketsApi.list({ scope: 'queue' }), ticketsApi.listCategories()]).then(([nextTickets, nextCategories]) => { setTickets(nextTickets); setCategories(nextCategories) }).catch(() => setError('Não foi possível carregar a fila de atendimento.')).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const filtered = useMemo(() => tickets.filter((ticket) => {
    const searchMatch = !search.trim() || `${ticket.protocol} ${ticket.title} ${ticket.requester.name} ${ticket.category.path}`.toLowerCase().includes(search.toLowerCase().trim())
    return searchMatch && (status === 'all' || ticket.status === status) && (priority === 'all' || ticket.priority === priority) && (categoryId === 'all' || ticket.category.id === categoryId)
  }), [tickets, search, status, priority, categoryId])
  const open = tickets.filter((ticket) => !['resolved', 'closed'].includes(ticket.status)).length
  const inProgress = tickets.filter((ticket) => ticket.status === 'in_progress').length
  const nearSla = tickets.filter(isNearSla).length
  const resolved = tickets.filter((ticket) => ['resolved', 'closed'].includes(ticket.status)).length

  return (
    <>
      <PageHeader eyebrow="Central de operações" title="Fila de atendimento" description="Tenha visibilidade do trabalho da equipe e mantenha os SLAs sob controle." action={<button className="button button-secondary"><SlidersHorizontal size={16} /> Configurar fila</button>} />
      <div className="metric-grid attendant-metrics"><Metric icon={<TicketIcon size={18} />} label="Chamados na fila" value={open} hint="Aguardando atendimento" tone="blue" /><Metric icon={<Clock3 size={18} />} label="Em atendimento" value={inProgress} hint="Sendo tratados agora" tone="purple" /><Metric icon={<AlertTriangle size={18} />} label="Próximos do SLA" value={nearSla} hint="Requerem atenção" tone="orange" /><Metric icon={<CheckCircle2 size={18} />} label="Resolvidos" value={resolved} hint="No período atual" tone="green" /></div>
      <section className="panel queue-panel"><div className="section-heading"><div><h2>Chamados da equipe</h2><span>Atualizado agora · {tickets.length} registros</span></div><div className="queue-team"><Users size={15} /><span>3 atendentes online</span><span className="online-dot" /></div></div><div className="filter-bar queue-filters"><div className="search-input"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar protocolo, título ou solicitante" /></div><select value={status} onChange={(event) => setStatus(event.target.value as TicketStatus | 'all')} aria-label="Filtrar por status"><option value="all">Todos os status</option><option value="new">Novo</option><option value="triage">Em triagem</option><option value="in_progress">Em atendimento</option><option value="resolved">Resolvido</option></select><select value={priority} onChange={(event) => setPriority(event.target.value as Priority | 'all')} aria-label="Filtrar por prioridade"><option value="all">Todas as prioridades</option><option value="critical">Crítica</option><option value="high">Alta</option><option value="medium">Média</option><option value="low">Baixa</option></select><select value={categoryId} onChange={(event) => setCategoryId(event.target.value)} aria-label="Filtrar por categoria"><option value="all">Todas as categorias</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.path}</option>)}</select><button className="filter-button" aria-label="Mais filtros"><Filter size={17} /></button></div>{loading && <div className="loading-state"><span className="spinner" /> Carregando fila...</div>}{error && <div className="error-state">{error} <button className="text-button" onClick={load}>Tentar novamente</button></div>}{!loading && !error && filtered.length === 0 && <EmptyState title="Nenhum chamado nessa visão" description="Não há chamados que correspondam aos filtros selecionados." />}{!loading && !error && filtered.length > 0 && <div className="ticket-table"><div className="ticket-table-head"><span>CHAMADO</span><span>SOLICITANTE</span><span>PRIORIDADE</span><span>STATUS</span><span>ATUALIZAÇÃO</span><span /></div>{filtered.map((ticket) => <TicketTableRow key={ticket.id} ticket={ticket} />)}</div>}</section>
    </>
  )
}

function Metric({ icon, label, value, hint, tone }: { icon: React.ReactNode; label: string; value: number; hint: string; tone: string }) { return <div className="metric-card"><span className={`metric-icon metric-${tone}`}>{icon}</span><div><span>{label}</span><strong>{value}</strong><small>{hint}</small></div></div> }
