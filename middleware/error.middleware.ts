import type { Request, Response, NextFunction } from 'express'

export function errorMiddleware(error: unknown, req: Request, res: Response, next: NextFunction) {

    // Si la respuesta ya comenzó, entregar el error
    // al siguiente manejador de Express.
    if (res.headersSent) { /* comprobar headers enviados */
        return next(error)/* continuar pasando el error */;
    }
    const errorMessage =
        error instanceof Error
            ? error.message /* obtener mensaje del Error */
            : 'Error desconocido' /* mensaje para un valor desconocido */;

    const errorStack =
        error instanceof Error
            ? error.stack /* obtener stack */
            : undefined;

    console.error({
        timestamp: new Date().toISOString(), /* fecha actual en formato ISO */
        method: req.method, /* método de la petición */
        path: req.originalUrl, /* ruta solicitada */
        message: errorMessage,
        stack: errorStack,
    });

    return res.status(500/* error interno */).json({
        message: 'Error interno'/* mensaje público genérico */,
    });
}