import express from 'express';
import User from '../models/user.js';
import Post from '../models/post.js';
import Comment from '../models/comment.js';

const router = express.Router();

router.post('/delete', async (req, res) => {
  try {
    await User.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});
    console.log('🥭 Deleted all documents');
    return res.end();
  } catch (err) {
    console.error(err);
    return res.end();
  }
});

export default router;
