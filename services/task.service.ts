import { createTaskRepository, getAllTasksRepository, getTaskByIdRepository, updateTaskRepository } from "../repository/task.repository.ts";
import type { CreateTaskInput, Task, CreateTaskRepositoryInput, UpdateTaskInput, UpdateTaskRepositoryInput } from "../types/task.ts";

export async function createTaskService(taskInput: CreateTaskInput): Promise<Task> {
    const taskRepositoryInput: CreateTaskRepositoryInput = {
        ...taskInput,
        completed: false,
        createdAt: new Date()
    }
    return await createTaskRepository(taskRepositoryInput)
}

export async function getAllTasksService(userId: string): Promise<Task[]> {
    // no es necesario await, porque no hacemos nada con el resultado
    return getAllTasksRepository(userId)
}

export async function getTaskByIdService(userId: string, taskId: string): Promise<Task | undefined> {
    return getTaskByIdRepository(userId, taskId)
}

export async function updateTaskService(userId: string, taskId: string, taskInput: UpdateTaskInput): Promise<Task | undefined> {

    // verifica existencia de la tarea
    const taskExist = await getTaskByIdRepository(userId, taskId)

    if (!taskExist) {
        return undefined
    }
    let updateTask: UpdateTaskRepositoryInput = { ...taskInput }

    if (taskExist.completed === false) {
        if (taskInput.completed === true) {
            updateTask = { ...updateTask, completedAt: new Date() }
        }
    } else if (taskExist.completed === true) {
        if (taskInput.completed === false) {
            updateTask = { ...updateTask, completedAt: undefined } // se desmarcó de completada!
        }
    }

    return updateTaskRepository(userId, taskId, updateTask)
}