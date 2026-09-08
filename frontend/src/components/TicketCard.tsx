import { ArrowUpRight, Clock3, MessageCircle, Paperclip } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Ticket } from '../types'
import { Avatar } from './Avatar'
import { PriorityBadge } from './PriorityBadge'
import { StatusBadge } from './StatusBadge'

export function TicketCard({ ticket, attendant = false }: { ticket: Ticket; attendant?: boolean }) {
  return (
    <Link className="ticket-card" to={attendant ? `/atendimento/chamados/${ticket.id}` : `/chamados/${ticket.id}`}>
      <div className="ticket-card-top">
        <span className="ticket-protocol">{ticket.protocol}</span>
        <StatusBadge status={ticket.status} />
      </div>
      <h3>{ticket.title}</h3>
      <p>{ticket.description}</p>
      <div className="ticket-card-meta">
        <span><Clock3 size={14} /> {formatRelativeDate(ticket.updatedAt)}</span>
        <span><MessageCircle size={14} /> {ticket.timeline.filter((item) => item.type === 'comment').length}</span>
        {ticket.attachments.length > 0 && <span><Paperclip size={14} /> {ticket.attachments.length}</span>}
      </div>
      <div className="ticket-card-bottom">
        <div className="ticket-category"><span className="category-dot" />{ticket.category.path}</div>
        <PriorityBadge priority={ticket.priority} />
      </div>
      <ArrowUpRight className="card-arrow" size={17} />
    </Link>
  )
}

export function formatRelativeDate(value: string) {
  const difference = Date.now() - new Date(value).getTime()
  const minutes = Math.max(1, Math.floor(difference / 60000))
  if (minutes < 60) return `há ${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `há ${hours}h`
  const days = Math.floor(hours / 24)
  return `há ${days}d`
}

export function TicketTableRow({ ticket }: { ticket: Ticket }) {
  return (
    <Link className="ticket-table-row" to={`/atendimento/chamados/${ticket.id}`}>
      <div className="table-ticket-title"><span className="ticket-protocol">{ticket.protocol}</span><strong>{ticket.title}</strong><span>{ticket.category.path}</span></div>
      <div><Avatar user={ticket.requester} size="small" /><span className="row-requester-name">{ticket.requester.name}</span></div>
      <PriorityBadge priority={ticket.priority} />
      <StatusBadge status={ticket.status} />
      <span className="table-date">{formatRelativeDate(ticket.updatedAt)}</span>
      <ArrowUpRight className="row-arrow" size={16} />
    </Link>
  )
}
