import express from 'express';
import { addTodo, getTodos, isTodoFound, removeTodo } from './todos.js';
import { body, param } from 'express-validator';

export const app = express();

app.use(express.json());

app.get('/todos', (req, res) => {
  const data = getTodos().map((todo) => todoToResponseData(todo));
  res.send({ data });
});

app.post('/todos', body('title').isString().notEmpty(), (req, res) => {
  const { title } = req.body;
  const todo = addTodo(title);
  const data = todoToResponseData(todo);
  res.status(201).send({ data });
});

app.delete(
  '/todos/:id',
  param('id').isString().custom(isTodoFound),
  (req, res) => {
    const { id } = req.params;
    removeTodo(id);
    res.status(204).send();
  }
);

function todoToResponseData({ id, title }) {
  return {
    type: 'todos',
    id,
    attributes: { title },
  };
}
