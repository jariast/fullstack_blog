const testingRouter = require('express').Router();
const User = require('../models/user');
const Blog = require('../models/blog');

testingRouter.post('/reset', async (request, response) => {
  await User.deleteMany({});
  await Blog.deleteMany({});

  response.status(204).end();
});

testingRouter.post('/createBlogWithRandomUserId', async (request, response) => {
  const reqBody = request.body;
  const blog = new Blog({
    title: reqBody.title,
    author: reqBody.author,
    url: reqBody.url,
    likes: 0,
    user: reqBody.userId,
  });

  const user = await User.findById(reqBody.userId);
  console.log('User: ', user);

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  response.status(201).json(savedBlog.toJSON());
});

module.exports = testingRouter;
