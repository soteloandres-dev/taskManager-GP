import type { CreateTaskBody } from "../schemas/createTask.schema.ts";

export type CreateTaskLocals = {
    validatedData: {
        body: CreateTaskBody
    }
}