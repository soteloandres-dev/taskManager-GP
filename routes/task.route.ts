import { Router } from "express";
import { createTaskController, deleteTaskController, getTaskByIdController, getTasksController, updateTaskController } from "../controller/task.controller.ts"
import { authMiddleware } from "../middleware/auth.middleware.ts";
import { validateSchema } from "../utils/validateSchema.ts";
import { createTaskSchema } from "../schemas/createTask.schema.ts";
import { taskIdSchema } from "../schemas/taskId.schema.ts";
import { updateTaskSchema } from "../schemas/updateTask.schema.ts";

export const taskRouter = Router()

// traer todas las tareas
taskRouter.get('/', authMiddleware, getTasksController)

// la ruta solo / ya que esta montado en tasks en el middleware en app.ts
//taskRouter.post('/', authMiddleware, createTaskController)
taskRouter.post('/', authMiddleware, validateSchema(createTaskSchema, 'body'), createTaskController)

// nombre de param debe extraerse igual en controller
taskRouter.get('/:taskId', authMiddleware, validateSchema(taskIdSchema, 'params'), getTaskByIdController)

taskRouter.patch('/:taskId', authMiddleware, validateSchema(taskIdSchema, 'params'), validateSchema(updateTaskSchema, 'body'), updateTaskController)

taskRouter.delete('/:taskId', authMiddleware, validateSchema(taskIdSchema, 'params'), deleteTaskController)