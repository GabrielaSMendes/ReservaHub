import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function formatDate(date: string): string {
  try {
    return format(parseISO(date), 'dd/MM/yyyy', { locale: ptBR })
  } catch {
    return date
  }
}

export function formatTime(time: string): string {
  return time?.slice(0, 5) ?? time
}

export function formatDateTime(dateTime?: string | null): string {
  if (!dateTime) return '-'
  try {
    return format(parseISO(dateTime), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
  } catch {
    return dateTime
  }
}

export function normalizeCpf(cpf: string): string {
  return cpf.replace(/\D/g, '')
}

export function formatCpf(cpf: string): string {
  const digits = normalizeCpf(cpf)
  if (digits.length !== 11) return cpf
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

export function maskCpf(value: string): string {
  const digits = normalizeCpf(value).slice(0, 11)
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}
