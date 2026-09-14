import test from "node:test";
import assert from "node:assert/strict";
import request from 'supertest' // para las llamadas http
import jwt from 'jsonwebtoken'
import app from "../app.ts";

process.env.SECRET_KEY = 'my-secret-key'
const TEST_USER_ID = '123'

const token = jwt.sign({ 'userId': TEST_USER_ID }, process.env.SECRET_KEY)

test('POST /tasks crea una tarea', async () => {
    const taskInput = {
        title: 'titulo de prueba'
    }
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send(taskInput)

    // aqui las comprobanciones

    assert.equal(response.status, 200)
    assert.equal(response.body.title, taskInput.title)
    assert.equal(response.body.userId, TEST_USER_ID)
    assert.equal(response.body.completed, false)
    assert.ok(response.body.id.length > 0)
    assert.equal(typeof response.body.id, 'string')
    assert.equal(typeof response.body.createdAt, 'string')
})