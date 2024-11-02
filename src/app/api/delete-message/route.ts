import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import connectDB from "@/lib/dbConnect";
import UserModel from "@/model/User";
import mongoose from "mongoose";

export async function DELETE(request: Request) {
  await connectDB();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !user) {
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const userEmail = user.email
  const { searchParams } = new URL(request.url);
  const messageId = searchParams.get("messageId") as string;

  try {
    const result = await UserModel.updateOne(
      { email: userEmail },
      { $pull: { messages: { _id: new mongoose.Types.ObjectId(messageId) } } } // Deletes a specific message by ID
    );

    if (result.modifiedCount === 0) {
      return Response.json({ success: false, message: "Message not found or already deleted" }, { status: 404 });
    }

    return Response.json({ success: true, message: "Message deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
