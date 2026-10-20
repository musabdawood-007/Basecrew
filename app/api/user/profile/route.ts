import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await connectDB();
    const user = await User.findById((session.user as any).id).select("name email role emailVerified createdAt");
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json({
      name: user.name,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { name } = await req.json();
    const trimmed = (name || "").trim();
    if (!trimmed) return NextResponse.json({ error: "Name is required" }, { status: 400 });
    if (trimmed.length > 60) return NextResponse.json({ error: "Name must be 60 characters or less" }, { status: 400 });
    await connectDB();
    const user = await User.findById((session.user as any).id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    user.name = trimmed;
    await user.save();
    return NextResponse.json({ message: "Profile updated", name: user.name });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
