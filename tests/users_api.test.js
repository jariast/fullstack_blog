const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const helper = require('./test_helper');
const app = require('../app');

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash('password', 10);
  const user = new User({ username: 'admin', name: 'root', passwordHash });

  await user.save();
});

describe('When the DB has one user', () => {
  test('User is returned as JSON', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('The returned user should have the id property instead of _id and no passwordHash', async () => {
    const response = await api.get('/api/users');
    const user = response.body[0];

    expect(user.id).toBeDefined();
    expect(user._id).toBeUndefined();
    expect(user.passwordHash).toBeUndefined();
  });
});

describe('When saving a new User to the DB', () => {
  const newUser = {
    username: 'camono',
    name: 'Camilo Arias',
    password: '12345667',
  };

  test('The number of users in the DB goes up by 1', async () => {
    const usersBeforeInsertion = await helper.usersInDB();

    await api.post('/api/users').send(newUser);
    const usersAfterInsertion = await helper.usersInDB();
    expect(usersAfterInsertion).toHaveLength(usersBeforeInsertion.length + 1);
  });

  test('Succeeds with a 201 status code and application/json header', async () => {
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);
  });

  test('The info of the user should be saved correctly', async () => {
    await api.post('/api/users').send(newUser);
    const usersAfterInsertion = await helper.usersInDB();

    const reducer = (propertiesValues, user) => {
      propertiesValues[0].push(user.name);
      propertiesValues[1].push(user.username);
      return propertiesValues;
    };

    const [names, usernames] = usersAfterInsertion.reduce(reducer, [[], []]);
    expect(names).toContain('Camilo Arias');
    expect(usernames).toContain('camono');
  });

  test('If user has "username" missing it should fail with 400 status', async () => {
    const newInvalidUser = {
      name: 'Camilo Arias',
      password: '12345667',
    };
    await api.post('/api/users').send(newInvalidUser).expect(400);
  });

  test('If user has "password" missing it should fail with 400 status', async () => {
    const newInvalidUser = {
      username: 'camono',
      name: 'Camilo Arias',
    };
    await api.post('/api/users').send(newInvalidUser).expect(400);
  });

  test('If user has username with less than 3 chars it should fail with 400 status', async () => {
    const newInvalidUser = {
      username: 'ca',
      name: 'Camilo Arias',
      password: '12345667',
    };
    await api.post('/api/users').send(newInvalidUser).expect(400);
  });

  test('If user has password with less than 3 chars it should fail with 400 status', async () => {
    const newInvalidUser = {
      username: 'ca',
      name: 'Camilo Arias',
      password: '12',
    };
    await api.post('/api/users').send(newInvalidUser).expect(400);
  });

  test('If user has a duplicate username it should fail with 400 status', async () => {
    const newInvalidUser = {
      username: 'admin',
      name: 'Camilo Arias',
      password: '1245566',
    };
    await api.post('/api/users').send(newInvalidUser).expect(400);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
