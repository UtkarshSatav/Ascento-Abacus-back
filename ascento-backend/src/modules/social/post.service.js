const Post = require('../../models/post.model');

const createPost = async (userId, userRole, userName, postData) => {
  const post = await Post.create({
    authorId: userId,
    authorRole: userRole,
    title: postData.title,
    content: postData.content,
    attachments: postData.attachments || [],
    visibility: postData.visibility || 'public'
  });
  return post.populate('likes', 'fullName');
};

const getAllPosts = async (filters = {}) => {
  return Post.find(filters)
    .sort({ isPinned: -1, createdAt: -1 })
    .populate('likes', 'fullName');
};

const getPostById = async (postId) => {
  const post = await Post.findById(postId).populate('likes', 'fullName');
  if (!post) throw { status: 404, message: 'Post not found' };
  return post;
};

const updatePost = async (postId, userId, updateData) => {
  const post = await Post.findById(postId);
  if (!post) throw { status: 404, message: 'Post not found' };
  if (post.authorId.toString() !== userId) throw { status: 403, message: 'Unauthorized' };
  
  Object.assign(post, updateData);
  await post.save();
  return post;
};

const deletePost = async (postId, userId) => {
  const post = await Post.findById(postId);
  if (!post) throw { status: 404, message: 'Post not found' };
  if (post.authorId.toString() !== userId) throw { status: 403, message: 'Unauthorized' };
  
  await Post.findByIdAndDelete(postId);
  return { message: 'Post deleted successfully' };
};

const addComment = async (postId, userId, userName, comment) => {
  const post = await Post.findById(postId);
  if (!post) throw { status: 404, message: 'Post not found' };
  
  post.comments.push({ userId, userName, text: comment });
  post.commentCount = post.comments.length;
  await post.save();
  return post;
};

const removeComment = async (postId, commentId, userId) => {
  const post = await Post.findById(postId);
  if (!post) throw { status: 404, message: 'Post not found' };
  
  const comment = post.comments.id(commentId);
  if (!comment) throw { status: 404, message: 'Comment not found' };
  if (comment.userId.toString() !== userId) throw { status: 403, message: 'Unauthorized' };
  
  post.comments.id(commentId).deleteOne();
  post.commentCount = post.comments.length;
  await post.save();
  return post;
};

module.exports = { createPost, getAllPosts, getPostById, updatePost, deletePost, addComment, removeComment };
