import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { sendVerificationOTP } from "@/lib/otp";

export async function POST(req: NextRequest) {
  try {
    const { email, purpose } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    if (purpose !== "signup" && purpose !== "reset") {
      return NextResponse.json({ error: "Invalid purpose" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase() });

    if (purpose === "signup" && user?.emailVerified) {
      return NextResponse.json({ error: "Email already verified" }, { status: 400 });
    }
    if (purpose === "reset" && !user) {
      return NextResponse.json({ error: "No account found with this email" }, { status: 404 });
    }

    await sendVerificationOTP(email.toLowerCase(), purpose);

    return NextResponse.json({ message: "OTP sent to your email" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
