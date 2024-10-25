import connectDB from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { usernameValidation } from "@/schemas/signUpSchema";
import { z } from "zod";

const userVerification = z.object({
  username: usernameValidation
})
export async function GET(request: Request) {
  connectDB();
  try {
    const { searchParams } = new URL(request.url);
    const query = {
      username: searchParams.get("username")
    };
    console.warn(query)
    const result = userVerification.parse(query);
    if (!result.username) {
      return Response.json({ success: false, message: "Username is required" }, {
        status: 400,
      });
    }

    const { username } = result;
    const existingUser = await UserModel.findOne({ username, isVerified: true });
    if (existingUser) {
      return Response.json({ success: false, message: "Username already exists" }, {
        status: 400,
      });
    }

    return Response.json({ success: true, message: "Valid Username" }, { status: 200 })

  } catch (error) {
    console.error("Error", error);
    if (error instanceof Error) {
      return Response.json({ success: false, message: error.message }, {
        status: 500,
      });
    }
  }

}