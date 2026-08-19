import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from 'express';
import { AuthJwtPayload } from "../types/auth"

function authMiddleware(req: Request, res: Response, next: NextFunction) {
    // let token: string = ''

    // if (req.headers.authorization) {
    //     const parts = req.headers.authorization.split(' ') // aqui ya lo guardamos en el array de strings
    //     if (parts[0] === 'Bearer' && parts[1]) {
    //         token = parts[1]
    //     } else {
    //         return res.status(401).json({ message: 'Invalid Token' })
    //     }
    // }

    // HACERLO DE MODO MAS DECLARATIVO
    const authorization = req.headers.authorization

    if (!authorization) {
        return res.status(401).json({ message: 'Need Login' })
    }

    const parts = authorization.split(' ')

    if (parts[0] !== 'Bearer' || !parts[1]) {
        return res.status(401).json({ message: 'Invalid Token' })
    }

    const token = parts[1]

    if (token === '') {
        // aqui faltó un return para la fn para cortar el proceso, y debe ser 401
        return res.status(401).json({ message: 'You need login' })
    }

    try {
        // aqui le agregamos el tipo para cuando termina de hacer el verify 
        const payload = jwt.verify(token, process.env.SECRET_KEY as string) as AuthJwtPayload

        // para solucionar el tema del tipo para la Request y agregarle user vamos a crear un archivo en /types
        if (typeof payload.userId === 'string' && payload.userId.length > 0) {
            // no dejar en el body, porque eso es lo que manda el cliente, nosotros lo dejamos en req directo
            // req.body.user = payload.userId

            req.user = {
                id: payload.userId
            }
            next()
        } else {
            return res.status(401).json({ message: 'Invalid Token' })
        }
    } catch (error) {
        return res.status(401).json({ message: 'Invalid Token' })
    }
}
