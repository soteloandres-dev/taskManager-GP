import { CreateTaskRepositoryInput, Task } from "../types/task";
import { randomUUID } from 'node:crypto'

const taskList: Task[] = []

async function createTaskRepository(task: CreateTaskRepositoryInput): Promise<Task> {

    const id = randomUUID()
    const newTask: Task = { id, ...task }
    taskList.push(newTask)
    return newTask
}

export default createTaskRepository