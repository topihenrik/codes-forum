import mongoose from "mongoose";

const mongoURI = process.env.NODE_ENV === "production" 
    ? process.env.DB_URI                            // production
    : process.env.NODE_ENV === "development"
        ? "mongodb://127.0.0.1:27017/devops-dev"    // development
        : "mongodb://127.0.0.1:27017/devops-test";  // test

try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(mongoURI);
    console.log("🥭 Connected to MongoDB")
} catch (error) {
    console.log("Error connection to MongoDB:", error.message)
}
