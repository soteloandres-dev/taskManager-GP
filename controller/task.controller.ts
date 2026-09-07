import type { Request, Response } from 'express'
import type { CreateTaskInput, UpdateTaskInput } from '../types/task.ts'
import { createTaskSchema } from '../schemas/createTask.schema.ts'
import { createTaskService, deleteTaskService, getAllTasksService, getTaskByIdService, updateTaskService } from '../services/task.service.ts'
import { taskIdSchema } from '../schemas/taskId.schema.ts'
import { updateTaskSchema } from '../schemas/updateTask.schema.ts'

export async function createTaskController(req: Request, res: Response) {
    // uso del esquema de zod
    // const checkData = createTaskSchema.safeParse(req.body)
    // if (!checkData.success) {
    //     return res.status(400).json({ message: 'Invalid Schema' })
    // }
    // const { title, description } = checkData.data
    const { title, description } = res.locals.validatedData.body
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
    console.log(userId)
    // usamos un esquema para validar el formato del id de la task
    //const checkData = taskIdSchema.safeParse(req.params) // usamo middleware de esquema

    // esperamos que resulte exitosa la validacion, si no, cortamos ejecucion
    // if (!checkData.success) { // los parametros entran como texto asi que no es necesario hacer dicha validacion
    //     return res.status(400).json({ message: 'Task Id is not valid' })
    // }
    const { taskId } = res.locals.validatedData.params
    console.log(taskId)
    const task = await getTaskByIdService(userId, taskId) // ya nos aseguramos que taskId tiene el formato uuid

    if (!task) return res.status(404).json({ message: 'Task not found' })
    return res.status(200).json(task)
}

export async function updateTaskController(req: Request, res: Response) {

    // const validateBody = updateTaskSchema.safeParse(req.body)
    // if (!validateBody.success) return res.status(400).json({ message: 'Information is not valid' })
    const taskBody = res.locals.validatedData.body

    const userId = req.user.id

    // const validateTaskId = taskIdSchema.safeParse(req.params)
    // if (!validateTaskId.success) return res.status(400).json({ message: 'Task Id is not valid' })

    const { taskId } = res.locals.validatedData.params //validateTaskId.data
    const task = await updateTaskService(userId, taskId, taskBody)

    if (!task) {
        return res.status(404).json({ message: 'Task not found' })
    }
    return res.status(200).json(task)
}


export async function deleteTaskController(req: Request, res: Response) {

    // const validateTaskId = taskIdSchema.safeParse(req.params)
    // if (!validateTaskId.success) return res.status(400).json({ message: 'Task id format invalid' })

    const { taskId } = res.locals.validatedData.params //validateTaskId.data
    const userId = req.user.id

    const deletedTask = await deleteTaskService(userId, taskId)
    if (!deletedTask) return res.status(404).json({ message: 'Task not found' })

    return res.status(200).json(deletedTask)
}