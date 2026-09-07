import nodemailer from "nodemailer";
import { env } from "../config/env";

function buildTransport() {
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) return null;

  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE ?? env.SMTP_PORT === 465,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS
    }
  });
}

export async function sendPasswordResetEmail(input: {
  to: string;
  name: string;
  resetUrl: string;
  expiresMinutes: number;
}) {
  const transporter = buildTransport();

  if (!transporter) {
    if (env.NODE_ENV === "production") {
      throw new Error("SMTP is not configured for password reset emails");
    }

    console.log("\n[DEV PASSWORD RESET LINK]");
    console.log(`Email: ${input.to}`);
    console.log(input.resetUrl);
    console.log("[/DEV PASSWORD RESET LINK]\n");
    return;
  }

  await transporter.sendMail({
    from: env.MAIL_FROM,
    to: input.to,
    subject: "Reset your CampusSpark password",
    text: `Hello ${input.name},\n\nUse this link to reset your CampusSpark password:\n${input.resetUrl}\n\nThis link expires in ${input.expiresMinutes} minutes. If you did not request this, you can ignore this email.`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#172033">
        <h2>Reset your CampusSpark password</h2>
        <p>Hello ${input.name},</p>
        <p>We received a request to reset your password.</p>
        <p style="margin:28px 0">
          <a href="${input.resetUrl}" style="background:#5b5bd6;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;display:inline-block">Reset password</a>
        </p>
        <p>This link expires in <strong>${input.expiresMinutes} minutes</strong>.</p>
        <p>If you did not request a password reset, you can safely ignore this email.</p>
      </div>
    `
  });
}

export async function sendOrganizationCredentialsEmail(input: {
  to: string;
  organizationName: string;
  email: string;
  password: string;
}) {
  const transporter = buildTransport();

  if (!transporter) {
    if (env.NODE_ENV === "production") {
      throw new Error("SMTP is not configured for organization credential emails");
    }
    console.log("\n[DEV ORGANIZATION CREDENTIALS]");
    console.log(`Organization: ${input.organizationName}`);
    console.log(`Email: ${input.email}`);
    console.log(`Password: ${input.password}`);
    console.log("[/DEV ORGANIZATION CREDENTIALS]\n");
    return;
  }

  await transporter.sendMail({
    from: env.MAIL_FROM,
    to: input.to,
    subject: "Your CampusSpark organization account",
    text: `Hello ${input.organizationName},\n\nYour CampusSpark organization account has been created.\n\nLogin email: ${input.email}\nTemporary password: ${input.password}\n\nPlease sign in and use Forgot Password whenever you want to set a new password.`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#172033">
        <h2>Your CampusSpark organization account is ready</h2>
        <p>Hello <strong>${input.organizationName}</strong>,</p>
        <p>An administrator has created your organization account.</p>
        <div style="background:#f5f3ff;border:1px solid #ddd6fe;border-radius:12px;padding:18px;margin:22px 0">
          <p style="margin:0 0 8px"><strong>Login email:</strong> ${input.email}</p>
          <p style="margin:0"><strong>Temporary password:</strong> ${input.password}</p>
        </div>
        <p>You can sign in with these credentials. Later, use <strong>Forgot Password</strong> to set a new password securely.</p>
      </div>
    `
  });
}
