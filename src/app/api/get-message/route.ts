import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import connectDB from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function GET() {
  await connectDB();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !user) {
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const userEmail = user.email;
  try {
    const userMessages = await UserModel.aggregate([
      {
        $match: {
          email: userEmail // Corrected field name
        }
      },
      {
        $unwind: "$messages"
      },
      {
        $sort: {
          "messages.createdAt": -1 // Corrected field path for sorting
        }
      },
      {
        $group: {
          _id: "$_id",
          messages: { $push: "$messages" } // Corrected array field to push only the unwound messages
        }
      }
    ]);

    if (!userMessages || userMessages.length === 0) {
      return Response.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return Response.json({ success: true, messages: userMessages[0].messages }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
