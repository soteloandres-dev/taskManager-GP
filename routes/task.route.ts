import { Router } from "express";
import { createTaskController, getTaskByIdController, getTasksController } from "../controller/task.controller.ts"
import { authMiddleware } from "../middleware/auth.middleware.ts";

export const taskRouter = Router()

// traer todas las tareas
taskRouter.get('/', authMiddleware, getTasksController)

// la ruta solo / ya que esta montado en tasks en el middleware en app.ts
taskRouter.post('/', authMiddleware, createTaskController)

// nombre de param debe extraerse igual en controller
taskRouter.get('/:taskId', authMiddleware, getTaskByIdController)