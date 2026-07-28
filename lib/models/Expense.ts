import mongoose, { Schema, Document, Model } from "mongoose";

export interface IExpense extends Document {
  businessId: mongoose.Types.ObjectId;
  category: string;
  amount: number;
  note: string;
  date: string;
  createdAt: Date;
}

const ExpenseSchema = new Schema<IExpense>({
  businessId: { type: Schema.Types.ObjectId, ref: "Business", required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  note: { type: String, default: "" },
  date: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Expense: Model<IExpense> = mongoose.models.Expense || mongoose.model("Expense", ExpenseSchema);
