import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { Otp } from "@/lib/models/Otp";
import { sendOTP } from "@/lib/mailer";

const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendVerificationOTP(email: string, purpose: "signup" | "reset") {
  const code = generateCode();
  const codeHash = await bcrypt.hash(code, 10);

  await connectDB();

  // Invalidate any existing OTPs for this email+purpose
  await Otp.updateMany({ email, purpose, used: false }, { used: true });

  await Otp.create({
    email,
    codeHash,
    purpose,
    expiresAt: new Date(Date.now() + OTP_EXPIRY_MS),
    used: false,
  });

  await sendOTP(email, code, purpose);

  return { success: true };
}

export async function verifyOTP(email: string, code: string, purpose: "signup" | "reset") {
  await connectDB();

  const record = await Otp.findOne({
    email,
    purpose,
    used: false,
    expiresAt: { $gt: new Date() },
  }).sort({ createdAt: -1 });

  if (!record) {
    return { success: false, error: "No valid OTP found. Request a new one." };
  }

  const valid = await bcrypt.compare(code, record.codeHash);
  if (!valid) {
    return { success: false, error: "Invalid code. Try again." };
  }

  record.used = true;
  await record.save();

  return { success: true };
}
