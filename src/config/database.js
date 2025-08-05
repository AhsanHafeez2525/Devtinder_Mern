const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://ahsansatti402:xzVbTQNUqri2NWAb@cluster0.etcwvym.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
