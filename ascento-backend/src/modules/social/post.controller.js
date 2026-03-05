const { createPost, getAllPosts, getPostById, updatePost, deletePost, addComment, removeComment } = require('./post.service');

const createNewPost = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const userName = req.user.name || 'Anonymous';
    
    const post = await createPost(userId, userRole, userName, req.body);
    res.status(201).json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

const listAllPosts = async (req, res, next) => {
  try {
    const { visibility } = req.query;
    const filters = visibility ? { visibility } : {};
    const posts = await getAllPosts(filters);
    res.status(200).json({ success: true, data: posts });
  } catch (err) {
    next(err);
  }
};

const viewPost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await getPostById(postId);
    res.status(200).json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

const editPost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;
    const post = await updatePost(postId, userId, req.body);
    res.status(200).json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

const removePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;
    const result = await deletePost(postId, userId);
    res.status(200).json({ success: true, message: result.message });
  } catch (err) {
    next(err);
  }
};

const postComment = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;
    const userName = req.user.name || 'Anonymous';
    const { comment } = req.body;
    
    if (!comment) throw { status: 400, message: 'Comment text is required' };
    
    const post = await addComment(postId, userId, userName, comment);
    res.status(201).json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user.id;
    const post = await removeComment(postId, commentId, userId);
    res.status(200).json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

module.exports = { createNewPost, listAllPosts, viewPost, editPost, removePost, postComment, deleteComment };
