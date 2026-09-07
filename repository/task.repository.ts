import type { CreateTaskRepositoryInput, Task, UpdateTaskRepositoryInput } from "../types/task.ts";
import { randomUUID } from 'node:crypto'

const taskList: Task[] = []

export async function createTaskRepository(task: CreateTaskRepositoryInput): Promise<Task> {

    const id = randomUUID()
    const newTask: Task = { id, ...task }
    taskList.push(newTask)
    return newTask
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
    const updateTask = { ...taskList[index], ...taskInput } // reemplazamos valores que hayan enviado
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