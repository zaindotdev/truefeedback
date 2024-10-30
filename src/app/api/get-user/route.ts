import connectDB from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  await connectDB();
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    const user = await UserModel.findOne({ email });
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, user }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message)
    }
  }
}