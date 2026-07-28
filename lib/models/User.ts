import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  pinHash: string;
  emailVerified: boolean;
  role: "user" | "admin";
  blocked: boolean;
  blockedAt?: Date;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  pinHash: { type: String, required: true },
  emailVerified: { type: Boolean, default: false },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  blocked: { type: Boolean, default: false },
  blockedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

export const User: Model<IUser> = mongoose.models.User || mongoose.model("User", UserSchema);
