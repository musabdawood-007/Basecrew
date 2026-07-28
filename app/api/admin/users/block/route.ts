import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { userId, blocked } = await req.json();
  if (!userId || typeof blocked !== "boolean") {
    return NextResponse.json({ error: "userId and blocked required" }, { status: 400 });
  }

  await connectDB();
  const user = await User.findById(userId);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  if (user.role === "admin") return NextResponse.json({ error: "Cannot block admin" }, { status: 400 });

  user.blocked = blocked;
  user.blockedAt = blocked ? new Date() : undefined;
  await user.save();

  return NextResponse.json({ message: blocked ? "User blocked" : "User unblocked", user: { id: user._id, name: user.name, email: user.email, blocked: user.blocked } });
}
