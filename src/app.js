import express from 'express';
import {
  addTodo,
  getTodos,
  isTodoFound,
  removeTodo,
  setTodos,
} from './todos.js';
import { body, param } from 'express-validator';
import cors from 'cors';

export const app = express();

app.use(express.json());
app.use(cors());

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

app.put(
  '/todos/:id',
  param('id').isString().custom(isTodoFound),
  body('title').isString().notEmpty(),
  (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    const newTodos = getTodos().map((todo) =>
      todo.id !== id ? todo : { id, title }
    );
    setTodos(newTodos);
    const data = todoToResponseData({ id, title });
    res.send({ data });
  }
);

app.delete(
  '/todos/:id',
  param('id').isString().custom(isTodoFound),
  (req, res) => {
    const { id } = req.params;
    removeTodo(id);
    res.status(204).send();
  }
);

export function todoToResponseData({ id, title }) {
  return {
    type: 'todos',
    id,
    attributes: { title },
  };
}
