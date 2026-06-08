export type ReservaStatus = 'ATIVA' | 'CANCELADA' | 'FINALIZADA'

export interface Usuario {
  id: number
  nome: string
  cpf: string
  email: string
  senha?: string | null
  telefone?: string | null
  ativo?: boolean | null
  /** 1 = cliente, 2 = administrador — exposto pelo backend quando disponível */
  idPerfil?: number | null
  createdAt?: string | null
  updatedAt?: string | null
}

export interface Sala {
  id: number
  nomeSala: string
  descricao?: string | null
  capacidade: number
  status?: boolean | null
  createdAt?: string | null
  updatedAt?: string | null
}

export interface Reserva {
  id: number
  usuarioId: number
  usuarioNome?: string | null
  salaId: number
  salaNome?: string | null
  dataReserva: string
  horaInicio: string
  horaFim: string
  status?: ReservaStatus | null
  observacao?: string | null
  createdAt?: string | null
  updatedAt?: string | null
}

export interface AuthUser {
  id: number
  nome: string
  cpf: string
  email: string
  telefone?: string | null
  ativo?: boolean | null
  isAdmin: boolean
}

export interface ApiError {
  timestamp?: string
  status?: number
  error?: string
  message?: string
}

export interface TimeSlot {
  inicio: string
  fim: string
  disponivel: boolean
  reservaId?: number
}
