import { CreateTaskRepositoryInput, Task } from "../types/task";
import { randomUUID } from 'node:crypto'

const taskList: Task[] = []

async function createTaskRepository(task: CreateTaskRepositoryInput): Promise<Task> {

    const id = randomUUID()
    const dataTask: Task = { id, ...task }
    taskList.push(dataTask)
    return dataTask
}

export default createTaskRepository