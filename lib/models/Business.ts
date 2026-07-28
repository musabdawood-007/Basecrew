import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBusiness extends Document {
  ownerId: mongoose.Types.ObjectId;
  name: string;
  category: string;
  description: string;
  currency: string;
  createdAt: Date;
}

const BusinessSchema = new Schema<IBusiness>({
  ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, default: "" },
  currency: { type: String, default: "PKR" },
  createdAt: { type: Date, default: Date.now },
});

export const Business: Model<IBusiness> = mongoose.models.Business || mongoose.model("Business", BusinessSchema);
