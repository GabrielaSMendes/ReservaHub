import { useCallback, useEffect, useState } from 'react'
import { Pencil, Plus, Trash2, Users } from 'lucide-react'
import { usuarioService } from '../api/usuarioService'
import { getErrorMessage } from '../api/client'
import { useToast } from '../context/ToastContext'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { ConfirmModal } from '../components/ui/ConfirmModal'
import { EmptyState } from '../components/ui/EmptyState'
import { Input } from '../components/ui/Input'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { Modal } from '../components/ui/Modal'
import type { Usuario } from '../types'
import { resolvePassword, storePassword } from '../utils/auth'
import { formatCpf, maskCpf } from '../utils/format'

const emptyForm = {
  nome: '',
  cpf: '',
  email: '',
  telefone: '',
  senha: '',
  ativo: true,
}

export function UsuariosPage() {
  const { showToast } = useToast()
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Usuario | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [usuarioParaExcluir, setUsuarioParaExcluir] = useState<Usuario | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(async () => {
    try {
      const data = await usuarioService.listar()
      setUsuarios(data)
    } catch (error) {
      showToast(getErrorMessage(error), 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    load()
  }, [load])

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEdit = (usuario: Usuario) => {
    setEditing(usuario)
    setForm({
      nome: usuario.nome,
      cpf: usuario.cpf,
      email: usuario.email,
      telefone: usuario.telefone ?? '',
      senha: '',
      ativo: usuario.ativo ?? true,
    })
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.nome || !form.cpf || !form.email) {
      showToast('Preencha os campos obrigatórios', 'error')
      return
    }
    if (!editing && !form.senha) {
      showToast('Informe uma senha para o novo usuário', 'error')
      return
    }

    setSaving(true)
    try {
      const senha = resolvePassword(form.cpf, form.senha)
      if (!senha) {
        showToast('Informe a senha do usuário para salvar', 'error')
        setSaving(false)
        return
      }

      const payload = {
        nome: form.nome,
        cpf: form.cpf,
        email: form.email,
        telefone: form.telefone || null,
        ativo: form.ativo,
        senha,
      }

      if (editing) {
        await usuarioService.atualizar(editing.id, payload)
        showToast('Usuário atualizado com sucesso!', 'success')
      } else {
        await usuarioService.criar(payload)
        storePassword(form.cpf, senha)
        showToast('Usuário cadastrado com sucesso!', 'success')
      }

      setModalOpen(false)
      await load()
    } catch (error) {
      showToast(getErrorMessage(error), 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!usuarioParaExcluir) return
    setDeleting(true)
    try {
      await usuarioService.excluir(usuarioParaExcluir.id)
      showToast('Usuário excluído com sucesso!', 'success')
      setUsuarioParaExcluir(null)
      await load()
    } catch (error) {
      showToast(getErrorMessage(error), 'error')
    } finally {
      setDeleting(false)
    }
  }

  const toggleAtivo = async (usuario: Usuario) => {
    try {
      await usuarioService.atualizar(usuario.id, { ativo: !usuario.ativo })
      showToast(usuario.ativo ? 'Usuário bloqueado' : 'Usuário desbloqueado', 'success')
      await load()
    } catch (error) {
      showToast(getErrorMessage(error), 'error')
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Usuários</h1>
          <p className="text-slate-500">Gerencie os usuários do sistema</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Novo usuário
        </Button>
      </div>

      {usuarios.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Nenhum usuário cadastrado"
          action={
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" />
              Cadastrar usuário
            </Button>
          }
        />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-slate-500">
                  <th className="px-6 py-3 font-medium">Nome</th>
                  <th className="px-6 py-3 font-medium">CPF</th>
                  <th className="px-6 py-3 font-medium">E-mail</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-medium text-slate-900">{u.nome}</td>
                    <td className="px-6 py-4 text-slate-600">{formatCpf(u.cpf)}</td>
                    <td className="px-6 py-4 text-slate-600">{u.email}</td>
                    <td className="px-6 py-4">
                      <Badge variant={u.ativo ? 'success' : 'danger'}>
                        {u.ativo ? 'Ativo' : 'Bloqueado'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(u)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => toggleAtivo(u)}>
                          {u.ativo ? 'Bloquear' : 'Desbloquear'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setUsuarioParaExcluir(u)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Editar usuário' : 'Novo usuário'}
      >
        <div className="space-y-4">
          <Input
            label="Nome"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            required
          />
          <Input
            label="CPF"
            value={form.cpf}
            onChange={(e) => setForm({ ...form, cpf: maskCpf(e.target.value) })}
            disabled={!!editing}
            required
          />
          <Input
            label="E-mail"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <Input
            label="Telefone"
            value={form.telefone}
            onChange={(e) => setForm({ ...form, telefone: e.target.value })}
          />
          <Input
            label={editing ? 'Nova senha (opcional)' : 'Senha'}
            type="password"
            value={form.senha}
            onChange={(e) => setForm({ ...form, senha: e.target.value })}
            required={!editing}
          />
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={form.ativo}
              onChange={(e) => setForm({ ...form, ativo: e.target.checked })}
              className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            Usuário ativo
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} loading={saving}>
              {editing ? 'Salvar' : 'Cadastrar'}
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        open={!!usuarioParaExcluir}
        title="Excluir usuário"
        message={`Deseja excluir o usuário "${usuarioParaExcluir?.nome ?? ''}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setUsuarioParaExcluir(null)}
      />
    </div>
  )
}
