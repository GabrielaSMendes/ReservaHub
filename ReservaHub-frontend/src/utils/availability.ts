import type { Reserva, TimeSlot } from '../types'

const HORA_ABERTURA = 8
const HORA_FECHAMENTO = 18
const INTERVALO_MINUTOS = 60

function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

function fromMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function overlaps(
  inicio: number,
  fim: number,
  reservaInicio: number,
  reservaFim: number
): boolean {
  return inicio < reservaFim && fim > reservaInicio
}

export function gerarHorariosDisponiveis(
  reservas: Reserva[],
  salaId: number,
  data: string
): TimeSlot[] {
  const reservasAtivas = reservas.filter(
    (r) => r.salaId === salaId && r.dataReserva === data && r.status === 'ATIVA'
  )

  const slots: TimeSlot[] = []
  const inicioDia = HORA_ABERTURA * 60
  const fimDia = HORA_FECHAMENTO * 60

  for (let min = inicioDia; min + INTERVALO_MINUTOS <= fimDia; min += INTERVALO_MINUTOS) {
    const slotFim = min + INTERVALO_MINUTOS
    const conflito = reservasAtivas.find((r) =>
      overlaps(min, slotFim, toMinutes(r.horaInicio), toMinutes(r.horaFim))
    )

    slots.push({
      inicio: fromMinutes(min),
      fim: fromMinutes(slotFim),
      disponivel: !conflito,
      reservaId: conflito?.id,
    })
  }

  return slots
}

export function horarioDisponivel(
  reservas: Reserva[],
  salaId: number,
  data: string,
  horaInicio: string,
  horaFim: string,
  reservaId?: number
): boolean {
  const inicio = toMinutes(horaInicio)
  const fim = toMinutes(horaFim)

  return !reservas.some(
    (r) =>
      r.id !== reservaId &&
      r.salaId === salaId &&
      r.dataReserva === data &&
      r.status === 'ATIVA' &&
      overlaps(inicio, fim, toMinutes(r.horaInicio), toMinutes(r.horaFim))
  )
}
