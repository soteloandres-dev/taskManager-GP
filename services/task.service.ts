import { createTaskRepository, getAllTasksRepository } from "../repository/task.repository.ts";
import type { CreateTaskInput, Task, CreateTaskRepositoryInput } from "../types/task.ts";

export async function createTaskService(taskInput: CreateTaskInput): Promise<Task> {
    const taskRepositoryInput: CreateTaskRepositoryInput = {
        ...taskInput,
        completed: false,
        createdAt: new Date()
    }
    return await createTaskRepository(taskRepositoryInput)
}

export async function getAllTasksService(userId: string): Promise<Task[]> {

    return await getAllTasksRepository(userId)
}
