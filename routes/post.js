import express from 'express';
import {  
  deletePost, 
  getPost, 
  getTimelinePosts, 
  likePost, 
  updatePost,
  addComment,
  updateComment,
  deleteComment,
  getComments
} from '../controllers/post.js';

const router = express.Router();

// Post routes

router.get('/posts/:id', getPost);
router.put('/posts/:id', updatePost);
router.delete('/posts/:id', deletePost);
router.put('/posts/:id/like', likePost);
router.get('/posts/:id/timeline', getTimelinePosts);

// Comment routes
router.post('/posts/:id/comment', addComment); 
router.put('/posts/:postId/comment/:commentId', updateComment); 
router.delete('/posts/:postId/comment/:commentId', deleteComment);
router.get('/posts/:id/comments', getComments); 

export default router;
