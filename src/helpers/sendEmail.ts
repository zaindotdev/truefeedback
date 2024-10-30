import { resend } from "@/lib/resend";
import EmailTemplate from "@/components/email-template";

import { ApiResponse } from "@/types/types";
import { CreateEmailResponse } from "resend";

export default async function sendVerificationEmail(email: string, username: string, verifyCode: string): Promise<ApiResponse> {
  try {
    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Verification Code",
      react: EmailTemplate({ username, otp: verifyCode })
    });

    return {
      success: true,
      message: "Email Sent Successfully",
      data: response as any,
      isAcceptingMessage: true,
      messages: [] // Assuming you have a `Message` type defined
    };
  } catch (error) {
    console.log('Error sending verification email', error);
    return {
      success: false,
      message: "Failed to send verification email",
      data: error as any,
      isAcceptingMessage: false,
      messages: [] // Assuming you have a `Message` type defined
    };
  }
}