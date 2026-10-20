import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { currentPin, newPin } = await req.json();
    if (!currentPin || !newPin) {
      return NextResponse.json({ error: "Current PIN and new PIN are required" }, { status: 400 });
    }
    if (currentPin.length !== 6 || !/^\d{6}$/.test(currentPin)) {
      return NextResponse.json({ error: "Current PIN must be 6 digits" }, { status: 400 });
    }
    if (newPin.length !== 6 || !/^\d{6}$/.test(newPin)) {
      return NextResponse.json({ error: "New PIN must be 6 digits" }, { status: 400 });
    }
    if (currentPin === newPin) {
      return NextResponse.json({ error: "New PIN must be different from current PIN" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findById((session.user as any).id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const valid = await bcrypt.compare(currentPin, user.pinHash);
    if (!valid) return NextResponse.json({ error: "Current PIN is incorrect" }, { status: 401 });

    user.pinHash = await bcrypt.hash(newPin, 12);
    await user.save();

    return NextResponse.json({ message: "PIN changed successfully" });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
