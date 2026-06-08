import type { AuthUser, Usuario } from '../types'
import { normalizeCpf } from './format'

const AUTH_KEY = 'reservahub_auth'
const PASSWORDS_KEY = 'reservahub_passwords'

// Senhas de seed para desenvolvimento local — removidas no build de produção
const TEST_PASSWORDS: Record<string, string> = import.meta.env.DEV
  ? {
      '11111111111': '123456',
      '22222222222': '123456',
      '33333333333': '123456',
      '44444444444': 'admin123',
    }
  : {}

export function isAdminUser(usuario: Usuario): boolean {
  // Usa idPerfil quando disponível (2 = admin); fallback para heurística de e-mail
  if (usuario.idPerfil != null) return usuario.idPerfil === 2
  return usuario.email.toLowerCase().includes('admin')
}

export function toAuthUser(usuario: Usuario): AuthUser {
  return {
    id: usuario.id,
    nome: usuario.nome,
    cpf: usuario.cpf,
    email: usuario.email,
    telefone: usuario.telefone,
    ativo: usuario.ativo,
    isAdmin: isAdminUser(usuario),
  }
}

function getStoredPasswords(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(PASSWORDS_KEY) ?? '{}')
  } catch {
    return {}
  }
}

export function storePassword(cpf: string, senha: string): void {
  const passwords = getStoredPasswords()
  passwords[normalizeCpf(cpf)] = senha
  localStorage.setItem(PASSWORDS_KEY, JSON.stringify(passwords))
}

export function getPasswordForCpf(cpf: string): string | undefined {
  const key = normalizeCpf(cpf)
  return getStoredPasswords()[key] ?? TEST_PASSWORDS[key]
}

export function validatePassword(cpf: string, senha: string): boolean {
  const expected = getPasswordForCpf(cpf)
  return expected === senha
}

export function resolvePassword(cpf: string, senhaInput: string): string {
  return senhaInput || getPasswordForCpf(cpf) || ''
}

export function saveAuth(user: AuthUser): void {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user))
}

export function loadAuth(): AuthUser | null {
  try {
    const data = localStorage.getItem(AUTH_KEY)
    return data ? (JSON.parse(data) as AuthUser) : null
  } catch {
    return null
  }
}

export function clearAuth(): void {
  localStorage.removeItem(AUTH_KEY)
}
