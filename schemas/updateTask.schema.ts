import { z } from 'zod'

export const updateTaskSchema = z.object({
    title: z.string().trim().min(1).max(100).optional(),
    description: z.string().optional(),
    completed: z.boolean().optional()
}).refine((obj) => Object.keys(obj).length > 0, {
    message: "Debe tener al menos un campo modificado",
})