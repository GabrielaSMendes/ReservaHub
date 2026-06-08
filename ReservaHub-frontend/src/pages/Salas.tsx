import { useCallback, useEffect, useState } from 'react'
import { Building2, Pencil, Plus, Trash2 } from 'lucide-react'
import { salaService } from '../api/salaService'
import { getErrorMessage } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card, CardBody } from '../components/ui/Card'
import { ConfirmModal } from '../components/ui/ConfirmModal'
import { EmptyState } from '../components/ui/EmptyState'
import { Input } from '../components/ui/Input'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { Modal } from '../components/ui/Modal'
import type { Sala } from '../types'

const emptyForm = {
  nomeSala: '',
  descricao: '',
  capacidade: '',
  status: true,
}

export function Salas() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [salas, setSalas] = useState<Sala[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Sala | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [salaParaExcluir, setSalaParaExcluir] = useState<Sala | null>(null)
  const [deleting, setDeleting] = useState(false)

  const isAdmin = user?.isAdmin

  const load = useCallback(async () => {
    try {
      const data = isAdmin ? await salaService.listar() : await salaService.listarAtivas()
      setSalas(data)
    } catch (error) {
      showToast(getErrorMessage(error), 'error')
    } finally {
      setLoading(false)
    }
  }, [isAdmin, showToast])

  useEffect(() => {
    load()
  }, [load])

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEdit = (sala: Sala) => {
    setEditing(sala)
    setForm({
      nomeSala: sala.nomeSala,
      descricao: sala.descricao ?? '',
      capacidade: String(sala.capacidade),
      status: sala.status ?? true,
    })
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.nomeSala || !form.capacidade) {
      showToast('Preencha nome e capacidade da sala', 'error')
      return
    }

    setSaving(true)
    try {
      const payload = {
        nomeSala: form.nomeSala,
        descricao: form.descricao || null,
        capacidade: Number(form.capacidade),
        status: form.status,
      }

      if (editing) {
        await salaService.atualizar(editing.id, payload)
        showToast('Sala atualizada com sucesso!', 'success')
      } else {
        await salaService.criar(payload)
        showToast('Sala cadastrada com sucesso!', 'success')
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
    if (!salaParaExcluir) return
    setDeleting(true)
    try {
      await salaService.excluir(salaParaExcluir.id)
      showToast('Sala excluída com sucesso!', 'success')
      setSalaParaExcluir(null)
      await load()
    } catch (error) {
      showToast(getErrorMessage(error), 'error')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Salas</h1>
          <p className="text-slate-500">
            {isAdmin ? 'Gerencie as salas do coworking' : 'Espaços disponíveis para reserva'}
          </p>
        </div>
        {isAdmin && (
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Nova sala
          </Button>
        )}
      </div>

      {salas.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="Nenhuma sala encontrada"
          description="Cadastre salas para começar a receber reservas."
          action={
            isAdmin ? (
              <Button onClick={openCreate}>
                <Plus className="h-4 w-4" />
                Cadastrar sala
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {salas.map((sala) => (
            <Card key={sala.id}>
              <CardBody>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 text-brand-600">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <Badge variant={sala.status ? 'success' : 'danger'}>
                    {sala.status ? 'Ativa' : 'Inativa'}
                  </Badge>
                </div>
                <h3 className="font-semibold text-slate-900">{sala.nomeSala}</h3>
                <p className="mt-1 text-sm text-slate-500 line-clamp-2">
                  {sala.descricao || 'Sem descrição'}
                </p>
                <p className="mt-3 text-sm text-slate-600">
                  Capacidade: <strong>{sala.capacidade}</strong> pessoas
                </p>
                {isAdmin && (
                  <div className="mt-4 flex gap-2">
                    <Button variant="secondary" size="sm" onClick={() => openEdit(sala)}>
                      <Pencil className="h-3.5 w-3.5" />
                      Editar
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => setSalaParaExcluir(sala)}>
                      <Trash2 className="h-3.5 w-3.5" />
                      Excluir
                    </Button>
                  </div>
                )}
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Editar sala' : 'Nova sala'}
      >
        <div className="space-y-4">
          <Input
            label="Nome da sala"
            value={form.nomeSala}
            onChange={(e) => setForm({ ...form, nomeSala: e.target.value })}
            required
          />
          <div>
            <label className="text-sm font-medium text-slate-700">Descrição</label>
            <textarea
              className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              rows={3}
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
            />
          </div>
          <Input
            label="Capacidade"
            type="number"
            min={1}
            value={form.capacidade}
            onChange={(e) => setForm({ ...form, capacidade: e.target.value })}
            required
          />
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.checked })}
              className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            Sala ativa (disponível para reservas)
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
        open={!!salaParaExcluir}
        title="Excluir sala"
        message={`Deseja excluir a sala "${salaParaExcluir?.nomeSala ?? ''}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setSalaParaExcluir(null)}
      />
    </div>
  )
}
