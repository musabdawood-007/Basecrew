import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";

export async function POST(req: NextRequest) {
  try {
    const { email, newPin } = await req.json();
    if (!email || !newPin) {
      return NextResponse.json({ error: "Email and new PIN are required" }, { status: 400 });
    }
    if (newPin.length !== 6 || !/^\d+$/.test(newPin)) {
      return NextResponse.json({ error: "PIN must be 6 digits" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    user.pinHash = await bcrypt.hash(newPin, 12);
    await user.save();

    return NextResponse.json({ message: "PIN reset successfully. You can now sign in." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
