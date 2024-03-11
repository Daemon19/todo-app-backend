import request from 'supertest';
import { app } from '../src/app.js';
import { assert, describe, it } from 'vitest';
import { getTodos } from '../src/todos.js';

const req = request(app);

describe('GET /todos', () => {
  it('responds with json', async () => {
    const res = await req.get('/todos');
    assert.match(res.headers['content-type'], /json/);
    assert.strictEqual(res.statusCode, 200);
  });

  it('responds with correct payload', async () => {
    const res = await req.get('/todos');
    const payload = {
      data: getTodos().map(({ id, title }) => ({
        type: 'todos',
        id,
        attributes: { title },
      })),
    };
    assert.deepStrictEqual(res.body, payload);
  });
});

describe('POST /todos', async () => {
  const title = 'test123';
  const res = await req.post('/todos').send({ title });

  it('responds with json', () => {
    assert.match(res.headers['content-type'], /json/);
    assert.strictEqual(res.statusCode, 201);
  });

  it('responds with correct payload', () => {
    assert.isObject(res.body.data);
    const { data } = res.body;
    assert.typeOf(data.id, 'string');
    assert.strictEqual(data.attributes.title, title);
  });
});

describe('DELETE /todos', async () => {
  const { id } = getTodos().at(-1);
  const res = await req.delete(`/todos/${id}`);

  it('responds with 204 status code', () => {
    assert.strictEqual(res.statusCode, 204);
  });
});
