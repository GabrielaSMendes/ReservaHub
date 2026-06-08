import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Building2, CalendarCheck, CalendarDays, Users } from 'lucide-react'
import { reservaService } from '../api/reservaService'
import { salaService } from '../api/salaService'
import { usuarioService } from '../api/usuarioService'
import { getErrorMessage } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { Badge } from '../components/ui/Badge'
import { Card, CardBody, CardHeader } from '../components/ui/Card'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import type { Reserva, Sala } from '../types'
import { formatDate, formatTime } from '../utils/format'

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Building2
  label: string
  value: number
  color: string
}) {
  return (
    <Card>
      <CardBody className="flex items-center gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
        </div>
      </CardBody>
    </Card>
  )
}

function statusBadge(status?: string | null) {
  switch (status) {
    case 'ATIVA':
      return <Badge variant="success">Ativa</Badge>
    case 'CANCELADA':
      return <Badge variant="danger">Cancelada</Badge>
    case 'FINALIZADA':
      return <Badge variant="default">Finalizada</Badge>
    default:
      return <Badge>{status}</Badge>
  }
}

export function Dashboard() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [salas, setSalas] = useState<Sala[]>([])
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [totalUsuarios, setTotalUsuarios] = useState(0)

  useEffect(() => {
    async function load() {
      try {
        const [salasData, reservasData] = await Promise.all([
          salaService.listarAtivas(),
          reservaService.listar(),
        ])
        setSalas(salasData)
        setReservas(reservasData)

        if (user?.isAdmin) {
          const usuarios = await usuarioService.listar()
          setTotalUsuarios(usuarios.length)
        }
      } catch (error) {
        showToast(getErrorMessage(error), 'error')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user?.isAdmin, showToast])

  if (loading) return <LoadingSpinner />

  const minhasReservas = user?.isAdmin
    ? reservas
    : reservas.filter((r) => r.usuarioId === user?.id)

  const reservasAtivas = minhasReservas.filter((r) => r.status === 'ATIVA')
  const proximasReservas = reservasAtivas
    .filter((r) => r.dataReserva >= new Date().toISOString().split('T')[0])
    .slice(0, 5)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Olá, {user?.nome?.split(' ')[0]}!
        </h1>
        <p className="text-slate-500">Bem-vindo ao painel do Reserva Hub.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          icon={Building2}
          label="Salas disponíveis"
          value={salas.length}
          color="bg-brand-100 text-brand-600"
        />
        <StatCard
          icon={CalendarCheck}
          label="Reservas ativas"
          value={reservasAtivas.length}
          color="bg-emerald-100 text-emerald-600"
        />
        <StatCard
          icon={CalendarDays}
          label="Total de reservas"
          value={minhasReservas.length}
          color="bg-amber-100 text-amber-600"
        />
        {user?.isAdmin && (
          <StatCard
            icon={Users}
            label="Usuários cadastrados"
            value={totalUsuarios}
            color="bg-violet-100 text-violet-600"
          />
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">Próximas reservas</h2>
              <Link to="/reservas" className="text-sm text-brand-600 hover:text-brand-700">
                Ver todas
              </Link>
            </div>
          </CardHeader>
          <CardBody>
            {proximasReservas.length === 0 ? (
              <p className="text-sm text-slate-500 py-4 text-center">
                Nenhuma reserva futura encontrada.
              </p>
            ) : (
              <div className="space-y-3">
                {proximasReservas.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between rounded-lg border border-slate-100 p-3"
                  >
                    <div>
                      <p className="font-medium text-slate-900">{r.salaNome}</p>
                      <p className="text-sm text-slate-500">
                        {formatDate(r.dataReserva)} · {formatTime(r.horaInicio)} -{' '}
                        {formatTime(r.horaFim)}
                      </p>
                    </div>
                    {statusBadge(r.status)}
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">Salas disponíveis</h2>
              <Link to="/salas" className="text-sm text-brand-600 hover:text-brand-700">
                Ver todas
              </Link>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {salas.slice(0, 5).map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between rounded-lg border border-slate-100 p-3"
                >
                  <div>
                    <p className="font-medium text-slate-900">{s.nomeSala}</p>
                    <p className="text-sm text-slate-500">
                      Capacidade: {s.capacidade} pessoas
                    </p>
                  </div>
                  <Badge variant="success">Disponível</Badge>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
