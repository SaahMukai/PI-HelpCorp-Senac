import { Bell, ChevronDown, Headphones, LayoutDashboard, LifeBuoy, LogOut, Menu, Plus, Search, Ticket, UserRound, X } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import type { UserRole } from '../types'
import { requesterUser, attendantUser } from '../data/users'
import { Avatar } from './Avatar'

interface LayoutProps {
  children: ReactNode
  role: UserRole
  onRoleChange: (role: UserRole) => void
}

export function Layout({ children, role, onRoleChange }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const user = role === 'requester' ? requesterUser : attendantUser
  const isAttendant = role === 'attendant'
  const navItems = isAttendant
    ? [{ to: '/atendimento', label: 'Fila de atendimento', icon: Headphones }]
    : [
        { to: '/chamados', label: 'Meus chamados', icon: Ticket },
        { to: '/chamados/novo', label: 'Abrir chamado', icon: Plus },
      ]

  const closeMobile = () => setMobileOpen(false)
  const changeRole = (nextRole: UserRole) => {
    onRoleChange(nextRole)
    navigate(nextRole === 'attendant' ? '/atendimento' : '/chamados')
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        <div className="brand-wrap">
          <Link className="brand" to={isAttendant ? '/atendimento' : '/chamados'} onClick={closeMobile}>
            <span className="brand-mark"><LifeBuoy size={20} /></span>
            <span>Help<span>Corp</span></span>
          </Link>
          <button className="icon-button mobile-close" onClick={closeMobile} aria-label="Fechar menu"><X size={20} /></button>
        </div>

        <div className="workspace-label">Workspace corporativo</div>
        <nav className="main-nav">
          <span className="nav-section-label">NAVEGAÇÃO</span>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} end={to === '/chamados'} to={to} onClick={closeMobile} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Icon size={18} /> <span>{label}</span>
            </NavLink>
          ))}
          <NavLink to={isAttendant ? '/atendimento' : '/chamados'} onClick={closeMobile} className={({ isActive }) => `nav-link ${isActive && location.pathname === (isAttendant ? '/atendimento' : '/chamados') ? 'active' : ''}`}>
            <LayoutDashboard size={18} /> <span>Visão geral</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="help-card">
            <div className="help-icon"><Headphones size={17} /></div>
            <strong>Precisa de ajuda?</strong>
            <span>Fale com o suporte HelpCorp.</span>
            <button className="text-button">Ver central de ajuda <span>→</span></button>
          </div>
          <div className="user-mini">
            <Avatar user={user} size="small" />
            <div><strong>{user.name}</strong><span>{isAttendant ? 'Atendente' : 'Solicitante'}</span></div>
            <button className="icon-button" aria-label="Sair da conta"><LogOut size={16} /></button>
          </div>
        </div>
      </aside>

      {mobileOpen && <button className="sidebar-overlay" onClick={closeMobile} aria-label="Fechar menu" />}

      <div className="main-area">
        <header className="topbar">
          <button className="icon-button mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Abrir menu"><Menu size={21} /></button>
          <div className="topbar-search"><Search size={17} /><input placeholder="Buscar chamados..." aria-label="Buscar chamados" /><kbd>⌘ K</kbd></div>
          <div className="topbar-actions">
            <button className="icon-button notification-button" aria-label="Notificações"><Bell size={19} /><span /></button>
            <div className="profile-switcher">
              <Avatar user={user} size="small" />
              <select value={role} onChange={(event) => changeRole(event.target.value as UserRole)} aria-label="Perfil de demonstração">
                <option value="requester">Camila · Solicitante</option>
                <option value="attendant">Ricardo · Atendente</option>
              </select>
              <ChevronDown size={14} />
            </div>
          </div>
        </header>
        <main className="content">{children}</main>
      </div>
    </div>
  )
}
