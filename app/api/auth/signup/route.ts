import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { Business } from "@/lib/models/Business";
import { sendVerificationOTP } from "@/lib/otp";

export async function POST(req: NextRequest) {
  try {
    const { name, email, pin } = await req.json();
    if (!name || !email || !pin) {
      return NextResponse.json({ error: "Name, email, and PIN are required" }, { status: 400 });
    }
    if (pin.length !== 6 || !/^\d+$/.test(pin)) {
      return NextResponse.json({ error: "PIN must be 6 digits" }, { status: 400 });
    }
    await connectDB();
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }
    const pinHash = await bcrypt.hash(pin, 12);
    const user = await User.create({ name, email: email.toLowerCase(), pinHash, emailVerified: false });
    await Business.create({
      ownerId: user._id,
      name: `${name}'s Business`,
      category: "General",
      description: "",
      currency: "PKR",
    });

    let otpSent = false;
    try {
      await sendVerificationOTP(email.toLowerCase(), "signup");
      otpSent = true;
    } catch (emailErr) {
      console.error("OTP email failed, auto-verifying user:", emailErr);
      user.emailVerified = true;
      await user.save();
    }

    return NextResponse.json({ message: "Account created.", userId: user._id, otpSent, emailVerified: user.emailVerified }, { status: 201 });
  } catch (err: any) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
