require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const Task = require('./models/task');
const mongoose  = require('mongoose');

app.use(express.json());
app.use(morgan('tiny'));
app.use(cors());
app.use(express.static('dist'));

app.get('/api/tasks', (request, response) => {
  Task.find({}).then(result => {
    response.send(result);
  })
    .catch(error => 
      console.log(error)
    );
});

app.get('/api/tasks/:id', (request, response, next) => {
  Task.findById(request.params.id)
    .then(task => {
      if (task) {
        response.json(task);    
      } else {
        response.status(404).end();
      } 
    })
    .catch(error => next(error));
});

app.delete('/api/tasks/:id', (request, response) => {
  Task
    .findByIdAndDelete(request.params.id)
    .then(task => {
      if (task) {
        response.status(204).end();
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error));
});

app.post('/api/tasks', (request, response, next) => {
  const body = request.body;

  const task = new Task({
    title: body.title,
    description: body.description,
    completed: body.completed || false,
    tag: body.tag,
  });

  task.save()
    .then(result => {
      console.log('Note saved!', result);
      response.json(result);
    })
    .catch(error => next(error));
});

app.put('/api/tasks/:id', (request, response, next) => {
  const { title, description, completed, tag } = request.body;

  Task.findByIdAndUpdate(request.params.id, 
    { title, description, completed, tag }, 
    { new: true, runValidators: true, context: 'query' })
    .then(updateObject => {
      response.send(updateObject);
    })
    .catch(error => next(error));
});

const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running in port: ${PORT}`);
});
