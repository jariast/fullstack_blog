const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs.map((blog) => blog.toJSON()));
});

blogsRouter.post('/', async (request, response) => {
  const reqBody = request.body;

  const blog = new Blog({
    title: reqBody.title,
    author: reqBody.author,
    url: reqBody.url,
    likes: reqBody.likes || 0,
  });

  const savedBlog = await blog.save();
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
