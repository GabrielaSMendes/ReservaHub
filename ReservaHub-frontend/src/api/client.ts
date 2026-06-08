import axios, { AxiosError } from 'axios'
import type { ApiError } from '../types'

const baseURL = import.meta.env.VITE_API_URL || ''

export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('reservahub_auth')
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>
    if (error.code === 'ECONNABORTED') return 'Tempo de conexão esgotado. Tente novamente.'
    return axiosError.response?.data?.message ?? axiosError.message
  }
  if (error instanceof Error) return error.message
  return 'Ocorreu um erro inesperado'
}
