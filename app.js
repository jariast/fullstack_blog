const config = require('./utils/config');
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

const middleware = require('./utils/middleware');
const logger = require('./utils/logger');
const Blog = require('./models/blogs');

const mongoUrl = config.MONGODB_URI;
mongoose
  .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    logger.info('Connected to Mongo!');
  })
  .catch((error) => {
    logger.error('Error connecting to DB: ', error.message);
  });

app.use(cors());
app.use(express.json());
app.use(express.static('build'));
app.use(middleware.requestLogger);

app.get('/api/blogs', (request, response) => {
  Blog.find({}).then((blogs) => {
    logger.info('Req on get', request.method);
    response.json(blogs);
  });
});

app.post('/api/blogs', (request, response) => {
  logger.info('TEST on post:', request.path);
  const blog = new Blog(request.body);

  blog
    .save()
    .then((result) => {
      response.status(201).json(result);
    })
    .catch((error) => logger.error(error.message));
});

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
