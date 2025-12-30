import { betterAuth } from "better-auth";
import { prisma } from "./prisma";
import { prismaAdapter } from "better-auth/adapters/prisma";
import nodemailer from "nodemailer";

//* import from nodemailer docs
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // Replace with your SMTP server
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.APP_USER,
    pass: process.env.App_PASS,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  //* Add your trusted origins here for frontend-backend communication
  trustedOrigins: [process.env.APP_URL || "http://localhost:4000"],

  //* customize the user model by adding additional fields
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
    },
  },
  //* Enable email and password authentication
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },

  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url, token }) => {
      // Implement your email sending logic here
      console.log(
        `Send verification email to ${user.email} with URL: ${url} and token: ${token}`
      );
      const info = await transporter.sendMail({
        from: '"Blogs App" <blogapp@gmail.com>', // sender address
        to: "shanto737373@gmail.com",
        subject: "Hello ✔",
        text: "Hello world?", // Plain-text version of the message
        html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Verify Your Email</title>
</head>

<body style="margin:0; padding:0; background-color:#f1f3f4; font-family:Arial, Helvetica, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 0;">
    <tr>
      <td align="center">

        <!-- Email Container -->
        <table width="600" cellpadding="0" cellspacing="0"
          style="background:#ffffff; border-radius:8px; box-shadow:0 1px 3px rgba(0,0,0,0.12);">

          <!-- Header -->
          <tr>
            <td style="padding:20px 30px; border-bottom:1px solid #e0e0e0;">
              <h2 style="margin:0; color:#202124; font-size:22px;">
                Blogs App
              </h2>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:30px;">
              <p style="margin:0 0 16px; font-size:15px; color:#202124;">
                Hello {{USER_NAME}},
              </p>

              <p style="margin:0 0 16px; font-size:14px; color:#5f6368; line-height:1.6;">
                Blogs App-এ সাইনআপ করার জন্য ধন্যবাদ।  
                আপনার ইমেইল ঠিকানা নিশ্চিত করতে নিচের বাটনে ক্লিক করুন।
              </p>

              <!-- Button -->
              <div style="margin:24px 0;">
                <a href="{{VERIFY_LINK}}"
                   style="display:inline-block; background:#1a73e8; color:#ffffff;
                          text-decoration:none; padding:10px 26px;
                          border-radius:4px; font-size:14px;">
                  Verify Email Address
                </a>
              </div>

              <p style="margin:0 0 10px; font-size:13px; color:#5f6368;">
                যদি বাটন কাজ না করে, নিচের লিংকটি কপি করে ব্রাউজারে পেস্ট করুন:
              </p>

              <p style="margin:0; font-size:12px; color:#1a73e8; word-break:break-all;">
                {{VERIFY_LINK}}
              </p>

              <p style="margin:24px 0 0; font-size:13px; color:#5f6368;">
                আপনি যদি এই অ্যাকাউন্ট তৈরি না করে থাকেন, তাহলে এই ইমেইলটি উপেক্ষা করুন।
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="border-top:1px solid #e0e0e0;"></td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 30px;">
              <p style="margin:0; font-size:12px; color:#80868b;">
                © 2025 Blogs App • All rights reserved
              </p>
              <p style="margin:6px 0 0; font-size:12px; color:#80868b;">
                This is an automated email. Please do not reply.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
        </html>`,
      });
      console.log("Message sent:", info.messageId);
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },

    /*import { createAuthClient } from "better-auth/client";
const authClient = createAuthClient();

const signIn = async () => {
  const data = await authClient.signIn.social({
    provider: "google",
  });
}; */
  },
});
