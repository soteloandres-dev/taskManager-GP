// lo que recibe el controller y le pasa al service, es lo del usuario mas el id que obtenemos al validar
export interface CreateTaskInput {
    title: string,
    description?: string,
    userId: string
}

// entidad completa que devuelve el repository
export interface Task {
    id: string,
    title: string,
    description?: string,
    userId: string,
    completed: boolean,
    createdAt: Date,
    completedAt?: Date
}

// reusamos Task, esto es lo que recibe el repository para hacer la persistencia
// accion + entidad + quien recibe + naturaleza del dato (en este caso es un input para repository)
export type CreateTaskRepositoryInput = Omit<Task, 'id'>


export interface UpdateTaskInput {
    title?: string,
    description?: string,
    completed?: boolean
}