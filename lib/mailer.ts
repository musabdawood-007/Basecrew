import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_APP_PASSWORD,
  },
});

export async function sendOTP(to: string, code: string, purpose: "signup" | "reset") {
  const subject = purpose === "signup" ? "Verify your Basecrew account" : "Reset your Basecrew PIN";
  const action = purpose === "signup" ? "verify your email" : "reset your PIN";

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
      <div style="max-width:480px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
        <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:32px;text-align:center;">
          <h1 style="color:#fff;font-size:24px;margin:0;">Basecrew</h1>
        </div>
        <div style="padding:32px;">
          <h2 style="color:#1e293b;font-size:18px;margin:0 0 8px;">Your verification code</h2>
          <p style="color:#64748b;font-size:14px;margin:0 0 24px;">Use this code to ${action}. It expires in 5 minutes.</p>
          <div style="background:#f1f5f9;border-radius:12px;padding:20px;text-align:center;margin-bottom:24px;">
            <span style="font-size:32px;font-weight:700;color:#6366f1;letter-spacing:8px;font-family:monospace;">${code}</span>
          </div>
          <p style="color:#94a3b8;font-size:12px;text-align:center;">If you didn't request this, you can safely ignore this email.</p>
        </div>
        <div style="padding:16px 32px;background:#f8fafc;text-align:center;">
          <p style="color:#94a3b8;font-size:11px;margin:0;">Basecrew Business Management Platform</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await transport.sendMail({
    from: `"Basecrew" <${process.env.SMTP_EMAIL}>`,
    to,
    subject,
    html,
  });
}
