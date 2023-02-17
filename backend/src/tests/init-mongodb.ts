import mongoose from 'mongoose';
import Book from '../models/book.js';

const initBooks = [
  {
    _id: '63deda73b6dfd7ffcc0ea3d2',
    title: 'The Awakening',
    author: 'Kate Chopin',
  },
  {
    _id: '63deda800d9d23e402328f08',
    title: 'City of Glass',
    author: 'Paul Auster',
  },
  {
    _id: '63dedb2369d18f95e81f8790',
    title: 'One Thousand Cthulhu Attacks',
    author: 'James McMillan',
  },
];

/* const initPosts = [
    {
        title: "Help with code!",
        code: "<h1>Hello World<h1>"
    }
] */

const initializeForTests = async () => {
  try {
    const mongoURI = 'mongodb://127.0.0.1:27017/devops-test';
    mongoose.set('strictQuery', true);
    const db = await mongoose.connect(mongoURI);

    // Delete old data
    const { collections } = mongoose.connection;
    await Promise.all(
      Object.keys(collections).map((key) => collections[key].deleteMany({})),
    );

    // Initialize data
    await Book.insertMany(initBooks);
    await db.disconnect();
    console.log('🥭 Added initial data to MongoDB');
  } catch (err) {
    console.error(err);
  }
};

initializeForTests();
