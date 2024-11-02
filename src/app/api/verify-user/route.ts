import connectDB from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(req: Request) {
  connectDB();
  try {
    const { username, code } = await req.json();
    const decodedUsername = decodeURIComponent(username)
    const user = await UserModel.findOne({ username: decodedUsername });
    console.log(user)
    if (!user) {
      return Response.json({ success: false, message: "User not found" }, {
        status: 404,
      });
    }
    if (user.isVerified) {
      return Response.json({ success: false, message: "User already verified" }, {
        status: 400,
      });
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();
      return Response.json({ success: true, message: "User verified successfully" }, {
        status: 200,
      })
    } else if (!isCodeValid) {
      return Response.json({ success: false, message: "Invalid code" }, {
        status: 400,
      });
    } else {
      return Response.json({ success: false, message: "Code expired" }, {
        status: 400,
      })
    }
  } catch (error) {
    console.error("Error ", error);
    if (error instanceof Error) {
      return Response.json({ success: false, message: error.message }, {
        status: 500,
      })
    }
  }
}