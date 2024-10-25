import mongoose from 'mongoose';
import dotenv from "dotenv";

dotenv.config({
  path: ".env"
})

type ConnectionObject = {
  isConnected?: number
}

const connection: ConnectionObject = {}

async function connectDB(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected to db");
    return
  }
  try {
    const connect = await mongoose.connect(process.env.NEXT_PUBLIC_MONGODB_URI as string || "");
    connection.isConnected = connect.connections[0].readyState;
    console.log("DB connected")
  } catch (error) {
    console.log("Database connection failed", error)
    process.exit(1)
  }
}

export default connectDB