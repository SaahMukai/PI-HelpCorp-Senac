import { Check } from 'lucide-react'
import type { TicketStatus } from '../types'
import { statusLabels } from '../services/ticketsApi'

const steps: TicketStatus[] = ['new', 'triage', 'in_progress', 'resolved', 'closed']

export function StatusStepper({ status }: { status: TicketStatus }) {
  const currentIndex = steps.indexOf(status)
  return (
    <div className="status-stepper" aria-label={`Status atual: ${statusLabels[status]}`}>
      {steps.map((step, index) => (
        <div className={`step ${index <= currentIndex ? 'step-done' : ''} ${step === status ? 'step-current' : ''}`} key={step}>
          <span className="step-dot">{index < currentIndex ? <Check size={13} /> : index + 1}</span>
          <span>{statusLabels[step]}</span>
          {index < steps.length - 1 && <span className="step-connector" />}
        </div>
      ))}
    </div>
  )
}
