import { Router } from "express";
import createTaskController from "../controller/task.Controller";

const router = Router()

router.get('/', createTaskController)

export default router