import { ArrowLeft, CalendarDays, CheckCircle2, Clock3, MessageSquare, Paperclip, Send, UserRound } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { Avatar } from '../components/Avatar'
import { PageHeader } from '../components/PageHeader'
import { PriorityBadge } from '../components/PriorityBadge'
import { StatusBadge } from '../components/StatusBadge'
import { StatusStepper } from '../components/StatusStepper'
import { TicketTimeline } from '../components/TicketTimeline'
import { formatRelativeDate } from '../components/TicketCard'
import { attendantUser } from '../data/users'
import { ticketsApi } from '../services/ticketsApi'
import type { Ticket, TicketStatus } from '../types'

export function TicketDetailPage({ attendant = false }: { attendant?: boolean }) {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<TicketStatus>('new')
  const [comment, setComment] = useState('')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(Boolean((location.state as { created?: boolean } | null)?.created))

  useEffect(() => {
    if (!id) return
    ticketsApi.get(id).then((nextTicket) => { setTicket(nextTicket); setSelectedStatus(nextTicket.status) }).catch(() => setError('Chamado não encontrado.')).finally(() => setLoading(false))
  }, [id])

  const updateTicket = async (event: FormEvent) => {
    event.preventDefault()
    if (!ticket || (!comment.trim() && selectedStatus === ticket.status)) return
    setSaving(true)
    setError('')
    try {
      let next = ticket
      if (selectedStatus !== ticket.status) next = await ticketsApi.update(ticket.id, { status: selectedStatus })
      if (comment.trim()) next = await ticketsApi.addComment(ticket.id, { message: comment, author: attendantUser })
      setTicket(next)
      setComment('')
      setSuccess(true)
      window.setTimeout(() => setSuccess(false), 3500)
    } catch {
      setError('Não foi possível atualizar o chamado.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="loading-state full-state"><span className="spinner" /> Carregando chamado...</div>
  if (error || !ticket) return <div className="error-state full-state">{error || 'Chamado não encontrado.'} <button className="text-button" onClick={() => navigate(attendant ? '/atendimento' : '/chamados')}>Voltar</button></div>

  return (
    <>
      <Link className="back-link" to={attendant ? '/atendimento' : '/chamados'}><ArrowLeft size={16} /> {attendant ? 'Voltar para fila de atendimento' : 'Voltar para meus chamados'}</Link>
      {success && <div className="success-banner"><CheckCircle2 size={18} /><span>{location.state?.created ? 'Chamado aberto com sucesso!' : 'Chamado atualizado com sucesso!'}</span><button onClick={() => setSuccess(false)}>Fechar</button></div>}
      <PageHeader eyebrow={`${ticket.protocol} · aberto ${formatRelativeDate(ticket.createdAt)}`} title={ticket.title} description={ticket.category.path} action={<StatusBadge status={ticket.status} />} />
      <div className="detail-layout">
        <div className="detail-main">
          <section className="panel status-panel"><div className="panel-heading"><div><h2>Acompanhamento</h2><p>Última atualização {formatRelativeDate(ticket.updatedAt)}</p></div><PriorityBadge priority={ticket.priority} /></div><StatusStepper status={ticket.status} /><div className="sla-bar"><div className="sla-icon"><Clock3 size={17} /></div><div><strong>Prazo estimado de atendimento</strong><span>{formatDueDate(ticket.slaDueAt, ticket.status)}</span></div><span className={isOverdue(ticket) ? 'sla-warning' : 'sla-ok'}>{isOverdue(ticket) ? 'Atenção ao prazo' : 'Dentro do SLA'}</span></div></section>
          <section className="panel description-panel"><div className="panel-heading"><div><h2>Descrição do chamado</h2><p>Informações enviadas na abertura</p></div><button className="icon-button"><Paperclip size={17} /></button></div><p className="ticket-description">{ticket.description}</p>{ticket.attachments.length > 0 && <div className="detail-attachments">{ticket.attachments.map((attachment) => <span key={attachment.id}><Paperclip size={14} /> {attachment.name}</span>)}</div>}</section>
          <section className="panel timeline-panel"><div className="panel-heading"><div><h2>Histórico de atendimento</h2><p>{ticket.timeline.length} registros de interação</p></div><MessageSquare size={19} className="heading-muted-icon" /></div><TicketTimeline events={ticket.timeline} /></section>
        </div>
        <aside className="detail-side">
          <section className="panel info-panel"><h2>Informações</h2><InfoRow icon={<UserRound size={16} />} label="Solicitante"><Avatar user={ticket.requester} size="small" /><span>{ticket.requester.name}<small>{ticket.requester.department}</small></span></InfoRow><InfoRow icon={<CalendarDays size={16} />} label="Data de abertura"><span>{new Date(ticket.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</span></InfoRow><InfoRow icon={<Clock3 size={16} />} label="SLA estimado"><span>{formatDueDate(ticket.slaDueAt, ticket.status)}</span></InfoRow><InfoRow icon={<Paperclip size={16} />} label="Categoria"><span>{ticket.category.path}</span></InfoRow></section>
          {attendant && <section className="panel update-panel"><div className="panel-heading"><div><h2>Atualizar chamado</h2><p>Ações visíveis para a equipe</p></div></div><form onSubmit={updateTicket}><label className="field-label" htmlFor="detail-status">Status</label><select id="detail-status" className="text-input" value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value as TicketStatus)}><option value="new">Novo</option><option value="triage">Em triagem</option><option value="in_progress">Em atendimento</option><option value="resolved">Resolvido</option><option value="closed">Encerrado</option></select><label className="field-label" htmlFor="detail-comment">Adicionar comentário</label><textarea id="detail-comment" className="text-input detail-comment" value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Escreva uma atualização para o solicitante..." rows={5} /><button className="button button-primary button-full" disabled={saving} type="submit">{saving ? <><span className="spinner spinner-light" /> Salvando...</> : <><Send size={15} /> Salvar atualização</>}</button></form></section>}
          {!attendant && <section className="panel help-detail-card"><span className="help-icon"><MessageSquare size={17} /></span><strong>Precisa complementar?</strong><p>Responda ao chamado para enviar novas informações à equipe de suporte.</p><button className="button button-secondary button-full">Adicionar resposta</button></section>}
        </aside>
      </div>
    </>
  )
}

function InfoRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) { return <div className="info-row"><span className="info-row-icon">{icon}</span><div><small>{label}</small><div className="info-value">{children}</div></div></div> }

function formatDueDate(value: string, status: TicketStatus) { if (['resolved', 'closed'].includes(status)) return 'Atendimento concluído'; return `até ${new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} às ${new Date(value).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}` }
function isOverdue(ticket: Ticket) { return new Date(ticket.slaDueAt).getTime() < Date.now() && !['resolved', 'closed'].includes(ticket.status) }
