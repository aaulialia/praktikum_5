import { getSupabaseClient } from './supabase'
import type { Database, TaskPriority, TaskStatus } from '../types/database'

export type Task = Database['public']['Tables']['tasks']['Row']

export type TaskInput = {
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  deadline: string | null
}

export type TaskChanges = Partial<TaskInput>

export async function listTasks(userId: string): Promise<Task[]> {
  const { data, error } = await getSupabaseClient()
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return data
}

export async function createTask(
  userId: string,
  input: TaskInput,
): Promise<Task> {
  const { data, error } = await getSupabaseClient()
    .from('tasks')
    .insert({
      ...normalizeTaskInput(input),
      user_id: userId,
    })
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function updateTask(
  userId: string,
  taskId: string,
  changes: TaskChanges,
): Promise<Task> {
  const normalizedChanges = { ...changes }

  if (normalizedChanges.title !== undefined) {
    const title = normalizedChanges.title.trim()
    if (!title) {
      throw new Error('Judul tugas tidak boleh kosong.')
    }
    normalizedChanges.title = title
  }

  if (normalizedChanges.description !== undefined) {
    normalizedChanges.description =
      normalizedChanges.description.trim()
  }

  const { data, error } = await getSupabaseClient()
    .from('tasks')
    .update(normalizedChanges)
    .eq('id', taskId)
    .eq('user_id', userId)
    .select()
    .maybeSingle()

  if (error) {
    throw error
  }
  if (!data) {
    throw new Error('Tugas tidak ditemukan atau akses ditolak.')
  }

  return data
}

export async function deleteTask(
  userId: string,
  taskId: string,
): Promise<void> {
  const { data, error } = await getSupabaseClient()
    .from('tasks')
    .delete()
    .eq('id', taskId)
    .eq('user_id', userId)
    .select('id')
    .maybeSingle()

  if (error) {
    throw error
  }
  if (!data) {
    throw new Error('Tugas tidak ditemukan atau akses ditolak.')
  }
}

function normalizeTaskInput(input: TaskInput): TaskInput {
  const title = input.title.trim()

  if (!title) {
    throw new Error('Judul tugas tidak boleh kosong.')
  }

  return {
    ...input,
    title,
    description: input.description.trim(),
  }
}
