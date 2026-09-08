import type { Priority } from '../types'

const labels: Record<Priority, string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
  critical: 'Crítica',
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  return <span className={`priority priority-${priority}`}><span className="priority-dot" />{labels[priority]}</span>
}

export { labels as priorityLabels }
