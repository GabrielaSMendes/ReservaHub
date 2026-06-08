import { api } from './client'
import type { Reserva } from '../types'

export type ReservaInput = Omit<
  Reserva,
  'id' | 'usuarioNome' | 'salaNome' | 'createdAt' | 'updatedAt'
>

export const reservaService = {
  listar: () => api.get<Reserva[]>('/api/reservas').then((r) => r.data),
  buscarPorId: (id: number) => api.get<Reserva>(`/api/reservas/${id}`).then((r) => r.data),
  criar: (data: ReservaInput) => api.post<Reserva>('/api/reservas', data).then((r) => r.data),
  atualizar: (id: number, data: ReservaInput) =>
    api.put<Reserva>(`/api/reservas/${id}`, { id, ...data }).then((r) => r.data),
  cancelar: (id: number) => api.patch<Reserva>(`/api/reservas/${id}/cancelar`).then((r) => r.data),
  excluir: (id: number) => api.delete(`/api/reservas/${id}`),
}
