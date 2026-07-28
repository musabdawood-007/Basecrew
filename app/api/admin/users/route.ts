import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { Business } from "@/lib/models/Business";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  await connectDB();
  const users = await User.find({}, { pinHash: 0 }).sort({ createdAt: -1 }).lean();
  const businesses = await Business.find({}).sort({ createdAt: -1 }).lean();

  const usersWithBiz = users.map((u: any) => ({
    ...u,
    businesses: businesses.filter((b: any) => b.ownerId?.toString() === u._id.toString()),
  }));

  return NextResponse.json({ users: usersWithBiz, total: users.length });
}
