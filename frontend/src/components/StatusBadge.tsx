import type { TicketStatus } from '../types'
import { statusLabels } from '../services/ticketsApi'

const statusClass: Record<TicketStatus, string> = {
  new: 'status-new',
  triage: 'status-triage',
  in_progress: 'status-progress',
  resolved: 'status-resolved',
  closed: 'status-closed',
}

export function StatusBadge({ status }: { status: TicketStatus }) {
  return <span className={`status-badge ${statusClass[status]}`}>{statusLabels[status]}</span>
}
