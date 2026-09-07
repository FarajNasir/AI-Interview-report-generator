const mongoose = require("mongoose");

async function connectToDB() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is not defined");
  }

  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log("connected to database");
  } catch (error) {
    console.error("database connection failed:", error.message);
    throw error;
  }
}

module.exports = connectToDB;
