import { v4 as uuidv4 } from 'uuid';

const todos = [
  {
    id: uuidv4(),
    title: 'Catch the python',
  },
];

export function addTodo(title) {
  const todo = {
    id: uuidv4(),
    title,
  };
  todos.push(todo);
  return todo;
}

export function removeTodo(id) {
  todos.splice(todos.findIndex((todo) => todo.id === id));
}

export function getTodos() {
  return todos;
}

export function isTodoFound(id) {
  return !!getTodos().find((todo) => todo.id === id);
}
