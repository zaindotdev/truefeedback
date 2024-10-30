import connectDB from "@/lib/dbConnect";
import sendVerificationEmail from "@/helpers/sendEmail";
import UserModel from "@/model/User";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  connectDB();
  try {
    const { username, email, password } = await req.json();
    const existingUser = await UserModel.findOne({ email });
    let newUser;

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    if (existingUser) {
      if (existingUser.isVerified) {
        return Response.json({
          success: false,
          message: "User already existed with this email",
          data: existingUser
        }, { status: 400 });
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUser.password = hashedPassword;
        existingUser.verifyCode = verifyCode;
        existingUser.verifyCodeExpiry = new Date(Date.now() + 3600000); // 1 hour
        await existingUser.save();
      }
    }
    else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        messages: [],
        isVerified: false,
        isAcceptingMessage: true,
      });
      await newUser.save();
    }

    // Send verification email;
    const emailResponse = await sendVerificationEmail(username, email, verifyCode);
    console.log({ response: emailResponse.data })

    // Return the newly created or updated user data
    return Response.json({
      success: true,
      message: "User registered successfully. Please verify the account.",
      data: newUser || existingUser  // Return the user data
    }, { status: 200 });

  } catch (error) {
    console.error("Error registering user", error);
    return Response.json({
      success: false,
      message: "Failed to register user"
    }, { status: 500 });
  }
}
