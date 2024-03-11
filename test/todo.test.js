import request from 'supertest';
import { app, todoToResponseData } from '../src/app.js';
import { assert, describe, it } from 'vitest';
import { getTodos } from '../src/todos.js';

describe.sequential('/todos', () => {
  const req = request(app);

  it('GET /todos', async () => {
    const res = await req.get('/todos');
    assert.match(res.headers['content-type'], /json/);
    assert.strictEqual(res.statusCode, 200);

    const payload = {
      data: getTodos().map(({ id, title }) => ({
        type: 'todos',
        id,
        attributes: { title },
      })),
    };
    assert.deepStrictEqual(res.body, payload);
  });

  it('POST /todos', async () => {
    const title = 'test123';
    const res = await req.post('/todos').send({ title });

    assert.match(res.headers['content-type'], /json/);
    assert.strictEqual(res.statusCode, 201);

    assert.isObject(res.body.data);
    const { data } = res.body;
    assert.typeOf(data.id, 'string');
    assert.strictEqual(data.attributes.title, title);
  });

  it('PUT /todos', async () => {
    const { id } = getTodos().at(-1);
    const title = 'changed';
    const res = await req.put(`/todos/${id}`).send({ title });

    assert.match(res.headers['content-type'], /json/);
    assert.strictEqual(res.statusCode, 200);

    const todo = getTodos().find((todo) => todo.id === id);
    const data = todoToResponseData(todo);
    assert.deepStrictEqual(res.body, { data });
  });

  it('DELETE /todos', async () => {
    const { id } = getTodos().at(-1);
    const res = await req.delete(`/todos/${id}`);

    assert.strictEqual(res.statusCode, 204);
  });
});
