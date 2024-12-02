import { resend } from "@/lib/resend";
import verificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    otp: string
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Mystry messgae | Verification code',
            react: verificationEmail({username,otp}),
        });
        return {
            success: true,
            message: "Verification email sent successfully",
        };
    } catch (error) {
        console.error("Error sending verification email:", error);
        return {
            success: false,
            message: "Error sending verification email",
        };
    }
}