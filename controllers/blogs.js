const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', (request, response, next) => {
  Blog.find({})
    .then((blogs) => {
      response.json(blogs.map((blog) => blog.toJSON()));
    })
    .catch((error) => next(error));
});

blogsRouter.post('/', (request, response, next) => {
  const reqBody = request.body;

  const blog = new Blog({
    title: reqBody.title,
    author: reqBody.author,
    url: reqBody.url,
    likes: reqBody.likes,
  });

  blog
    .save()
    .then((savedBlog) => response.status(201).json(savedBlog.toJSON()))
    .catch((error) => next(error));
});

module.exports = blogsRouter;
