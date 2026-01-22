import mongoose from "mongoose";


export default async function dbConnection() {
  try {
    await mongoose.connect(process.env.CONNECTION_DB_URI);
    console.log("DB connected");
  } catch (error) {
    console.log("DB failure", error);
  }
}