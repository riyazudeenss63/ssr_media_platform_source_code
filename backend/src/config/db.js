const mongoose = require("mongoose");
const { setMongoConnected } = require("./inMemoryStore");

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!mongoUri) {
    console.log("ℹ️ No MONGO_URI provided — running with high-performance in-memory datastore");
    setMongoConnected(false);
    return;
  }

  try {
    mongoose.set("bufferCommands", false);
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log("✅ MongoDB Connected Successfully");
    setMongoConnected(true);
  } catch (err) {
    console.warn("⚠️ MongoDB connection failed (" + err.message + ") — falling back to in-memory datastore");
    setMongoConnected(false);
  }
};

module.exports = connectDB;
