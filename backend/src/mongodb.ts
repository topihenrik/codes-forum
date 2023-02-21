import mongoose from 'mongoose';
import config from './config.js';

try {
  mongoose.set('strictQuery', true);
  await mongoose.connect(config.DB_URI);
  console.log('🥭 Connected to MongoDB');
} catch (error) {
  console.log('Error connection to MongoDB:', error.message);
}
