import { NavLink } from 'react-router-dom'
import {
  Building2,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  Users,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

interface SidebarProps {
  onNavigate?: () => void
}

const navLinkBase =
  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `${navLinkBase} ${
    isActive
      ? 'bg-brand-50 text-brand-700'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  }`

export function Sidebar({ onNavigate }: SidebarProps) {
  const { user, logout } = useAuth()

  return (
    <aside className="flex w-64 flex-col border-r border-slate-200 bg-white">
      <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white">
          <Building2 className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-900">Reserva Hub</h1>
          <p className="text-xs text-slate-500">Coworking</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-4">
        <NavLink to="/" end className={navLinkClass} onClick={onNavigate}>
          <LayoutDashboard className="h-5 w-5" />
          Dashboard
        </NavLink>
        <NavLink to="/salas" className={navLinkClass} onClick={onNavigate}>
          <Building2 className="h-5 w-5" />
          Salas
        </NavLink>
        <NavLink to="/reservas" className={navLinkClass} onClick={onNavigate}>
          <CalendarDays className="h-5 w-5" />
          Reservas
        </NavLink>
        {user?.isAdmin && (
          <NavLink to="/usuarios" className={navLinkClass} onClick={onNavigate}>
            <Users className="h-5 w-5" />
            Usuários
          </NavLink>
        )}
      </nav>

      <div className="border-t border-slate-100 p-4">
        <div className="mb-3 rounded-lg bg-slate-50 px-3 py-2">
          <p className="truncate text-sm font-medium text-slate-900">{user?.nome}</p>
          <p className="text-xs text-slate-500">
            {user?.isAdmin ? 'Administrador' : 'Cliente'}
          </p>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Sair
        </button>
      </div>
    </aside>
  )
}
