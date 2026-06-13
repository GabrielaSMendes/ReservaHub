import { useCallback, useEffect, useState } from 'react'
import { addDays, format, parseISO, startOfDay } from 'date-fns'
import { CalendarDays, Plus, Repeat, XCircle } from 'lucide-react'
import { reservaService } from '../api/reservaService'
import { salaService } from '../api/salaService'
import { getErrorMessage } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card, CardBody, CardHeader } from '../components/ui/Card'
import { ConfirmModal } from '../components/ui/ConfirmModal'
import { EmptyState } from '../components/ui/EmptyState'
import { Input } from '../components/ui/Input'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { Modal } from '../components/ui/Modal'
import { Select } from '../components/ui/Select'
import type { Reserva, Sala } from '../types'
import { gerarHorariosDisponiveis, horarioDisponivel } from '../utils/availability'
import { formatDate, formatTime } from '../utils/format'

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

const diaSemanaFormatter = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' })

function proximaDataParaMesmoDiaDaSemana(dataReserva: string): string {
  const hoje = startOfDay(new Date())
  const diaDaReserva = parseISO(dataReserva).getDay()
  const diasAteProximaData = (diaDaReserva - hoje.getDay() + 7) % 7

  return format(addDays(hoje, diasAteProximaData), 'yyyy-MM-dd')
}

function ordenarReservasMaisRecentes(a: Reserva, b: Reserva): number {
  return `${b.dataReserva}T${b.horaInicio}`.localeCompare(`${a.dataReserva}T${a.horaInicio}`)
}

/** Agrupa por sala + dia da semana + horário para não repetir o mesmo padrão. */
function chavePadraoRecorrente(reserva: Reserva): string {
  const diaSemana = parseISO(reserva.dataReserva).getDay()
  return `${reserva.salaId}-${diaSemana}-${reserva.horaInicio}-${reserva.horaFim}`
}

function montarRecomendacoesRecorrentes(
  reservasDoUsuario: Reserva[],
  todasReservas: Reserva[]
) {
  const padroesVistos = new Set<string>()
  const recomendacoes: Array<{
    chave: string
    reserva: Reserva
    dataSugerida: string
    disponivel: boolean
  }> = []

  for (const reserva of reservasDoUsuario
    .filter((r) => r.status !== 'CANCELADA')
    .sort(ordenarReservasMaisRecentes)) {
    const chave = chavePadraoRecorrente(reserva)
    if (padroesVistos.has(chave)) continue
    padroesVistos.add(chave)

    const dataSugerida = proximaDataParaMesmoDiaDaSemana(reserva.dataReserva)

    const jaReservado = reservasDoUsuario.some(
      (r) =>
        r.status === 'ATIVA' &&
        r.salaId === reserva.salaId &&
        r.dataReserva === dataSugerida &&
        r.horaInicio === reserva.horaInicio &&
        r.horaFim === reserva.horaFim
    )
    if (jaReservado) continue

    recomendacoes.push({
      chave,
      reserva,
      dataSugerida,
      disponivel: horarioDisponivel(
        todasReservas,
        reserva.salaId,
        dataSugerida,
        reserva.horaInicio,
        reserva.horaFim
      ),
    })

    if (recomendacoes.length >= 3) break
  }

  return recomendacoes
}

export function Reservas() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [salas, setSalas] = useState<Sala[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [canceling, setCanceling] = useState(false)
  const [reservaRecorrenteId, setReservaRecorrenteId] = useState<number | null>(null)
  const [filtro, setFiltro] = useState<'todas' | 'ativas' | 'canceladas'>('todas')
  const [reservaParaCancelar, setReservaParaCancelar] = useState<Reserva | null>(null)
  const [form, setForm] = useState({
    salaId: '',
    dataReserva: '',
    horaInicio: '',
    horaFim: '',
    observacao: '',
  })

  const load = useCallback(async () => {
    try {
      const [reservasData, salasData] = await Promise.all([
        reservaService.listar(),
        salaService.listarAtivas(),
      ])
      setReservas(reservasData)
      setSalas(salasData)
    } catch (error) {
      showToast(getErrorMessage(error), 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    load()
  }, [load])

  const minhasReservas = user?.isAdmin
    ? reservas
    : reservas.filter((r) => r.usuarioId === user?.id)

  const reservasDoUsuario = reservas.filter((r) => r.usuarioId === user?.id)

  const reservasFiltradas = minhasReservas.filter((r) => {
    if (filtro === 'ativas') return r.status === 'ATIVA'
    if (filtro === 'canceladas') return r.status === 'CANCELADA'
    return true
  })

  const horariosDisponiveis =
    form.salaId && form.dataReserva
      ? gerarHorariosDisponiveis(reservas, Number(form.salaId), form.dataReserva)
      : []

  const recomendacoesRecorrentes = montarRecomendacoesRecorrentes(reservasDoUsuario, reservas)

  const openCreate = () => {
    setForm({
      salaId: '',
      dataReserva: new Date().toISOString().split('T')[0],
      horaInicio: '',
      horaFim: '',
      observacao: '',
    })
    setModalOpen(true)
  }

  const selectSlot = (inicio: string, fim: string) => {
    setForm((prev) => ({ ...prev, horaInicio: inicio, horaFim: fim }))
  }

  const handleSave = async () => {
    if (!form.salaId || !form.dataReserva || !form.horaInicio || !form.horaFim) {
      showToast('Preencha todos os campos obrigatórios', 'error')
      return
    }

    setSaving(true)
    try {
      await reservaService.criar({
        usuarioId: user!.id,
        salaId: Number(form.salaId),
        dataReserva: form.dataReserva,
        horaInicio: form.horaInicio,
        horaFim: form.horaFim,
        status: 'ATIVA',
        observacao: form.observacao || null,
      })
      showToast('Reserva criada com sucesso!', 'success')
      setModalOpen(false)
      await load()
    } catch (error) {
      showToast(getErrorMessage(error), 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleReservarRecorrente = async (reserva: Reserva, dataSugerida: string) => {
    setReservaRecorrenteId(reserva.id)
    try {
      await reservaService.criar({
        usuarioId: user!.id,
        salaId: reserva.salaId,
        dataReserva: dataSugerida,
        horaInicio: reserva.horaInicio,
        horaFim: reserva.horaFim,
        status: 'ATIVA',
        observacao: reserva.observacao || null,
      })
      showToast('Reserva recorrente criada com sucesso!', 'success')
      await load()
    } catch (error) {
      showToast(getErrorMessage(error), 'error')
    } finally {
      setReservaRecorrenteId(null)
    }
  }

  const handleCancelar = async () => {
    if (!reservaParaCancelar) return
    setCanceling(true)
    try {
      await reservaService.cancelar(reservaParaCancelar.id)
      showToast('Reserva cancelada com sucesso!', 'success')
      setReservaParaCancelar(null)
      await load()
    } catch (error) {
      showToast(getErrorMessage(error), 'error')
    } finally {
      setCanceling(false)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reservas</h1>
          <p className="text-slate-500">
            {user?.isAdmin ? 'Histórico e gestão de reservas' : 'Suas reservas de salas'}
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Nova reserva
        </Button>
      </div>

      <div className="mb-6 flex gap-2">
        {(['todas', 'ativas', 'canceladas'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              filtro === f
                ? 'bg-brand-600 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {f === 'todas' ? 'Todas' : f === 'ativas' ? 'Ativas' : 'Canceladas'}
          </button>
        ))}
      </div>

      {recomendacoesRecorrentes.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <Repeat className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900">Reservas recorrentes sugeridas</h2>
                <p className="text-sm text-slate-500">
                  Baseadas nas suas últimas 3 reservas não canceladas.
                </p>
              </div>
            </div>
          </CardHeader>
          <CardBody>
            <div className="grid gap-3 lg:grid-cols-3">
              {recomendacoesRecorrentes.map(({ chave, reserva, dataSugerida, disponivel }) => (
                <div
                  key={chave}
                  className="rounded-xl border border-slate-100 bg-slate-50/60 p-4"
                >
                  <div className="mb-4">
                    <p className="font-medium text-slate-900">{reserva.salaNome}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {diaSemanaFormatter.format(parseISO(dataSugerida))}, {formatDate(dataSugerida)}
                    </p>
                    <p className="text-sm text-slate-500">
                      {formatTime(reserva.horaInicio)} - {formatTime(reserva.horaFim)}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="w-full"
                    disabled={!disponivel}
                    loading={reservaRecorrenteId === reserva.id}
                    onClick={() => handleReservarRecorrente(reserva, dataSugerida)}
                  >
                    {disponivel ? 'Reservar já' : 'Horário indisponível'}
                  </Button>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {reservasFiltradas.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="Nenhuma reserva encontrada"
          description="Crie uma nova reserva para utilizar as salas do coworking."
          action={
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" />
              Nova reserva
            </Button>
          }
        />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-slate-500">
                  <th className="px-6 py-3 font-medium">Sala</th>
                  {user?.isAdmin && <th className="px-6 py-3 font-medium">Usuário</th>}
                  <th className="px-6 py-3 font-medium">Data</th>
                  <th className="px-6 py-3 font-medium">Horário</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {reservasFiltradas.map((r) => (
                  <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-medium text-slate-900">{r.salaNome}</td>
                    {user?.isAdmin && (
                      <td className="px-6 py-4 text-slate-600">{r.usuarioNome}</td>
                    )}
                    <td className="px-6 py-4 text-slate-600">{formatDate(r.dataReserva)}</td>
                    <td className="px-6 py-4 text-slate-600">
                      {formatTime(r.horaInicio)} - {formatTime(r.horaFim)}
                    </td>
                    <td className="px-6 py-4">{statusBadge(r.status)}</td>
                    <td className="px-6 py-4">
                      {r.status === 'ATIVA' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setReservaParaCancelar(r)}
                        >
                          <XCircle className="h-4 w-4 text-red-500" />
                          Cancelar
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nova reserva" size="lg">
        <div className="space-y-4">
          <Select
            label="Sala"
            value={form.salaId}
            onChange={(e) =>
              setForm({ ...form, salaId: e.target.value, horaInicio: '', horaFim: '' })
            }
            placeholder="Selecione uma sala"
            options={salas.map((s) => ({
              value: s.id,
              label: `${s.nomeSala} (${s.capacidade} pessoas)`,
            }))}
          />
          <Input
            label="Data"
            type="date"
            value={form.dataReserva}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) =>
              setForm({ ...form, dataReserva: e.target.value, horaInicio: '', horaFim: '' })
            }
            required
          />

          {form.salaId && form.dataReserva && (
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Horários disponíveis
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {horariosDisponiveis.map((slot) => (
                  <button
                    key={`${slot.inicio}-${slot.fim}`}
                    type="button"
                    disabled={!slot.disponivel}
                    onClick={() => selectSlot(slot.inicio, slot.fim)}
                    className={`rounded-lg border px-2 py-2 text-xs font-medium transition-colors ${
                      !slot.disponivel
                        ? 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed'
                        : form.horaInicio === slot.inicio
                          ? 'border-brand-500 bg-brand-50 text-brand-700'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-brand-300'
                    }`}
                  >
                    {formatTime(slot.inicio)} - {formatTime(slot.fim)}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Início"
              type="time"
              value={form.horaInicio}
              onChange={(e) => setForm({ ...form, horaInicio: e.target.value })}
              required
            />
            <Input
              label="Fim"
              type="time"
              value={form.horaFim}
              onChange={(e) => setForm({ ...form, horaFim: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Observação</label>
            <textarea
              className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              rows={2}
              value={form.observacao}
              onChange={(e) => setForm({ ...form, observacao: e.target.value })}
              placeholder="Informações adicionais (opcional)"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} loading={saving}>
              Confirmar reserva
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        open={!!reservaParaCancelar}
        title="Cancelar reserva"
        message={`Deseja cancelar a reserva de ${reservaParaCancelar?.salaNome ?? ''}?`}
        confirmLabel="Cancelar reserva"
        cancelLabel="Manter"
        loading={canceling}
        onConfirm={handleCancelar}
        onCancel={() => setReservaParaCancelar(null)}
      />
    </div>
  )
}
