import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  businessId: mongoose.Types.ObjectId;
  name: string;
  category: string;
  price: number;
  stockQuantity: number | null;
  sku: string | null;
  isService: boolean;
  createdAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  businessId: { type: Schema.Types.ObjectId, ref: "Business", required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  stockQuantity: { type: Number, default: null },
  sku: { type: String, default: null },
  isService: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export const Product: Model<IProduct> = mongoose.models.Product || mongoose.model("Product", ProductSchema);
