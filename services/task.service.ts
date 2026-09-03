import { createTaskRepository, getAllTasksRepository, getTaskByIdRepository, updateTaskRepository } from "../repository/task.repository.ts";
import type { CreateTaskInput, Task, CreateTaskRepositoryInput, UpdateTaskInput } from "../types/task.ts";

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


    if (taskInput.completed) {
        console.log('registro la fecha de complete')
        const completedTask = { ...taskInput, completedAt: new Date() }
        console.log(completedTask)

    } else {
        const incompletedTask = { ...taskInput, completedAt: undefined }
        console.log(incompletedTask)
    }


    return updateTaskRepository(userId, taskId, taskInput)
}