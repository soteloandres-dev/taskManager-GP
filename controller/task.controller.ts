import { Request, Response } from 'express'
import { CreateTaskInput } from '../types/task'
import { createTaskSchema } from '../schemas/createTask.schema'
import createTaskService from '../services/taskCreate.service'

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

}
