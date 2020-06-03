const Blog = require('../models/blog');

const initialBlogs = [
  {
    title: 'Blog01',
    author: 'Camilo',
    url: 'google.com',
    likes: 4,
  },
  {
    title: 'Blog06',
    author: 'Romila',
    url: 'google.com',
    likes: 6,
  },
];

const nonExistingId = async () => {
  const blog = new Blog({ title: 'BlogToBeRemoved' }); //This might change if we add more validations
  await blog.save();
  await blog.remove();

  return blog._id.toString();
};

const blogsInDB = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

module.exports = { initialBlogs, nonExistingId, blogsInDB };
