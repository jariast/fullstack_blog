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

  if (error.name === 'NameMissing') {
    return response.status(400).send({ error: 'Name is missing, fix it!' });
  }

  if (error.name === 'NumberMissing') {
    return response.status(400).send({ error: 'Number is missing, fix it!' });
  }

  if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message });
  }

  if (error.name === 'NotFound') {
    return response.status(404).send({ error: 'Person no longer exists' });
  }

  next(error);
};

module.exports = { requestLogger, unknownEndpoint, errorHandler };
