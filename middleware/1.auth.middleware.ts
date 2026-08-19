import jwt from "jsonwebtoken";
import express, { Request, Response, NextFunction } from 'express';
import env from 'dotenv'

function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.token
    const isValid = jwt.verify(token, process.env.SECRET_KEY)

    if (isValid) {
        next()
    } else {
        res.send('Token invalid')
    }

}
