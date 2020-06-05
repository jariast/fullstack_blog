const Blog = require('../models/blog');
const User = require('../models/user');

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

const initialUsers = [
  { username: 'admin', name: 'root', passwordHash: '123' },
  { username: 'regularJoe', name: 'Regular user', passwordHash: '567' },
];

const nonExistingId = async () => {
  const blog = new Blog({ title: 'BlogToBeRemoved', url: 'anyurl.com' }); //This might change if we add more validations
  await blog.save();
  await blog.remove();

  return blog._id.toString();
};

const blogsInDB = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDB = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

const createDummyUsers = async () => {
  await User.deleteMany({});

  const userObjects = initialUsers.map((user) => new User(user));
  const promiseArray = userObjects.map((user) => user.save());
  await Promise.all(promiseArray);
};

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDB,
  usersInDB,
  createDummyUsers,
};
