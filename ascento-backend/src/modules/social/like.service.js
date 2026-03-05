const Like = require('../../models/like.model');
const Post = require('../../models/post.model');

const likePost = async (postId, userId, userRole, userName) => {
  const post = await Post.findById(postId);
  if (!post) throw { status: 404, message: 'Post not found' };
  
  const alreadyLiked = post.likes.includes(userId);
  if (alreadyLiked) throw { status: 400, message: 'Already liked this post' };
  
  post.likes.push(userId);
  post.likeCount = post.likes.length;
  await post.save();
  
  await Like.create({ postId, userId, userRole, userName });
  
  return post;
};

const unlikePost = async (postId, userId) => {
  const post = await Post.findById(postId);
  if (!post) throw { status: 404, message: 'Post not found' };
  
  post.likes = post.likes.filter(id => id.toString() !== userId);
  post.likeCount = post.likes.length;
  await post.save();
  
  await Like.findOneAndDelete({ postId, userId });
  
  return post;
};

const getLikesForPost = async (postId) => {
  return Like.find({ postId }).sort({ createdAt: -1 });
};

const hasUserLiked = async (postId, userId) => {
  const like = await Like.findOne({ postId, userId });
  return !!like;
};

module.exports = { likePost, unlikePost, getLikesForPost, hasUserLiked };
