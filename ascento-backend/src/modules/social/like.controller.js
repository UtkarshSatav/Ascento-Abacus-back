const { likePost, unlikePost, getLikesForPost, hasUserLiked } = require('./like.service');

const toggleLike = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;
    const userName = req.user.name || 'Anonymous';
    
    const isLiked = await hasUserLiked(postId, userId);
    
    if (isLiked) {
      const post = await unlikePost(postId, userId);
      res.status(200).json({ success: true, liked: false, data: post });
    } else {
      const post = await likePost(postId, userId, userRole, userName);
      res.status(200).json({ success: true, liked: true, data: post });
    }
  } catch (err) {
    next(err);
  }
};

const getPostLikes = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const likes = await getLikesForPost(postId);
    res.status(200).json({ success: true, data: likes, count: likes.length });
  } catch (err) {
    next(err);
  }
};

module.exports = { toggleLike, getPostLikes };
