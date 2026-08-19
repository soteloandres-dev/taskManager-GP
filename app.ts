// usamos los tipos de express para la req, res y next
import express, { Request, Response, NextFunction } from 'express';
// La logica sera configurar todo y luego levantar: configuracion - middleware - routes(endpoints) - errors handler y levantar


const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Task Manager App testing Good Practice');
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

