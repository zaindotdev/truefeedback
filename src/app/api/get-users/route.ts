import connectDB from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  await connectDB();
  try {
    const users = await UserModel.find({});
    return NextResponse.json({ success: true, users }, {
      status: 200,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, message: error.message }, {
        status: 500,
      });
    }

  }

}