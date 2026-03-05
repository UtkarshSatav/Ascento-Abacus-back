const express = require('express');
const authenticate = require('../../middlewares/auth.middleware');
const { permit } = require('../../middlewares/role.middleware');
const postController = require('./post.controller');
const likeController = require('./like.controller');

const router = express.Router();

// Post Routes
router.post('/posts', authenticate, postController.createNewPost);
router.get('/posts', authenticate, postController.listAllPosts);
router.get('/posts/:postId', authenticate, postController.viewPost);
router.put('/posts/:postId', authenticate, postController.editPost);
router.delete('/posts/:postId', authenticate, postController.removePost);

// Comment Routes
router.post('/posts/:postId/comment', authenticate, postController.postComment);
router.delete('/posts/:postId/comment/:commentId', authenticate, postController.deleteComment);

// Like Routes
router.post('/posts/:postId/like', authenticate, likeController.toggleLike);
router.get('/posts/:postId/likes', authenticate, likeController.getPostLikes);

module.exports = router;
