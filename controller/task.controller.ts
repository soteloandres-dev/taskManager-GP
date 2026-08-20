import { Request, Response } from 'express'
import taskCreateService from '../services/taskCreate.service'
import { CreateTaskInput } from '../types/task'
import { createTaskSchema } from '../schemas/createTask.schema'

async function createTaskController(req: Request, res: Response) {

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

    const taskCreated = await taskCreateService.taskCreate(task)

    return res.status(201).json(taskCreated)

}
