import { Request, Response } from 'express'
import { CreateTaskInput } from '../types/task'
import { createTaskSchema } from '../schemas/createTask.schema'
import createTaskService from '../services/taskCreate.service'

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

    const taskCreated = await createTaskService(task)

    return res.status(201).json(taskCreated)

}

export default createTaskController
