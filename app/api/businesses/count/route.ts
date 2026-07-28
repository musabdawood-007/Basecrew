import { NextResponse } from "next/server";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

let cached = { conn: null as typeof mongoose | null, count: 0, ts: 0 };

export async function GET() {
  const now = Date.now();
  if (cached.conn && now - cached.ts < 60000) {
    return NextResponse.json({ count: cached.count });
  }

  if (!cached.conn) {
    cached.conn = await mongoose.connect(MONGODB_URI);
  }

  const count = await cached.conn.connection.db!.collection("businesses").countDocuments();
  cached.count = count;
  cached.ts = now;

  return NextResponse.json({ count });
}
