import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import connectDB from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(req: Request) {
  await connectDB();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session && !user) {
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }


  const userId = user._id;
  const { isAcceptingMessage } = await req.json();
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(userId, { isAcceptingMessage }, { new: true });

    if (!updatedUser) {
      return Response.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return Response.json({ success: true, message: "User status updated successfully" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: "Failed to update user status to accept messages" }, { status: 500 });
  }
}

export async function GET() {
  await connectDB();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session && !user) {
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }


  const userId = user._id;
  try {
    const foundUser = await UserModel.findById(userId);
    if (!foundUser) {
      return Response.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return Response.json({ success: true, isAcceptingMessage: foundUser.isAcceptingMessage }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: "Failed to get user status" }, { status: 500 });
  }
}