import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../create-context";
import sgMail from "@sendgrid/mail";

const resetCodes = new Map<string, { code: string; expiresAt: number }>();

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export const authRouter = createTRPCRouter({
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
      })
    )
    .mutation(async ({ input }) => {
      console.log("Login attempt:", input.email);

      const userId = `user_${Date.now()}`;
      const token = `token_${Date.now()}`;

      return {
        success: true,
        token,
        user: {
          id: userId,
          email: input.email,
          name: input.email.split("@")[0],
        },
      };
    }),

  signup: publicProcedure
    .input(
      z.object({
        name: z.string().min(2),
        email: z.string().email(),
        password: z.string().min(6),
      })
    )
    .mutation(async ({ input }) => {
      console.log("Signup attempt:", input.email);

      const userId = `user_${Date.now()}`;
      const token = `token_${Date.now()}`;

      return {
        success: true,
        token,
        user: {
          id: userId,
          email: input.email,
          name: input.name,
        },
      };
    }),

  changePassword: publicProcedure
    .input(
      z.object({
        currentPassword: z.string().min(6),
        newPassword: z.string().min(6),
      })
    )
    .mutation(async ({ input }) => {
      console.log("Password change attempt");

      if (input.currentPassword === input.newPassword) {
        throw new Error("New password must be different from current password");
      }

      return {
        success: true,
        message: "Password changed successfully",
      };
    }),

  sendResetCode: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
      })
    )
    .mutation(async ({ input }) => {
      console.log("Reset code request for:", input.email);

      const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = Date.now() + 15 * 60 * 1000;
      
      resetCodes.set(input.email, { code: resetCode, expiresAt });
      
      console.log("=== PASSWORD RESET CODE ===");
      console.log(`Email: ${input.email}`);
      console.log(`Code: ${resetCode}`);
      console.log("===========================");

      if (process.env.SENDGRID_API_KEY) {
        try {
          await sgMail.send({
            to: input.email,
            from: process.env.SENDGRID_FROM_EMAIL || "noreply@yourdomain.com",
            subject: "Your Password Reset Code - Yuguyu",
            text: `Your password reset code is: ${resetCode}\n\nThis code will expire in 15 minutes.\n\nIf you didn't request this code, please ignore this email.`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Password Reset Request</h2>
                <p>You requested to reset your password for your Yuguyu account.</p>
                <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                  <h1 style="color: #FF6B35; margin: 0; font-size: 36px; letter-spacing: 4px;">${resetCode}</h1>
                </div>
                <p>Enter this code in the app to reset your password.</p>
                <p style="color: #666; font-size: 14px;">This code will expire in 15 minutes.</p>
                <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
                <p style="color: #999; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
              </div>
            `,
          });
          console.log("Email sent successfully via SendGrid");
        } catch (error) {
          console.error("SendGrid error:", error);
          throw new Error("Failed to send reset code email. Please try again.");
        }
      }

      return {
        success: true,
        message: "Reset code sent to your email",
      };
    }),

  resetPassword: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        code: z.string().length(6),
        newPassword: z.string().min(6),
      })
    )
    .mutation(async ({ input }) => {
      console.log("Password reset attempt for:", input.email);

      const storedData = resetCodes.get(input.email);
      
      if (!storedData) {
        throw new Error("Invalid or expired reset code");
      }

      if (Date.now() > storedData.expiresAt) {
        resetCodes.delete(input.email);
        throw new Error("Reset code has expired. Please request a new one.");
      }

      if (storedData.code !== input.code) {
        throw new Error("Invalid reset code");
      }

      resetCodes.delete(input.email);

      return {
        success: true,
        message: "Password reset successfully",
      };
    }),
});
