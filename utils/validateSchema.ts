import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";
type RequestOrigin = 'body' | 'params'

// esta es una funcion factory, es decir con lo que recibe construye una nueva funcion que será el middleware.
export function validateSchema(schema: ZodType, reqOrigin: RequestOrigin) {

    return function (req: Request, res: Response, next: NextFunction) {

        //const result = schema.safeParse(req + '.' + reqOrigin) ❌
        const result = schema.safeParse(req[reqOrigin])
        if (!result.success) {
            return res.status(400).json({ message: 'Error de formato en los datos' })
        }
        if (!res.locals.validatedData) {
            res.locals.validatedData = {} // como no existe, lo inicializo
        }
        res.locals.validatedData[reqOrigin] = result.data // ya exite validatedData, se lo asigno
        next()
    }

}