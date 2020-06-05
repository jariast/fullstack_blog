const mongoose = require('mongoose');
const supertest = require('supertest');
const jwt = require('jsonwebtoken');

const Blog = require('../models/blog');
const User = require('../models/user');
const helper = require('./test_helper');
const app = require('../app');

const api = supertest(app);
let firstUserToken = '';
let secondUserToken = '';
let firstUserId = '';

beforeAll(async () => {
  await helper.createDummyUsers();
  const users = await helper.usersInDB();
  firstUserId = users[0].id;
  [firstUserToken, secondUserToken] = users.map((user) =>
    jwt.sign({ username: user.username, id: user.id }, process.env.SECRET)
  );
});

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = helper.initialBlogs.map((blog) => {
    blog.user = firstUserId;
    return new Blog(blog);
  });
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
  const blogIds = [(await promiseArray[0])._id, (await promiseArray[0])._id];
  await User.findByIdAndUpdate(firstUserId, { blogs: blogIds });
});

describe('When the DB has some blogs on it', () => {
  test('Blogs are returned as JSON', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('There are two blogs', async () => {
    const response = await api.get('/api/blogs');

    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test('A specific blog title is in the returned blogs', async () => {
    const response = await api.get('/api/blogs');

    const titles = response.body.map((r) => r.title);

    expect(titles).toContain('Blog06');
  });

  test('The returned blogs should have the id property instead of _id', async () => {
    const response = await api.get('/api/blogs');
    const blog = response.body[0];

    expect(blog.id).toBeDefined();
    expect(blog._id).toBeUndefined();
  });
});

describe('When saving a new blog', () => {
  test('The number of blogs in the system goes up by 1', async () => {
    const newBlog = {
      title: 'BlogTest',
      author: 'Test Author',
      url: 'testurl.com',
      likes: 2,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${firstUserToken}`)
      .expect(201);
    const blogsAfterInsertion = await helper.blogsInDB();
    expect(blogsAfterInsertion).toHaveLength(helper.initialBlogs.length + 1);
  });

  test('Succeeds with a 201 status code and application/json header', async () => {
    const newBlog = {
      title: 'BlogTest',
      author: 'Test Author',
      url: 'testurl.com',
      likes: 2,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${firstUserToken}`)
      .expect(201)
      .expect('Content-Type', /application\/json/);
  });

  test('The info of the blog is saved correctly', async () => {
    const newBlog = {
      title: 'BlogTest',
      author: 'Test Author',
      url: 'testurl.com',
      likes: 2,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${firstUserToken}`);
    const blogsAfterInsertion = await helper.blogsInDB();

    const reducer = (propertiesValues, blog) => {
      propertiesValues[0].push(blog.title);
      propertiesValues[1].push(blog.author);
      propertiesValues[2].push(blog.url);
      propertiesValues[3].push(blog.likes);
      return propertiesValues;
    };

    const [titles, authors, urls, likes] = blogsAfterInsertion.reduce(reducer, [
      [],
      [],
      [],
      [],
    ]);

    // I really dont know whats better here if using reduce or a map call for each property

    // const titles = blogsAfterInsertion.map((b) => b.title);
    expect(titles).toContain('BlogTest');

    // const authors = blogsAfterInsertion.map((b) => b.author);
    expect(authors).toContain('Test Author');

    // const urls = blogsAfterInsertion.map((b) => b.url);
    expect(urls).toContain('testurl.com');

    // const likes = blogsAfterInsertion.map((b) => b.likes);
    expect(likes).toContain(2);
  });

  test('If saving a blog without "likes" property, it should default to 0', async () => {
    const newBlog = {
      title: 'BlogTest',
      author: 'Test Author',
      url: 'testurl.com',
    };

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${firstUserToken}`);
    expect(response.body.likes).toBe(0);
  });

  test('If saving a blog without "title" and "url" properties, it should fail with 400 status', async () => {
    const newBlog = {
      author: 'Test Author',
      likes: '45',
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${firstUserToken}`)
      .expect(400);
  });

  test('If the request is missing the token, it should fail with a 401 status', async () => {
    const newBlog = {
      title: 'BlogTest',
      author: 'Test Author',
      url: 'testurl.com',
      likes: 2,
    };

    await api.post('/api/blogs').send(newBlog).expect(401);
  });
});

describe('When Deleting a blog', () => {
  test('If ID is valid, the blog should be deleted and the status should be 204', async () => {
    const blogsBeforeDeletion = await helper.blogsInDB();
    const blogToBeDeleted = blogsBeforeDeletion[0];

    await api
      .delete(`/api/blogs/${blogToBeDeleted.id}`)
      .set('Authorization', `bearer ${firstUserToken}`)
      .expect(204);

    const blogsAfterDeletion = await helper.blogsInDB();
    expect(blogsAfterDeletion).toHaveLength(blogsBeforeDeletion.length - 1);

    const titles = blogsAfterDeletion.map((b) => b.title);
    expect(titles).not.toContain(blogToBeDeleted.title);
  });

  test('If the request is missing the token, it should fail with a 401 status', async () => {
    const blogsBeforeDeletion = await helper.blogsInDB();
    const blogToBeDeleted = blogsBeforeDeletion[0];

    await api.delete(`/api/blogs/${blogToBeDeleted.id}`).expect(401);
  });

  test('If logged user is not the owner of the blog, it should fail with a 401 status', async () => {
    const blogsBeforeDeletion = await helper.blogsInDB();
    const blogToBeDeleted = blogsBeforeDeletion[0];

    await api
      .delete(`/api/blogs/${blogToBeDeleted.id}`)
      .set('Authorization', `bearer ${secondUserToken}`)
      .expect(401);
  });
});

describe('When updating a blog', () => {
  test('If ID is valid, the blog should update its likes', async () => {
    const blogsBeforeUpdate = await helper.blogsInDB();
    const blogToBeUpdated = blogsBeforeUpdate[1];
    blogToBeUpdated.likes = blogToBeUpdated.likes + 10;

    await api
      .put(`/api/blogs/${blogToBeUpdated.id}`)
      .send(blogToBeUpdated)
      .expect(200);

    const blogsAfterUpdate = await helper.blogsInDB();
    expect(blogsAfterUpdate).toHaveLength(blogsBeforeUpdate.length);

    const updatedBlog = blogsAfterUpdate[1];

    expect(updatedBlog.likes).toBe(blogToBeUpdated.likes);
  });

  test('That has a valid ID but no longer exists, it fails with status 404', async () => {
    const validID = await helper.nonExistingId();
    const blogToBeUpdated = helper.initialBlogs[0];

    await api.put(`/api/blogs/${validID}`).send(blogToBeUpdated).expect(404);
  });

  test('That has an Invalid ID, it fails with status 400', async () => {
    const invalidId = '5a3d5da59070081a82a3445';
    const blogToBeUpdated = helper.initialBlogs[0];

    await api.put(`/api/blogs/${invalidId}`).send(blogToBeUpdated).expect(400);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
