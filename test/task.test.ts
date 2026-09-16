import test, { beforeEach } from "node:test"; // para preparar pruebas
import assert from "node:assert/strict";
import request from 'supertest' // para las llamadas http
import jwt from 'jsonwebtoken'
import app from "../app.ts";
import { cleanRepository } from "../repository/task.repository.ts";

process.env.SECRET_KEY = 'my-secret-key'
const TEST_USER_ID = '123'

const token = jwt.sign({ 'userId': TEST_USER_ID }, process.env.SECRET_KEY)

beforeEach(() => {
    cleanRepository()
})

test('POST /tasks crea una tarea', async () => {

    const taskInput = {
        title: 'titulo de prueba'
    }
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send(taskInput)

    // aqui las comprobanciones

    assert.equal(response.status, 201)
    assert.equal(response.body.title, taskInput.title)
    assert.equal(response.body.userId, TEST_USER_ID)
    assert.equal(response.body.completed, false)
    assert.ok(response.body.id.length > 0)
    assert.equal(typeof response.body.id, 'string')
    assert.equal(typeof response.body.createdAt, 'string')
})


test('GET /tasks rechaza una peticion sin autorizacion ', async () => {

    const response = await request(app).get('/tasks')

    assert.equal(response.status, 401)
    assert.equal(response.body.message, 'Need Login')
})


test('GET /tasks rechaza por token invalido', async () => {

    const response = await request(app).get('/tasks').set('Authorization', 'Bearer token-invalido')

    assert.equal(response.status, 401)
    assert.equal(response.body.message, 'Invalid Token')
})


test('POST /tasks rechazo por propiedad title obligatorio vacia', async () => {

    const taskInput = {
        title: '',
    }

    const response = await request(app).post('/tasks').set('Authorization', `Bearer ${token}`).send(taskInput)

    assert.equal(response.status, 400)
    assert.equal(response.body.message, 'Error de formato en los datos')
})


test('GET /tasks obtener lista de tareas', async () => {

    // creamos tarea primero para luego listar
    const createTaskResponse = await request(app).post('/tasks').set('Authorization', `Bearer ${token}`).send({ title: 'tarea para listar' })

    assert.equal(createTaskResponse.status, 201)
    assert.equal(createTaskResponse.body.title, 'tarea para listar')

    const listTaskResponse = await request(app).get('/tasks').set('Authorization', `Bearer ${token}`)

    assert.equal(listTaskResponse.status, 200)
    assert.ok(Array.isArray(listTaskResponse.body))
    assert.equal(listTaskResponse.body.length, 1)

    // luego comparamos que la tarea creada es la misma que la que devolvió el GET

    const getTask = listTaskResponse.body[0]

    assert.equal(createTaskResponse.body.id, getTask.id)
    assert.equal(getTask.userId, TEST_USER_ID)
    assert.equal(getTask.title, createTaskResponse.body.title)
})


test('GET /tasks obtiene la lista de tareas vacia', async () => {
    const response = await request(app).get('/tasks').set('Authorization', `Bearer ${token}`)

    assert.equal(response.status, 200)
    assert.ok(Array.isArray(response.body))
    assert.strictEqual(response.body.length, 0)
})


test('GET /tasks/:taskId obtiene una de tarea por su id', async () => {

    const createTaskResponse = await request(app).post('/tasks').set('Authorization', `Bearer ${token}`).send({ title: 'tarea para buscar por id' })

    assert.equal(createTaskResponse.status, 201)
    assert.equal(createTaskResponse.body.title, 'tarea para buscar por id')

    const taskId = createTaskResponse.body.id

    const response = await request(app).get(`/tasks/${taskId}`).set('Authorization', `Bearer ${token}`)

    assert.equal(response.status, 200)
    assert.equal(response.body.id, taskId)
    assert.equal(response.body.userId, TEST_USER_ID)
    assert.equal(response.body.title, createTaskResponse.body.title)

})

