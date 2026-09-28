import test, { beforeEach } from "node:test"; // para preparar pruebas
import assert from "node:assert/strict";
import request from 'supertest' // para las llamadas http
import jwt from 'jsonwebtoken'
import app from "../app.ts";
import { cleanRepository } from "../repository/task.repository.ts";
import { randomUUID } from "node:crypto";
import { title } from "node:process";
import { response } from "express";

process.env.SECRET_KEY = 'my-secret-key'
const TEST_USER_ID = '123'
const token = jwt.sign({ 'userId': TEST_USER_ID }, process.env.SECRET_KEY)

const SECOND_USER_ID = '789'
const secondToken = jwt.sign({ userId: SECOND_USER_ID }, process.env.SECRET_KEY)

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

test('GET /tasks tarea no existe ', async () => {
    // generamos uuid valido para consultar por una tarea que no existe
    const taskId = randomUUID()

    const response = await request(app).get(`/tasks/${taskId}`).set('Authorization', `Bearer ${token}`)

    assert.equal(response.status, 404)
    assert.equal(response.body.message, 'Task not found')
})


test('GET /tasks formato invalido de taskId', async () => {
    const response = await request(app).get('/tasks/id-mal-formato').set('Authorization', `Bearer ${token}`)

    assert.equal(response.status, 400)
    assert.equal(response.body.message, 'Error de formato en los datos')
})


test('GET /tasks validar propiedad de usuario de la tarea', async () => {
    // crear tarea con usuario 1
    const newTask = await request(app).post('/tasks').set('Authorization', `Bearer ${token}`).send({ title: 'tarea usuario 1' })
    assert.equal(newTask.status, 201)
    const taskIdUser1 = newTask.body.id

    // la consulto con el usuario 2
    const response = await request(app).get(`/tasks/${taskIdUser1}`).set('Authorization', `Bearer ${secondToken}`)

    assert.equal(response.status, 404)
    assert.equal(response.body.message, 'Task not found')
})


test('PATCH /tasks modifica el titulo y mantiene los otros datos', async () => {
    const createTaskResponse = await request(app).post('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Titulo original', description: 'Descripcion original' })
    assert.equal(createTaskResponse.status, 201)
    assert.equal(createTaskResponse.body.title, 'Titulo original')
    const originalTitle = createTaskResponse.body.title
    const originalId = createTaskResponse.body.id
    const originalDescription = createTaskResponse.body.description

    const updateTitleResponse = await request(app).patch(`/tasks/${originalId}`).set('Authorization', `Bearer ${token}`).send({ title: 'Nuevo titulo' })

    assert.equal(updateTitleResponse.status, 200)
    assert.equal(updateTitleResponse.body.title, 'Nuevo titulo')
    assert.notEqual(updateTitleResponse.body.title, originalTitle)
    assert.equal(updateTitleResponse.body.id, originalId)
    assert.equal(updateTitleResponse.body.description, originalDescription)
    assert.equal(updateTitleResponse.body.completed, false)
    assert.equal(updateTitleResponse.body.createdAt, createTaskResponse.body.createdAt)
    assert.equal(updateTitleResponse.body.userId, TEST_USER_ID)
})

test('PATCH /tasks validar que tarea comienza incompleta y se completa', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Prueba estado', description: 'Description test' })

    const taskId = response.body.id
    const originalTitle = response.body.title
    assert.equal(response.status, 201)
    assert.equal(response.body.completed, false)
    assert.equal(response.body.title, 'Prueba estado')

    const updateTaskResponse = await request(app)
        .patch(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ completed: true })

    assert.equal(updateTaskResponse.status, 200)
    assert.equal(updateTaskResponse.body.completed, true)
    assert.equal(updateTaskResponse.body.title, originalTitle)
    assert.equal(updateTaskResponse.body.description, response.body.description)
    assert.equal(updateTaskResponse.body.id, taskId)
    assert.ok(typeof updateTaskResponse.body.completedAt === 'string')
    assert.ok(updateTaskResponse.body.completedAt.length > 0)
    assert.equal(updateTaskResponse.body.createdAt, response.body.createdAt)
})

test('PATCH /tasks marcar incompleta una tarea', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Prueba estado tarea', description: 'Description test' })

    const taskId = response.body.id
    const originalTitle = response.body.title
    assert.equal(response.status, 201)
    assert.equal(response.body.completed, false)
    assert.equal(response.body.title, 'Prueba estado tarea')

    const updateCompletedTaskResponse = await request(app)
        .patch(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ completed: true })

    assert.equal(updateCompletedTaskResponse.status, 200)
    assert.equal(updateCompletedTaskResponse.body.completed, true)
    assert.equal(updateCompletedTaskResponse.body.title, originalTitle)
    assert.equal(updateCompletedTaskResponse.body.description, response.body.description)
    assert.equal(updateCompletedTaskResponse.body.id, taskId)
    assert.ok(typeof updateCompletedTaskResponse.body.completedAt === 'string')
    assert.ok(updateCompletedTaskResponse.body.completedAt.length > 0)
    assert.equal(updateCompletedTaskResponse.body.createdAt, response.body.createdAt)

    const markIncompletedTaskResponse = await request(app)
        .patch(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ completed: false })

    assert.equal(markIncompletedTaskResponse.status, 200)
    assert.equal(markIncompletedTaskResponse.body.completed, false)
    assert.equal(markIncompletedTaskResponse.body.title, originalTitle)
    assert.equal(markIncompletedTaskResponse.body.description, response.body.description)
    assert.equal(markIncompletedTaskResponse.body.id, taskId)
    assert.equal(markIncompletedTaskResponse.body.createdAt, response.body.createdAt)
    // que ya no esta completedAt porque esta desmarcada
    assert.equal('completedAt' in markIncompletedTaskResponse.body, false)
})


test('PATCH /tasks marcar completa una tarea ya completa', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Prueba estado', description: 'Description test' })

    const taskId = response.body.id
    const originalTitle = response.body.title
    assert.equal(response.status, 201)
    assert.equal(response.body.completed, false)
    assert.equal(response.body.title, 'Prueba estado')

    const markCompletedTaskResponse = await request(app)
        .patch(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ completed: true })

    assert.equal(markCompletedTaskResponse.status, 200)
    assert.equal(markCompletedTaskResponse.body.completed, true)
    assert.equal(markCompletedTaskResponse.body.title, originalTitle)
    assert.equal(markCompletedTaskResponse.body.description, response.body.description)
    assert.equal(markCompletedTaskResponse.body.id, taskId)
    assert.ok(typeof markCompletedTaskResponse.body.completedAt === 'string')
    assert.ok(markCompletedTaskResponse.body.completedAt.length > 0)
    assert.equal(markCompletedTaskResponse.body.createdAt, response.body.createdAt)
    const reMarkCompletedTaskResponse = await request(app)
        .patch(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ completed: true })

    assert.equal(reMarkCompletedTaskResponse.status, 200)
    assert.equal(reMarkCompletedTaskResponse.body.completed, true)
    assert.equal(reMarkCompletedTaskResponse.body.title, originalTitle)
    assert.equal(reMarkCompletedTaskResponse.body.description, response.body.description)
    assert.equal(reMarkCompletedTaskResponse.body.id, taskId)
    assert.ok(typeof reMarkCompletedTaskResponse.body.completedAt === 'string')
    assert.ok(reMarkCompletedTaskResponse.body.completedAt.length > 0)
    assert.equal(reMarkCompletedTaskResponse.body.createdAt, response.body.createdAt)

    assert.equal(reMarkCompletedTaskResponse.body.completedAt, markCompletedTaskResponse.body.completedAt)
})

test('DELETE /tasks eliminar una tarea', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Prueba estado', description: 'Description test' })

    const taskId = response.body.id
    assert.equal(response.status, 201)
    assert.equal(response.body.title, 'Prueba estado')

    const deleteTaskResponse = await request(app)
        .delete(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${token}`)

    assert.equal(deleteTaskResponse.status, 200)
    assert.equal(deleteTaskResponse.body.id, taskId)

    const getDeletedTaskResponse = await request(app).get(`/tasks/${taskId}`).set('Authorization', `Bearer ${token}`)

    assert.equal(getDeletedTaskResponse.status, 404)
    assert.equal(getDeletedTaskResponse.body.message, 'Task not found')
})