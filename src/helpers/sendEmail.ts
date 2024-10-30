import { ApiResponse } from "@/types/types";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SEND_GRID_API_KEY as string);

const sendEmail = async (username: string, email: string, otp: string): Promise<ApiResponse> => {
  try {
    const msg = {
      to: email,
      from: "zaindeveloperr@gmail.com",
      subject: "Verify your email",
      html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="https://your-logo-url.com/logo.png" alt="True Feedback Logo" style="width: 100px; height: auto;">
            </div>
            <div style="background-color: #ffffff; padding: 20px; border-radius: 8px;">
              <h2 style="color: #333333;">Hello, ${username}!</h2>
              <p style="font-size: 16px; color: #333333;">Thank you for logging in to <strong>True Feedback</strong>.</p>
              <p style="font-size: 16px; color: #333333;">Your verification code is:</p>
              <div style="text-align: center; margin: 20px 0;">
                <span style="display: inline-block; padding: 10px 20px; background-color: #000;  color: #ffffff; font-size: 24px; font-weight: bold; border-radius: 5px;">${otp}</span>
              </div>
              <p style="font-size: 16px; color: #333333;">Please enter this code to complete your login.</p>
            </div>
            <div style="margin-top: 20px; text-align: center; font-size: 14px; color: #888888;">
              <p>If you did not request this code, please ignore this email.</p>
              <p>Best regards,<br><strong>The True Feedback Team</strong></p>
            </div>
          </div>
          `
    }

    const response = await sgMail.send(msg);
    return {
      data: response as any,
      message: "Email sent successfully",
      success: true,
    }
  } catch (error) {
    console.error(error);
    return {
      data: error as any,
      message: "Error sending email",
      success: false,
    }
  }
}

export default sendEmail;