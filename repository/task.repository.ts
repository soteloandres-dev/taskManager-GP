import type { CreateTaskRepositoryInput, Task } from "../types/task.ts";
import type { UpdateTaskRepositoryInput } from "../schemas/updateTask.schema.ts";
import { randomUUID } from 'node:crypto'
import pool from "../config/db.ts";

const taskList: Task[] = []

export async function createTaskRepository(task: CreateTaskRepositoryInput): Promise<Task> {

    const id = randomUUID()
    // agregamos el tipo que devolverá la query
    const result = await pool.query<Task>(
        `INSERT INTO tasks (id, title, description, user_id, completed, created_at, completed_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id,
                title,
                description,
                user_id AS "userId",
                completed,
                created_at AS "createdAt",
                completed_at AS "completedAt"
        `,
        [id, task.title, task.description ?? null, task.userId, task.completed, task.createdAt, task.completedAt ?? null])

    const createdTask = result.rows[0]

    if (!createdTask) {
        throw new Error('Task could not be created')
    }

    return createdTask
}

export async function getAllTasksRepository(userId: string): Promise<Task[]> {
    // const listTaskByUser = taskList.filter(task => {
    //     return task.userId === userId
    // })

    // mas simple y semantico, como no se hara nada despues con listTaskByUser, solo la retornamos
    return taskList.filter(task => task.userId === userId)
}

export async function getTaskByIdRepository(userId: string, taskId: string): Promise<Task | undefined> {
    // puede no existir la tarea
    return taskList.find(task => task.userId === userId && task.id === taskId)
}

export async function updateTaskRepository(userId: string, taskId: string, taskInput: UpdateTaskRepositoryInput): Promise<Task | undefined> {

    // lo haremos de forma inmutable y reemplazando solo el objeto afectado
    const index = taskList.findIndex(task => task.id === taskId && task.userId === userId)
    if (index === -1) return undefined

    const foundTask = taskList[index]
    if (!foundTask) return undefined
    const updateTask: Task = { ...foundTask, ...taskInput } // reemplazamos valores que hayan enviado

    taskList[index] = updateTask

    return updateTask
}

export async function deleteTaskRepository(userId: string, taskId: string): Promise<Task | undefined> {

    const index = taskList.findIndex(task => task.id === taskId && task.userId === userId)
    if (index === -1) return undefined
    const deletedTask = taskList[index]
    taskList.splice(index, 1)
    return deletedTask
}

// para pruebas unitarias
export function cleanRepository(): void {
    taskList.length = 0
}