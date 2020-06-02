const listHelper = require('../utils/list_helper');

describe('dummy function', () => {
  test('Dummy returns one always', () => {
    const blogs = [];
    const result = listHelper.dummy(blogs);
    expect(result).toBe(1);
  });
});

describe('totalLikes', () => {
  const listWithOneBlog = [
    {
      title: 'Blog03',
      author: 'Romila',
      url: 'google.com',
      likes: 10,
      id: '5ed687ca4cc7b3251837b61d',
    },
  ];

  const listWithManyBlogs = [
    {
      title: 'Blog01',
      author: 'Camilo',
      url: 'google.com',
      likes: 0,
      id: '5ed66c2e2a9d3633c4c17f9f',
    },
    {
      title: 'Blog02',
      author: 'Camilo',
      url: 'google.com',
      likes: 4,
      id: '5ed67a047ef88a3908308c1b',
    },
    {
      title: 'Blog03',
      author: 'Romila',
      url: 'google.com',
      likes: 10,
      id: '5ed687ca4cc7b3251837b61d',
    },
  ];

  const emptyListOfBlogs = [];

  test('of one blog should be that blogs likes', () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    expect(result).toBe(10);
  });

  test('of many is calculated correctly', () => {
    const result = listHelper.totalLikes(listWithManyBlogs);
    expect(result).toBe(14);
  });

  test('of empty list is 0', () => {
    const result = listHelper.totalLikes(emptyListOfBlogs);
    expect(result).toBe(0);
  });
});

describe('favoriteBlog', () => {
  const listWithOneBlog = [
    {
      title: 'Blog03',
      author: 'Romila',
      url: 'google.com',
      likes: 10,
      id: '5ed687ca4cc7b3251837b61d',
    },
  ];

  const listWithManyBlogs = [
    {
      title: 'Blog01',
      author: 'Camilo',
      url: 'google.com',
      likes: 0,
      id: '5ed66c2e2a9d3633c4c17f9f',
    },
    {
      title: 'Blog02',
      author: 'Camilo',
      url: 'google.com',
      likes: 4,
      id: '5ed67a047ef88a3908308c1b',
    },
    {
      title: 'Blog03',
      author: 'Romila',
      url: 'google.com',
      likes: 10,
      id: '5ed687ca4cc7b3251837b61d',
    },
  ];

  test('of a list with one blog should be that blog', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog);
    expect(result).toEqual({
      title: 'Blog03',
      author: 'Romila',
      url: 'google.com',
      likes: 10,
      id: '5ed687ca4cc7b3251837b61d',
    });
  });

  test('of a list with many blogs should be the most liked blog', () => {
    const result = listHelper.favoriteBlog(listWithManyBlogs);
    expect(result).toEqual({
      title: 'Blog03',
      author: 'Romila',
      url: 'google.com',
      likes: 10,
      id: '5ed687ca4cc7b3251837b61d',
    });
  });
});
