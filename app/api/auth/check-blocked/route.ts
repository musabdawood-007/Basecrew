import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ blocked: false });

  await connectDB();
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return NextResponse.json({ blocked: false });

  return NextResponse.json({ blocked: user.blocked, name: user.name });
}
