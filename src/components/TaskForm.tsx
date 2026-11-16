import { useState, type FormEvent } from 'react'
import type { Task, TaskInput } from '../lib/tasks'
import type { TaskPriority, TaskStatus } from '../types/database'

type TaskFormProps = {
  task: Task | null
  errorMessage: string | null
  isSaving: boolean
  onCancel: () => void
  onSubmit: (input: TaskInput) => Promise<void>
}

function getLocalDateInputValue(value: string | null): string {
  if (!value) {
    return ''
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return ''
  }

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getDeadlineValue(value: string): string | null {
  if (!value) {
    return null
  }

  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day, 23, 59, 59).toISOString()
}

export function TaskForm({
  task,
  errorMessage,
  isSaving,
  onCancel,
  onSubmit,
}: TaskFormProps) {
  const [title, setTitle] = useState(task?.title ?? '')
  const [description, setDescription] = useState(task?.description ?? '')
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? 'todo')
  const [priority, setPriority] = useState<TaskPriority>(
    task?.priority ?? 'medium',
  )
  const [deadline, setDeadline] = useState(
    getLocalDateInputValue(task?.deadline ?? null),
  )
  const [validationMessage, setValidationMessage] = useState<string | null>(
    null,
  )

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setValidationMessage(null)

    if (!title.trim()) {
      setValidationMessage('Judul tugas tidak boleh kosong.')
      return
    }

    await onSubmit({
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      deadline: getDeadlineValue(deadline),
    })
  }

  return (
    <section className="task-form-panel" aria-labelledby="task-form-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{task ? 'Perbarui tugas' : 'Tugas baru'}</p>
          <h2 id="task-form-title">
            {task ? 'Edit tugas' : 'Tambahkan tugas'}
          </h2>
        </div>
        <button
          aria-label="Tutup form"
          className="icon-button"
          onClick={onCancel}
          type="button"
        >
          Tutup
        </button>
      </div>

      <form className="task-form" onSubmit={handleSubmit}>
        <label className="form-field form-field--wide" htmlFor="task-title">
          <span>Judul</span>
          <input
            autoFocus
            id="task-title"
            maxLength={200}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Contoh: Selesaikan laporan mingguan"
            required
            value={title}
          />
        </label>

        <label
          className="form-field form-field--wide"
          htmlFor="task-description"
        >
          <span>Deskripsi</span>
          <textarea
            id="task-description"
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Tambahkan detail tugas (opsional)"
            rows={3}
            value={description}
          />
        </label>

        <label className="form-field" htmlFor="task-status">
          <span>Status</span>
          <select
            id="task-status"
            onChange={(event) =>
              setStatus(event.target.value as TaskStatus)
            }
            value={status}
          >
            <option value="todo">Belum dikerjakan</option>
            <option value="in_progress">Sedang dikerjakan</option>
            <option value="done">Selesai</option>
          </select>
        </label>

        <label className="form-field" htmlFor="task-priority">
          <span>Prioritas</span>
          <select
            id="task-priority"
            onChange={(event) =>
              setPriority(event.target.value as TaskPriority)
            }
            value={priority}
          >
            <option value="low">Rendah</option>
            <option value="medium">Sedang</option>
            <option value="high">Tinggi</option>
          </select>
        </label>

        <label className="form-field" htmlFor="task-deadline">
          <span>Tenggat</span>
          <input
            id="task-deadline"
            onChange={(event) => setDeadline(event.target.value)}
            type="date"
            value={deadline}
          />
        </label>

        {(validationMessage || errorMessage) && (
          <p className="form-message error-message form-field--wide" role="alert">
            {validationMessage ?? errorMessage}
          </p>
        )}

        <div className="task-form__actions form-field--wide">
          <button
            className="button button--secondary"
            onClick={onCancel}
            type="button"
          >
            Batal
          </button>
          <button className="button button--primary" disabled={isSaving}>
            {isSaving ? 'Menyimpan...' : task ? 'Simpan perubahan' : 'Simpan tugas'}
          </button>
        </div>
      </form>
    </section>
  )
}
