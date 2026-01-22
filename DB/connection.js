import mongoose from "mongoose";

let isConnected = false;

export default async function dbConnection() {
  if (isConnected) {
    console.log("Using existing DB connection");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.CONNECTION_DB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
    });
    isConnected = db.connections[0].readyState === 1;
    console.log("DB connected");
  } catch (error) {
    console.log("DB failure", error);
    throw error;
  }
}