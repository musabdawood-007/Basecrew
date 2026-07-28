import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Business } from "@/lib/models/Business";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await connectDB();
    const businesses = await Business.find({ ownerId: (session.user as any).id });
    return NextResponse.json(businesses);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { name, category, description, currency } = await req.json();
    if (!name || !category) {
      return NextResponse.json({ error: "Name and category are required" }, { status: 400 });
    }
    await connectDB();
    const business = await Business.create({
      ownerId: (session.user as any).id,
      name,
      category,
      description: description || "",
      currency: currency || "PKR",
    });
    return NextResponse.json(business, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
