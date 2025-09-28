const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.DB_CONNECTION_SECRET) {
      throw new Error("DB_CONNECTION_SECRET environment variable is not set");
    }
    console.log("Connecting to database...");
    await mongoose.connect(process.env.DB_CONNECTION_SECRET);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
};

module.exports = connectDB;
