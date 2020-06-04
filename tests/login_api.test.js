const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcrypt');

const User = require('../models/user');
// const helper = require('./test_helper');
const app = require('../app');

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash('password', 10);
  const user = new User({ username: 'admin', name: 'root', passwordHash });

  await user.save();
});

describe('When an user tries to login:', () => {
  const apiUrl = '/api/login';

  test('The operation succeeds and returns a 200 code and token', async () => {
    const credentials = {
      username: 'admin',
      password: 'password',
    };
    const response = await api.post(apiUrl).send(credentials).expect(200);
    const resBody = response.body;

    expect(resBody.username).toBeDefined();
    expect(resBody.name).toBeDefined();
    expect(resBody.token).toBeDefined();
  });

  test('If username is invalid it should fail with a 201 status', async () => {
    const invalidCredentials = {
      username: 'nonExistentUsername',
      password: 'password',
    };
    await api.post(apiUrl).send(invalidCredentials).expect(401);
  });

  test('If password is invalid it should fail with a 201 status', async () => {
    const invalidCredentials = {
      username: 'admin',
      password: 'invalidPassword',
    };
    await api.post(apiUrl).send(invalidCredentials).expect(401);
  });

  test('If username property is missing it should fail with a 201 status', async () => {
    const invalidCredentials = {
      password: 'invalidPassword',
    };
    await api.post(apiUrl).send(invalidCredentials).expect(401);
  });

  test('If password property is missing it should fail with a 201 status', async () => {
    const invalidCredentials = {
      username: 'admin',
    };
    await api.post(apiUrl).send(invalidCredentials).expect(401);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
