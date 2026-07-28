import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { verifyOTP } from "@/lib/otp";

export async function POST(req: NextRequest) {
  try {
    const { email, code, purpose } = await req.json();
    if (!email || !code) {
      return NextResponse.json({ error: "Email and code are required" }, { status: 400 });
    }

    const result = await verifyOTP(email.toLowerCase(), code, purpose || "signup");
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    if (purpose === "signup") {
      await connectDB();
      await User.updateOne({ email: email.toLowerCase() }, { emailVerified: true });
    }

    return NextResponse.json({ message: "OTP verified successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
