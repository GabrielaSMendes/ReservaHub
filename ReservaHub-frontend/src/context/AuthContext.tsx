import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { usuarioService } from '../api/usuarioService'
import { getErrorMessage } from '../api/client'
import type { AuthUser } from '../types'
import {
  clearAuth,
  loadAuth,
  saveAuth,
  storePassword,
  toAuthUser,
  validatePassword,
} from '../utils/auth'
import { normalizeCpf } from '../utils/format'

interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  login: (cpf: string, senha: string) => Promise<void>
  register: (data: {
    nome: string
    cpf: string
    email: string
    senha: string
    telefone?: string
  }) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setUser(loadAuth())
    setLoading(false)
  }, [])

  const login = useCallback(async (cpf: string, senha: string) => {
    const usuarios = await usuarioService.listar()
    const usuario = usuarios.find((u) => normalizeCpf(u.cpf) === normalizeCpf(cpf))

    if (!usuario) throw new Error('CPF não encontrado')
    if (usuario.ativo === false) throw new Error('Usuário bloqueado. Contate o administrador.')
    if (!validatePassword(cpf, senha)) throw new Error('Senha incorreta')

    const authUser = toAuthUser(usuario)
    saveAuth(authUser)
    setUser(authUser)
  }, [])

  const register = useCallback(
    async (data: {
      nome: string
      cpf: string
      email: string
      senha: string
      telefone?: string
    }) => {
      try {
        const criado = await usuarioService.criar({
          nome: data.nome,
          cpf: data.cpf,
          email: data.email,
          senha: data.senha,
          telefone: data.telefone ?? null,
          ativo: true,
        })
        storePassword(data.cpf, data.senha)
        const authUser = toAuthUser(criado)
        saveAuth(authUser)
        setUser(authUser)
      } catch (error) {
        throw new Error(getErrorMessage(error))
      }
    },
    []
  )

  const logout = useCallback(() => {
    clearAuth()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}
