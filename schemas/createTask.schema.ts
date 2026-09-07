import { z } from 'zod'

export const createTaskSchema = z.object({
    title: z.string().trim().min(1).max(100),
    description: z.string().optional(),
    // userId: z.string() // porque solo valida lo que manda el cliente
}).strict()

export type CreateTaskBody = z.infer<typeof createTaskSchema>

export type CreateTaskInput = CreateTaskBody & { userId: string }