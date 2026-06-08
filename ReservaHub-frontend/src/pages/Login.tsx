import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Building2, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { maskCpf } from '../utils/format'

export function Login() {
  const { user, login } = useAuth()
  const { showToast } = useToast()
  const [cpf, setCpf] = useState('')
  const [senha, setSenha] = useState('')
  const [showSenha, setShowSenha] = useState(false)
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to="/" replace />

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(cpf, senha)
      showToast('Login realizado com sucesso!', 'success')
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Erro ao fazer login', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-700 to-brand-900 p-12 flex-col justify-between text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
            <Building2 className="h-6 w-6" />
          </div>
          <span className="text-2xl font-bold">Reserva Hub</span>
        </div>
        <div>
          <h2 className="text-4xl font-bold leading-tight">
            Gerencie reservas do seu coworking com facilidade
          </h2>
          <p className="mt-4 text-lg text-brand-100">
            Reserve salas, evite conflitos de horário e acompanhe a ocupação em tempo real.
          </p>
        </div>
        <p className="text-sm text-brand-200">© 2026 Reserva Hub</p>
      </div>

      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white">
              <Building2 className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-slate-900">Reserva Hub</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900">Entrar na sua conta</h1>
          <p className="mt-2 text-slate-500">Use seu CPF e senha para acessar o sistema.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <Input
              label="CPF"
              value={cpf}
              onChange={(e) => setCpf(maskCpf(e.target.value))}
              placeholder="000.000.000-00"
              required
            />
            <div className="relative">
              <Input
                label="Senha"
                type={showSenha ? 'text' : 'password'}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Digite sua senha"
                required
              />
              <button
                type="button"
                onClick={() => setShowSenha(!showSenha)}
                className="absolute right-3 top-[34px] text-slate-400 hover:text-slate-600"
              >
                {showSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <Button type="submit" className="w-full" loading={loading}>
              Entrar
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Não tem conta?{' '}
            <Link to="/cadastro" className="font-medium text-brand-600 hover:text-brand-700">
              Cadastre-se
            </Link>
          </p>

          {import.meta.env.DEV && (
            <div className="mt-8 rounded-lg bg-slate-50 p-4 text-xs text-slate-500">
              <p className="font-medium text-slate-700 mb-2">Contas de teste:</p>
              <p>Cliente: 111.111.111-11 / 123456</p>
              <p>Admin: 444.444.444-44 / admin123</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
