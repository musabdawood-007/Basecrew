import { NextResponse } from "next/server";

export async function GET() {
  const info: Record<string, any> = {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "NOT SET",
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "SET (hidden)" : "NOT SET",
    MONGODB_URI: process.env.MONGODB_URI ? "SET (hidden)" : "NOT SET",
    SMTP_HOST: process.env.SMTP_HOST || "NOT SET",
    SMTP_EMAIL: process.env.SMTP_EMAIL || "NOT SET",
  };

  try {
    const { connectDB } = await import("@/lib/mongodb");
    await connectDB();
    info.mongo = "CONNECTED OK";
  } catch (e: any) {
    info.mongo = "FAILED: " + e.message;
  }

  return NextResponse.json(info);
}
