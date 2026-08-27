// usamos los tipos de express para la req, res y next
import express, { type Request, type Response } from 'express';
// La logica sera configurar todo y luego levantar: configuracion - middleware - routes(endpoints) - errors handler y levantar

// el router de task
import { taskRouter } from './routes/task.route.ts';

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Task Manager App testing Good Practice');
});

app.use('/tasks', taskRouter); // usar el router con un prefijo /tasks

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



