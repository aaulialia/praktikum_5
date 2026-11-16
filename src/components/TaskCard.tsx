import { useState } from 'react'
import type { Task } from '../lib/tasks'
import type { TaskStatus } from '../types/database'

type TaskCardProps = {
  task: Task
  isDeleting: boolean
  isUpdating: boolean
  onDelete: (taskId: string) => Promise<boolean>
  onEdit: (task: Task) => void
  onStatusChange: (taskId: string, status: TaskStatus) => void
}

const priorityLabels = {
  low: 'Rendah',
  medium: 'Sedang',
  high: 'Tinggi',
} satisfies Record<Task['priority'], string>

const statusLabels = {
  todo: 'Belum dikerjakan',
  in_progress: 'Sedang dikerjakan',
  done: 'Selesai',
} satisfies Record<TaskStatus, string>

function formatDeadline(value: string | null): string | null {
  if (!value) {
    return null
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return null
  }

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export function TaskCard({
  task,
  isDeleting,
  isUpdating,
  onDelete,
  onEdit,
  onStatusChange,
}: TaskCardProps) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
  const deadlineLabel = formatDeadline(task.deadline)

  async function confirmDelete() {
    const wasDeleted = await onDelete(task.id)
    if (wasDeleted) {
      setIsConfirmingDelete(false)
    }
  }

  return (
    <article className={`task-card task-card--${task.status}`}>
      <div className="task-card__content">
        <div className="task-card__title-row">
          <h3>{task.title}</h3>
          <span className={`priority-badge priority-badge--${task.priority}`}>
            Prioritas {priorityLabels[task.priority]}
          </span>
        </div>
        {task.description && (
          <p className="task-card__description">{task.description}</p>
        )}
        {deadlineLabel && (
          <p className="task-card__deadline">
            <span aria-hidden="true">Tenggat</span>
            <time dateTime={task.deadline ?? undefined}>{deadlineLabel}</time>
          </p>
        )}
      </div>

      <div className="task-card__actions">
        <label className="sr-only" htmlFor={`task-status-${task.id}`}>
          Status: {task.title}
        </label>
        <select
          className="task-status-select"
          disabled={isUpdating}
          id={`task-status-${task.id}`}
          onChange={(event) =>
            onStatusChange(task.id, event.target.value as TaskStatus)
          }
          value={task.status}
        >
          {Object.entries(statusLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <button
          aria-label={`Edit ${task.title}`}
          className="button button--secondary button--compact"
          onClick={() => onEdit(task)}
          type="button"
        >
          Edit
        </button>
        {isConfirmingDelete ? (
          <div className="delete-confirmation">
            <span>Hapus?</span>
            <button
              className="button button--danger button--compact"
              disabled={isDeleting}
              onClick={() => void confirmDelete()}
              type="button"
            >
              {isDeleting ? 'Menghapus...' : 'Ya'}
            </button>
            <button
              className="button button--secondary button--compact"
              disabled={isDeleting}
              onClick={() => setIsConfirmingDelete(false)}
              type="button"
            >
              Batal
            </button>
          </div>
        ) : (
          <button
            aria-label={`Hapus ${task.title}`}
            className="button button--secondary button--compact"
            onClick={() => setIsConfirmingDelete(true)}
            type="button"
          >
            Hapus
          </button>
        )}
      </div>
    </article>
  )
}
