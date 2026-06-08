import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Building2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { maskCpf } from '../utils/format'

export function Register() {
  const { user, register } = useAuth()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    senha: '',
    confirmarSenha: '',
  })

  if (user) return <Navigate to="/" replace />

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.senha !== form.confirmarSenha) {
      showToast('As senhas não coincidem', 'error')
      return
    }
    if (form.senha.length < 6) {
      showToast('A senha deve ter pelo menos 6 caracteres', 'error')
      return
    }

    setLoading(true)
    try {
      await register({
        nome: form.nome,
        cpf: form.cpf,
        email: form.email,
        senha: form.senha,
        telefone: form.telefone || undefined,
      })
      showToast('Cadastro realizado com sucesso!', 'success')
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Erro ao cadastrar', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-8">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white">
            <Building2 className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-slate-900">Reserva Hub</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Criar conta</h1>
          <p className="mt-2 text-sm text-slate-500">Preencha os dados para se cadastrar.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Input
              label="Nome completo"
              value={form.nome}
              onChange={(e) => update('nome', e.target.value)}
              required
            />
            <Input
              label="CPF"
              value={form.cpf}
              onChange={(e) => update('cpf', maskCpf(e.target.value))}
              placeholder="000.000.000-00"
              required
            />
            <Input
              label="E-mail"
              type="email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              required
            />
            <Input
              label="Telefone"
              value={form.telefone}
              onChange={(e) => update('telefone', e.target.value)}
              placeholder="(00) 00000-0000"
            />
            <Input
              label="Senha"
              type="password"
              value={form.senha}
              onChange={(e) => update('senha', e.target.value)}
              required
            />
            <Input
              label="Confirmar senha"
              type="password"
              value={form.confirmarSenha}
              onChange={(e) => update('confirmarSenha', e.target.value)}
              required
            />
            <Button type="submit" className="w-full" loading={loading}>
              Cadastrar
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Já tem conta?{' '}
            <Link to="/login" className="font-medium text-brand-600 hover:text-brand-700">
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
