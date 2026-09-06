import { Check, CircleDot, MessageSquare, UserRound } from 'lucide-react'
import type { TicketEvent } from '../types'
import { Avatar } from './Avatar'
import { formatRelativeDate } from './TicketCard'

export function TicketTimeline({ events }: { events: TicketEvent[] }) {
  return (
    <div className="timeline">
      {[...events].reverse().map((item, index) => (
        <div className="timeline-item" key={item.id}>
          <div className={`timeline-icon timeline-${item.type}`}>{item.type === 'comment' ? <MessageSquare size={14} /> : item.type === 'assignment' ? <UserRound size={14} /> : item.type === 'status' ? <Check size={14} /> : <CircleDot size={14} />}</div>
          <div className="timeline-content">
            <div className="timeline-heading"><strong>{item.author.name}</strong><span>{formatRelativeDate(item.createdAt)}</span></div>
            <p>{item.message}</p>
            {item.type === 'comment' && <div className="timeline-author"><Avatar user={item.author} size="small" /> {item.author.role === 'attendant' ? 'Atendente HelpCorp' : 'Solicitante'}</div>}
          </div>
          {index < events.length - 1 && <span className="timeline-line" />}
        </div>
      ))}
    </div>
  )
}
