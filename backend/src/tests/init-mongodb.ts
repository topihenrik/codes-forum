import mongoose from 'mongoose';

const initializeForTests = async () => {
  try {
    const mongoURI = 'mongodb://127.0.0.1:27017/test-codes-forum';
    mongoose.set('strictQuery', true);
    const db = await mongoose.connect(mongoURI);

    // Delete old data
    await mongoose.connection.db.dropDatabase();

    // Initialize data
    // await Book.insertMany(initBooks);
    await db.disconnect();
    console.log('🥭 Added initial data to MongoDB');
  } catch (err) {
    console.error(err);
  }
};

initializeForTests();
