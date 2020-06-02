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

module.exports = { dummy, totalLikes, favoriteBlog };
