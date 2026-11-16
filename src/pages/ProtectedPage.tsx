import { useCallback, useEffect, useMemo, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { TaskCard } from '../components/TaskCard'
import { TaskForm } from '../components/TaskForm'
import { useAuth } from '../hooks/AuthProvider'
import {
  createTask,
  deleteTask,
  listTasks,
  updateTask,
  type Task,
  type TaskInput,
} from '../lib/tasks'
import type { TaskPriority, TaskStatus } from '../types/database'

type ProtectedPageProps = {
  user: User
}

type StatusFilter = TaskStatus | 'all'
type PriorityFilter = TaskPriority | 'all'

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : 'Terjadi kesalahan. Silakan coba lagi.'
}

export function ProtectedPage({ user }: ProtectedPageProps) {
  const { signOut } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null)
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null)
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [priorityFilter, setPriorityFilter] =
    useState<PriorityFilter>('all')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [formErrorMessage, setFormErrorMessage] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [isSigningOut, setIsSigningOut] = useState(false)

  const loadTasks = useCallback(async () => {
    setErrorMessage(null)
    setIsLoading(true)

    try {
      setTasks(await listTasks(user.id))
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }, [user.id])

  useEffect(() => {
    void loadTasks()
  }, [loadTasks])

  const filteredTasks = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLocaleLowerCase()

    return tasks.filter((task) => {
      const matchesSearch =
        !normalizedSearch ||
        task.title.toLocaleLowerCase().includes(normalizedSearch) ||
        (task.description ?? '').toLocaleLowerCase().includes(normalizedSearch)
      const matchesStatus =
        statusFilter === 'all' || task.status === statusFilter
      const matchesPriority =
        priorityFilter === 'all' || task.priority === priorityFilter

      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [priorityFilter, searchTerm, statusFilter, tasks])

  const completedCount = tasks.filter((task) => task.status === 'done').length

  function openCreateForm() {
    setEditingTask(null)
    setFormErrorMessage(null)
    setNotice(null)
    setIsTaskFormOpen(true)
  }

  function openEditForm(task: Task) {
    setEditingTask(task)
    setFormErrorMessage(null)
    setNotice(null)
    setIsTaskFormOpen(true)
  }

  function closeTaskForm() {
    setIsTaskFormOpen(false)
    setEditingTask(null)
    setFormErrorMessage(null)
  }

  async function handleSaveTask(input: TaskInput) {
    setFormErrorMessage(null)
    setNotice(null)
    setIsSaving(true)

    try {
      if (editingTask) {
        const updatedTask = await updateTask(user.id, editingTask.id, input)
        setTasks((currentTasks) =>
          currentTasks.map((task) =>
            task.id === updatedTask.id ? updatedTask : task,
          ),
        )
        setNotice('Perubahan tugas berhasil disimpan.')
      } else {
        const newTask = await createTask(user.id, input)
        setTasks((currentTasks) => [newTask, ...currentTasks])
        setNotice('Tugas berhasil ditambahkan.')
      }

      closeTaskForm()
    } catch (error) {
      setFormErrorMessage(getErrorMessage(error))
    } finally {
      setIsSaving(false)
    }
  }

  async function handleStatusChange(taskId: string, status: TaskStatus) {
    setErrorMessage(null)
    setNotice(null)
    setUpdatingTaskId(taskId)

    try {
      const updatedTask = await updateTask(user.id, taskId, { status })
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task,
        ),
      )
      setNotice('Status tugas berhasil diperbarui.')
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setUpdatingTaskId(null)
    }
  }

  async function handleDeleteTask(taskId: string): Promise<boolean> {
    setErrorMessage(null)
    setNotice(null)
    setDeletingTaskId(taskId)

    try {
      await deleteTask(user.id, taskId)
      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== taskId),
      )
      setNotice('Tugas berhasil dihapus.')
      return true
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
      return false
    } finally {
      setDeletingTaskId(null)
    }
  }

  async function handleSignOut() {
    setErrorMessage(null)
    setIsSigningOut(true)

    try {
      const result = await signOut()
      if (result.error) {
        setErrorMessage(result.error)
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Tidak dapat keluar. Silakan coba lagi.',
      )
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <a aria-label="Taskflow, beranda" className="brand" href="/">
          <span aria-hidden="true" className="brand-mark">T</span>
          <span>Taskflow</span>
        </a>
        <div className="account-controls">
          <span className="account-email">{user.email}</span>
          <button
            className="button button--secondary"
            disabled={isSigningOut}
            onClick={handleSignOut}
            type="button"
          >
            {isSigningOut ? 'Memproses...' : 'Keluar'}
          </button>
        </div>
      </header>

      <div className="app-content">
        <section className="welcome-panel">
          <div>
            <p className="eyebrow">RUANG KERJA PRIBADI</p>
            <h1>Kelola tugas, satu langkah setiap saat.</h1>
            <p className="welcome-panel__description">
              Simpan prioritas Anda, pantau progres, dan selesaikan hal penting.
            </p>
          </div>
          <button
            className="button button--primary button--large"
            onClick={openCreateForm}
            type="button"
          >
            <span aria-hidden="true">+</span> Tugas baru
          </button>
        </section>

        <section aria-label="Ringkasan tugas" className="task-summary">
          <div className="summary-card">
            <span className="summary-card__label">Semua tugas</span>
            <strong>{tasks.length}</strong>
          </div>
          <div className="summary-card">
            <span className="summary-card__label">Belum selesai</span>
            <strong>{tasks.length - completedCount}</strong>
          </div>
          <div className="summary-card">
            <span className="summary-card__label">Selesai</span>
            <strong>{completedCount}</strong>
          </div>
        </section>

        {errorMessage && (
          <div className="notice notice--error" role="alert">
            <span>{errorMessage}</span>
            <button
              className="button button--secondary button--compact"
              onClick={() => void loadTasks()}
              type="button"
            >
              Coba lagi
            </button>
          </div>
        )}
        {notice && (
          <p className="notice notice--success" role="status">
            {notice}
          </p>
        )}

        {isTaskFormOpen && (
          <TaskForm
            key={editingTask?.id ?? 'new-task'}
            errorMessage={formErrorMessage}
            isSaving={isSaving}
            onCancel={closeTaskForm}
            onSubmit={handleSaveTask}
            task={editingTask}
          />
        )}

        <section aria-labelledby="tasks-heading" className="tasks-section">
          <div className="tasks-section__heading">
            <div>
              <p className="eyebrow">DAFTAR ANDA</p>
              <h2 id="tasks-heading">Tugas</h2>
            </div>
            <span className="task-count">
              {filteredTasks.length} dari {tasks.length}
            </span>
          </div>

          <div aria-label="Cari dan filter tugas" className="task-filters">
            <label className="search-field" htmlFor="task-search">
              <span aria-hidden="true">Cari</span>
              <input
                id="task-search"
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Cari judul atau deskripsi"
                type="search"
                value={searchTerm}
              />
            </label>
            <label className="filter-field" htmlFor="filter-status">
              <span>Status</span>
              <select
                id="filter-status"
                onChange={(event) =>
                  setStatusFilter(event.target.value as StatusFilter)
                }
                value={statusFilter}
              >
                <option value="all">Semua status</option>
                <option value="todo">Belum dikerjakan</option>
                <option value="in_progress">Sedang dikerjakan</option>
                <option value="done">Selesai</option>
              </select>
            </label>
            <label className="filter-field" htmlFor="filter-priority">
              <span>Prioritas</span>
              <select
                id="filter-priority"
                onChange={(event) =>
                  setPriorityFilter(event.target.value as PriorityFilter)
                }
                value={priorityFilter}
              >
                <option value="all">Semua prioritas</option>
                <option value="low">Rendah</option>
                <option value="medium">Sedang</option>
                <option value="high">Tinggi</option>
              </select>
            </label>
          </div>

          {isLoading ? (
            <div className="empty-state" role="status">
              Memuat tugas...
            </div>
          ) : errorMessage && tasks.length === 0 ? (
            <div className="empty-state" role="status">
              <h3>Daftar tugas belum dimuat</h3>
              <p>Periksa koneksi Anda, lalu coba muat ulang.</p>
            </div>
          ) : filteredTasks.length > 0 ? (
            <div className="task-list">
              {filteredTasks.map((task) => (
                <TaskCard
                  isDeleting={deletingTaskId === task.id}
                  isUpdating={updatingTaskId === task.id}
                  key={task.id}
                  onDelete={handleDeleteTask}
                  onEdit={openEditForm}
                  onStatusChange={handleStatusChange}
                  task={task}
                />
              ))}
            </div>
          ) : tasks.length === 0 ? (
            <div className="empty-state">
              <span aria-hidden="true" className="empty-state__mark">+</span>
              <h3>Belum ada tugas</h3>
              <p>Tambahkan tugas pertama Anda untuk mulai mengatur hari.</p>
              <button
                className="button button--primary"
                onClick={openCreateForm}
                type="button"
              >
                Buat tugas pertama
              </button>
            </div>
          ) : (
            <div className="empty-state">
              <h3>Tidak ada tugas yang cocok</h3>
              <p>Coba ubah kata pencarian atau filter Anda.</p>
              <button
                className="button button--secondary"
                onClick={() => {
                  setSearchTerm('')
                  setStatusFilter('all')
                  setPriorityFilter('all')
                }}
                type="button"
              >
                Hapus filter
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
