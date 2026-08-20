// El controller se debe encargar de armar el "contrato" con la data que recibe de la request HTTP
// puede comprobar cosas relacionadas al HTTP, como si viene o no body, si pudo extraer title, si existe user.id
// pero la logica de negocio la ve el service, como que el titulo tengo un largo maximo de 100 caracteres por ejemplo.

// HTTP - entonces recibe el req desde el origen

// emulando el import
import taskCreateService from '../services/taskCreate.service'

// importante en express siempre utilizar la sincronia cuando se hagan llamados
function createTask(req, res) {
    const { title, description } = req.body
    const userId = req.user.id

    // o pensaba hacerlo asi directamente como opcion
    const contract = {
        title: req.body.title,
        description: req.body.description,
        userId: req.user.id
    }

    // hay que esperar la respuesta
    const response = taskCreateService.taskCreate(contract)

    // El service no sabe de http y sus codigos asi que no podemos 
    if (response.statusCode !== 200) {
        // aplicar los return para cortar la ejecucion
        res.status(400).json({ message: 'No se pudo guardar la tarea' })
    }

    // como es creacion, si es exitosa deberia ser 201
    res.status(200).json({ title, description })
}