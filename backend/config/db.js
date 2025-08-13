const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${connection.connection.host}`);
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);

    // Provide specific troubleshooting based on error
    if (error.message.includes("IP")) {
      console.log("\n🚨 IP WHITELIST ISSUE:");
      console.log("1. Go to MongoDB Atlas Dashboard");
      console.log("2. Navigate to Network Access");
      console.log(
        "3. Add your current IP or use 0.0.0.0/0 (for development only)"
      );
    } else if (error.message.includes("authentication")) {
      console.log("\n🚨 AUTHENTICATION ISSUE:");
      console.log("1. Check your MongoDB username and password");
      console.log("2. Verify the database name in your connection string");
    } else if (error.message.includes("timeout")) {
      console.log("\n🚨 TIMEOUT ISSUE:");
      console.log("1. Check your internet connection");
      console.log("2. Verify the MongoDB cluster is running");
    }

    process.exit(1);
  }
};

module.exports = connectDB;
