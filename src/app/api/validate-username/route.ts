import { NextResponse } from 'next/server';
import connectDB from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { usernameValidation } from "@/schemas/signUpSchema";
import { z } from "zod";

const userVerification = z.object({
  username: usernameValidation
})

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    const result = userVerification.parse({ username });
    if (!result.username) {
      return NextResponse.json({ success: false, message: "Username is required" }, {
        status: 400,
      });
    }

    const existingUser = await UserModel.findOne({ username, isVerified: true });
    if (existingUser) {
      return NextResponse.json({ success: false, message: "Username already exists" }, {
        status: 400,
      });
    }

    return NextResponse.json({ success: true, message: "Valid Username" }, { status: 200 })
  } catch (error) {
    console.error("Error", error);
    if (error instanceof Error) {
      return NextResponse.json({ success: false, message: error.message }, {
        status: 500,
      });
    }
  }
}