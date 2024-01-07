import mongoose from 'mongoose';
import config from '../config.js';
import User from '../models/user.js';
import Post from '../models/post.js';
import Comment from '../models/comment.js';
import devData from './dev-data.js';

const initializeDB = async () => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(config.DB_URI);
    console.log('🥭 Connected to MongoDB');
    console.log('⏳ Insert in progress..');
    await User.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});
    await User.insertMany(devData.users, { lean: true });
    await Post.insertMany(devData.posts, { lean: true });
    await Comment.insertMany(devData.comments, { lean: true });
    console.log('✅ Insert done!');
    process.exit();
  } catch (error) {
    console.log('Error connection to MongoDB:', error.message);
  }
};
initializeDB();
