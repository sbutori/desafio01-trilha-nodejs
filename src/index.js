const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {}

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

  return response.status(201).json({
    status: 'success',
    message: 'User account created successfully!',
    ...newUser,
  });
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;
