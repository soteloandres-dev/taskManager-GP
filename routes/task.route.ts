import { Router } from "express";
import { createTaskController, getTasksController } from "../controller/task.Controller";
import { authMiddleware } from "../middleware/auth.middleware";

const taskRouter = Router()

// traer todas las tareas
taskRouter.get('/', authMiddleware, getTasksController)

// la ruta solo / ya que esta montado en tasks en el middleware en app.ts
taskRouter.post('/', authMiddleware, createTaskController)

export default taskRouter