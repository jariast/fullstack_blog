const blogsRouter = require('express').Router();
const jwt = require('jsonwebtoken');

const Blog = require('../models/blog');
const User = require('../models/user');

const getTokenFrom = (request) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    return authorization.substring(7);
  }
  return null;
};

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
  });
  response.json(blogs.map((blog) => blog.toJSON()));
});

blogsRouter.post('/', async (request, response) => {
  const reqBody = request.body;
  const token = getTokenFrom(request);
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!token || !decodedToken.id) {
    throw Error('TokenValidationError');
  }

  const user = await User.findById(decodedToken.id);

  const blog = new Blog({
    title: reqBody.title,
    author: reqBody.author,
    url: reqBody.url,
    likes: reqBody.likes || 0,
    user: user.id,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog.toJSON());
});

blogsRouter.delete('/:id', async (request, response) => {
  const blogId = request.params.id;
  await Blog.findByIdAndRemove(blogId);
  response.status(204).end();
});

blogsRouter.put('/:id', async (request, response) => {
  const blogId = request.params.id;
  const body = request.body;

  const options = { new: true, runValidators: true };
  const updatedBlog = await Blog.findByIdAndUpdate(
    blogId,
    { likes: body.likes },
    options
  );

  if (!updatedBlog) throw Error('NotFound');

  response.json(updatedBlog);
});

module.exports = blogsRouter;
