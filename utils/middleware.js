const logger = require('./logger');

const requestLogger = (request, response, next) => {
  logger.info('Method: ', request.method);
  logger.info('Path: ', request.path);
  logger.info('Body: ', request.body);
  logger.info('****----****----****----');
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'Unknown Endpoint' });
};

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'Wrongly formatted ID' });
  }

  if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message });
  }

  if (error.message === 'PasswordError') {
    return response.status(400).send({ error: 'Password Validation error' });
  }

  if (error.message === 'LoginError') {
    return response.status(401).send({ error: 'Invalid username or password' });
  }

  if (error.message === 'TokenValidationError') {
    return response.status(401).send({ error: 'Missing or invalid Token' });
  }

  if (error.name === 'JsonWebTokenError') {
    return response.status(401).send({ error: error.message });
  }

  if (error.message === 'NotFound') {
    return response.status(404).send({ error: error.message });
  }

  logger.error(
    `Unhandled Error --- Name: ${error.name} --- Mgs: ${error.message}`
  );

  next(error);
};

module.exports = { requestLogger, unknownEndpoint, errorHandler };
