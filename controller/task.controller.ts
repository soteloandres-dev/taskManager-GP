import type { Request, Response } from 'express'
import type { CreateTaskInput } from '../types/task.ts'
import { createTaskSchema } from '../schemas/createTask.schema.ts'
import { createTaskService, getAllTasksService, getTaskByIdService } from '../services/task.service.ts'

export async function createTaskController(req: Request, res: Response) {

    // uso del esquema de zod
    const checkData = createTaskSchema.safeParse(req.body)

    if (!checkData.success) {
        return res.status(400).json({ message: 'Invalid Schema' })
    }

    const { title, description } = checkData.data
    const userId = req.user.id

    const task: CreateTaskInput = {
        title,
        description,
        userId
    }

    const taskCreated = await createTaskService(task)

    return res.status(201).json(taskCreated)
}

export async function getTasksController(req: Request, res: Response) {
    // no hay chequeo de esquema

    // llamamos al service que trae las tareas
    const userId = req.user.id
    const listTasks = await getAllTasksService(userId)

    if (listTasks.length === 0) res.status(200).json({ message: 'Not found tasks' })
    return res.status(200).json(listTasks)

}

export async function getTaskByIdController(req: Request, res: Response) {
    // lo obtenemos en el paso de auth
    const userId = req.user.id
    // se extrae directo de la path
    const { taskId } = req.params

    if (!taskId || typeof taskId !== 'string') {
        return res.status(400).json({ message: 'Task Id is required' })
    }

    const task = await getTaskByIdService(userId, taskId)

    if (!task) {
        return res.status(404).json({ message: 'Task not Found' })
    }
    return res.status(200).json(task)
}
