const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.get('/', async (request, response) => {
  const users = await User.find({});
  response.json(users.map((user) => user.toJSON()));
});

usersRouter.post('/', async (request, response) => {
  const reqBody = request.body;

  if (!reqBody.password || reqBody.password.length < 3) {
    throw Error('PasswordError');
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(reqBody.password, saltRounds);

  const user = new User({
    username: reqBody.username,
    name: reqBody.name,
    passwordHash,
  });

  const savedUser = await user.save();

  response.status(201).json(savedUser);
});

module.exports = usersRouter;
