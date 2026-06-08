import { api } from './client'
import type { Usuario } from '../types'

export const usuarioService = {
  listar: () => api.get<Usuario[]>('/api/usuarios').then((r) => r.data),
  buscarPorId: (id: number) => api.get<Usuario>(`/api/usuarios/${id}`).then((r) => r.data),
  criar: (data: Omit<Usuario, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.post<Usuario>('/api/usuarios', data).then((r) => r.data),
  atualizar: (id: number, data: Partial<Usuario>) =>
    api.put<Usuario>(`/api/usuarios/${id}`, { id, ...data }).then((r) => r.data),
  excluir: (id: number) => api.delete(`/api/usuarios/${id}`),
}
