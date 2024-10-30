import { resend } from "@/lib/resend";
import EmailTemplate from "@/components/email-template";

import { ApiResponse } from "@/types/types";

export default async function sendVerificationEmail(email: string, username: string, verifyCode: string): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Verification Code",
      react: EmailTemplate({ username, otp: verifyCode })
    })
    return { success: true, message: "Email Sent Successfully" }
  } catch (error) {
    console.log('Error sending verification email', error);
    return { success: false, message: "Failed to send verification email" }
  }
}