import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { AttendantPage } from './pages/AttendantPage'
import { NewTicketPage } from './pages/NewTicketPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { TicketDetailPage } from './pages/TicketDetailPage'
import { TicketsPage } from './pages/TicketsPage'
import type { UserRole } from './types'

export default function App() {
  const [role, setRole] = useState<UserRole>('requester')

  return (
    <Layout role={role} onRoleChange={setRole}>
      <Routes>
        <Route path="/" element={<Navigate to={role === 'attendant' ? '/atendimento' : '/chamados'} replace />} />
        <Route path="/chamados" element={<TicketsPage />} />
        <Route path="/chamados/novo" element={<NewTicketPage />} />
        <Route path="/chamados/:id" element={<TicketDetailPage />} />
        <Route path="/atendimento" element={<AttendantPage />} />
        <Route path="/atendimento/chamados/:id" element={<TicketDetailPage attendant />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  )
}
