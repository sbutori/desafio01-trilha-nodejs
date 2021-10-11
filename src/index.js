const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;
  if (!users.some((u) => u.username === username)) {
    return response.status(404).json({
      status: 'fail',
      message: 'Invalid user',
    });
  }

  next();
}

function getUserTodos(request) {
  const { username } = request.headers;
  const user = users.find((u) => u.username === username);
  const todos = user.todos;
  return todos;
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;

  if (users.some((u) => u.username === username)) {
    return response.status(400).json({
      status: 'error',
      error: 'An account with that username already exists! Choose another one',
    });
  }

  const newUser = {
    id: uuidv4(),
    name,
    username,
    todos: [],
  };
  users.push(newUser);

  return response.status(201).json(newUser);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const todos = getUserTodos(request);

  return response.status(200).json(todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const todos = getUserTodos(request);

  const newTodo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };
  todos.push(newTodo);

  return response.status(201).json(newTodo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { id } = request.params;
  const todos = getUserTodos(request);

  const updatedTodo = todos.find((todo) => todo.id === id);
  if (!updatedTodo) {
    return response
      .status(404)
      .json({ status: 'fail', error: 'No Todo with that id was found.' });
  }
  updatedTodo.title = title;
  updatedTodo.deadline = deadline;

  return response.status(200).json(updatedTodo);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const todos = getUserTodos(request);

  const doneTodo = todos.find((todo) => todo.id === id);
  if (!doneTodo) {
    return response
      .status(404)
      .json({ status: 'fail', error: 'No Todo with that id was found.' });
  }
  doneTodo.done = true;

  return response.status(200).json(doneTodo);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { username } = request.headers;
  const user = users.find((u) => u.username === username);

  const todos = user.todos;
  const filteredTodos = todos.filter((todo) => todo.id !== id);
  if (todos.length === filteredTodos.length) {
    return response
      .status(404)
      .json({ status: 'fail', error: 'No Todo with that id was found.' });
  }
  user.todos = filteredTodos;

  return response.status(204).json(null);
});

module.exports = app;
