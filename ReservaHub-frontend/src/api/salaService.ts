import { api } from './client'
import type { Sala } from '../types'

export const salaService = {
  listar: () => api.get<Sala[]>('/api/salas').then((r) => r.data),
  listarAtivas: () => api.get<Sala[]>('/api/salas/ativas').then((r) => r.data),
  buscarPorId: (id: number) => api.get<Sala>(`/api/salas/${id}`).then((r) => r.data),
  criar: (data: Omit<Sala, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.post<Sala>('/api/salas', data).then((r) => r.data),
  atualizar: (id: number, data: Partial<Sala>) =>
    api.put<Sala>(`/api/salas/${id}`, { id, ...data }).then((r) => r.data),
  excluir: (id: number) => api.delete(`/api/salas/${id}`),
}
