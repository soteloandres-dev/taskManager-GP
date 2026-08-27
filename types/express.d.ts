// no vamos a crear otro Request, vamos a ampliarlo/extenderlo para que ahora ademas tenga "user"

// vamos a trabjar tambien un contrato para el payload del JWT

declare global {
    namespace Express {
        interface Request {
            user: {
                id: string;
            }
        }
    }
}

export { }