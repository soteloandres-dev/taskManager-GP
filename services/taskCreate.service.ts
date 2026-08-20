import createTaskRepository from "../repository/task.repository";
import { CreateTaskInput, Task, CreateTaskRepositoryInput } from "../types/task";

async function createTaskService(taskInput: CreateTaskInput): Promise<Task> {
    const taskRepositoryInput: CreateTaskRepositoryInput = {
        ...taskInput,
        completed: false,
        createdAt: new Date()
    }

    return createTaskRepository(taskRepositoryInput)
}

export default createTaskService