#!/usr/bin/env node
require("dotenv").config();
const mongoose = require("mongoose");

const testConnection = async () => {
  try {
    console.log("🔌 Testing MongoDB connection...");
    console.log(
      `📍 URI: ${process.env.MONGODB_URI.replace(
        /\/\/([^:]+):([^@]+)@/,
        "//***:***@"
      )}`
    );

    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("✅ MongoDB connection successful!");
    console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);

    // List collections
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log(`📁 Collections (${collections.length}):`);
    collections.forEach((col) => {
      console.log(`   - ${col.name}`);
    });

    await mongoose.connection.close();
    console.log("\n✅ Connection test completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ MongoDB connection failed:");
    console.error(error.message);
    process.exit(1);
  }
};

testConnection();
