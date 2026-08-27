import type { CreateTaskRepositoryInput, Task } from "../types/task.ts";
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
