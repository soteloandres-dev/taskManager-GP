import { z } from 'zod'

export const createTaskSchema = z.object({
    title: z.string().trim().min(1).max(100),
    description: z.string().optional(),
    // userId: z.string() // porque solo valida lo que manda el cliente
})

// type createTaskInput = z.infer<typeof createTaskSchema>