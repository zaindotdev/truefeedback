import mongoose, { Schema, Document } from "mongoose";

// Extend the Document interface to create a User interface for your user model
export interface User extends Document {
  _id: string; // Required by NextAuth
  username: string;
  email: string;
  password: string;
  isVerified: boolean;
  isAcceptingMessages: boolean;
  // You can include any other properties you need
}

// Create a schema that matches the interface
const UserSchema: Schema<User> = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please use a valid email",
      ],
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false, // Default to false until verified
    },
    isAcceptingMessages: {
      type: Boolean,
      default: true, // Default to true
    },
    // You can include any additional fields here
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Ensure the model is exported correctly
const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;
