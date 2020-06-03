const _ = require('lodash');

const dummy = () => {
  return 1;
};

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => sum + blog.likes;

  return blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
  const reducer = (mostFavBlog, blog) =>
    mostFavBlog.likes > blog.likes ? mostFavBlog : blog;
  return blogs.reduce(reducer);
};

// const mostBlogs = (blogs) => {
//   let blogsByAuthor = _.countBy(blogs, 'author');
//   blogsByAuthor = _.toPairs(blogsByAuthor);
//   blogsByAuthor = blogsByAuthor.map((e) => ({
//     author: e[0],
//     numberOfBlogs: e[1],
//   }));
//   return blogsByAuthor;
// };

//TODO Refactor this!
const mostBlogs = (blogs) => {
  const blogsByAuthor = _.countBy(blogs, 'author');
  const orderedAuthors = Object.entries(blogsByAuthor).sort(
    (a, b) => b[1] - a[1]
  );
  return { author: orderedAuthors[0][0], blogs: orderedAuthors[0][1] };
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs };
