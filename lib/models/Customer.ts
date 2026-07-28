import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICustomer extends Document {
  businessId: mongoose.Types.ObjectId;
  name: string;
  contact: string;
  notes: string;
  createdAt: Date;
}

const CustomerSchema = new Schema<ICustomer>({
  businessId: { type: Schema.Types.ObjectId, ref: "Business", required: true },
  name: { type: String, required: true },
  contact: { type: String, default: "" },
  notes: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

export const Customer: Model<ICustomer> = mongoose.models.Customer || mongoose.model("Customer", CustomerSchema);
