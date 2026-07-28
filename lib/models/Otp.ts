import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOtp extends Document {
  email: string;
  codeHash: string;
  purpose: "signup" | "reset";
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
}

const OtpSchema = new Schema<IOtp>({
  email: { type: String, required: true, lowercase: true, trim: true },
  codeHash: { type: String, required: true },
  purpose: { type: String, enum: ["signup", "reset"], required: true },
  expiresAt: { type: Date, required: true },
  used: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

OtpSchema.index({ email: 1, purpose: 1 });

export const Otp: Model<IOtp> = mongoose.models.Otp || mongoose.model("Otp", OtpSchema);
