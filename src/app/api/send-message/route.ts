import UserModel from "@/model/User";
import { Message } from "@/model/User";
import connectDB from "@/lib/dbConnect";

export async function POST(req: Request) {
  await connectDB();

  try {
    const { username, content,category } = await req.json();
    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // is user accepting messages

    if (!user.isAcceptingMessage) {
      return Response.json({ success: false, message: "User is not accepting messages" }, { status: 400 });
    }

    const newMessage = { content,category, createdAt: new Date() }

    user.messages.push(newMessage as Message);


    await user.save();
    return Response.json({ success: true, message: "Message sent successfully" }, { status: 200 });
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      return Response.json({ success: false, message: error.message }, { status: 500 });
    }
  }
} 