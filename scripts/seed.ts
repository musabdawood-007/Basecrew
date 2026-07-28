import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://musabprojectsotpservice_db_user:McTnI4toUH4oGhVE@ac-leyndx5-shard-00-00.lwjdmwk.mongodb.net:27017,ac-leyndx5-shard-00-01.lwjdmwk.mongodb.net:27017,ac-leyndx5-shard-00-02.lwjdmwk.mongodb.net:27017/?ssl=true&replicaSet=atlas-zdai86-shard-0&authSource=admin&appName=BASECREWDATA&compressors=zlib";

const UserSchema = new mongoose.Schema({
  name: String, email: { type: String, unique: true, lowercase: true }, pinHash: String, createdAt: { type: Date, default: Date.now },
});
const BusinessSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, name: String, category: String, description: { type: String, default: "" }, currency: { type: String, default: "PKR" }, createdAt: { type: Date, default: Date.now },
});
const ProductSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: "Business" }, name: String, category: String, price: Number, stockQuantity: { type: Number, default: null }, sku: { type: String, default: null }, isService: { type: Boolean, default: true }, createdAt: { type: Date, default: Date.now },
});
const CustomerSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: "Business" }, name: String, contact: { type: String, default: "" }, notes: { type: String, default: "" }, createdAt: { type: Date, default: Date.now },
});
const OrderSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: "Business" }, customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" }, items: [{ productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, quantity: Number, priceAtSale: Number }], totalAmount: Number, status: { type: String, enum: ["pending", "completed", "cancelled"] }, createdAt: { type: Date, default: Date.now },
});
const ExpenseSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: "Business" }, category: String, amount: Number, note: { type: String, default: "" }, date: String, createdAt: { type: Date, default: Date.now },
});

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  const User = mongoose.models.User || mongoose.model("User", UserSchema);
  const Business = mongoose.models.Business || mongoose.model("Business", BusinessSchema);
  const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
  const Customer = mongoose.models.Customer || mongoose.model("Customer", CustomerSchema);
  const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);
  const Expense = mongoose.models.Expense || mongoose.model("Expense", ExpenseSchema);

  await User.deleteMany({});
  await Business.deleteMany({});
  await Product.deleteMany({});
  await Customer.deleteMany({});
  await Order.deleteMany({});
  await Expense.deleteMany({});

  console.log("Cleared existing data");

  const pinHash = await bcrypt.hash("123456", 12);
  const user = await User.create({ name: "Musab Dawood", email: "demo@musab.com", pinHash });
  console.log("Created user: demo@musab.com / 123456");

  const business = await Business.create({
    ownerId: user._id, name: "Musab's Software House", category: "Software House", description: "Custom web & mobile app development, UI/UX design, and maintenance retainers.", currency: "PKR",
  });
  const biz2 = await Business.create({
    ownerId: user._id, name: "Dawood Digital Agency", category: "Marketing Agency", description: "SEO, social media management, and paid ads for SMEs.", currency: "PKR",
  });
  console.log("Created 2 businesses");

  const prods = await Product.insertMany([
    { businessId: business._id, name: "Web App Development", category: "Development", price: 450000, sku: "WEB-APP-001", isService: true },
    { businessId: business._id, name: "UI/UX Design Package", category: "Design", price: 180000, sku: "DESIGN-001", isService: true },
    { businessId: business._id, name: "Monthly Maintenance Retainer", category: "Maintenance", price: 50000, sku: "MAINT-001", isService: true },
    { businessId: business._id, name: "API Integration Service", category: "Development", price: 120000, sku: "API-INT-001", isService: true },
    { businessId: business._id, name: "Consulting Hour", category: "Consulting", price: 15000, sku: "CONSULT-001", isService: true },
    { businessId: biz2._id, name: "SEO Audit", category: "SEO", price: 75000, sku: "SEO-AUDIT", isService: true },
    { businessId: biz2._id, name: "Social Media Management", category: "Social Media", price: 60000, sku: "SMM-MONTH", isService: true },
  ]);
  console.log("Created 7 products");

  const custs = await Customer.insertMany([
    { businessId: business._id, name: "Ahmed Khan", contact: "ahmed@techcorp.pk | +92 300 1234567", notes: "CEO of TechCorp" },
    { businessId: business._id, name: "Sara Ali", contact: "sara@startup.io | +92 321 9876543", notes: "Founder of Startup.io" },
    { businessId: business._id, name: "Bilal Malik", contact: "bilal@enterprise.pk | +92 333 5555555", notes: "CTO of Enterprise Solutions" },
    { businessId: business._id, name: "Fatima Noor", contact: "fatima@designstudio.pk | +92 311 4444444", notes: "Creative Director" },
    { businessId: business._id, name: "Omar Raza", contact: "omar@fintech.pk | +92 345 6666666", notes: "FinTech startup founder" },
  ]);
  console.log("Created 5 customers");

  const now = new Date();
  const d = (daysAgo: number) => { const date = new Date(now); date.setDate(date.getDate() - daysAgo); return date.toISOString(); };

  await Order.insertMany([
    { businessId: business._id, customerId: custs[0]._id, items: [{ productId: prods[0]._id, quantity: 1, priceAtSale: 450000 }], totalAmount: 450000, status: "completed", createdAt: d(0) },
    { businessId: business._id, customerId: custs[1]._id, items: [{ productId: prods[1]._id, quantity: 1, priceAtSale: 180000 }], totalAmount: 180000, status: "pending", createdAt: d(1) },
    { businessId: business._id, customerId: custs[2]._id, items: [{ productId: prods[0]._id, quantity: 1, priceAtSale: 450000 }, { productId: prods[2]._id, quantity: 3, priceAtSale: 50000 }], totalAmount: 600000, status: "completed", createdAt: d(2) },
    { businessId: business._id, customerId: custs[3]._id, items: [{ productId: prods[3]._id, quantity: 1, priceAtSale: 120000 }], totalAmount: 120000, status: "cancelled", createdAt: d(3) },
    { businessId: business._id, customerId: custs[4]._id, items: [{ productId: prods[0]._id, quantity: 1, priceAtSale: 450000 }, { productId: prods[1]._id, quantity: 1, priceAtSale: 180000 }], totalAmount: 630000, status: "completed", createdAt: d(5) },
    { businessId: business._id, customerId: custs[0]._id, items: [{ productId: prods[4]._id, quantity: 10, priceAtSale: 15000 }], totalAmount: 150000, status: "completed", createdAt: d(7) },
    { businessId: business._id, customerId: custs[1]._id, items: [{ productId: prods[2]._id, quantity: 6, priceAtSale: 50000 }], totalAmount: 300000, status: "completed", createdAt: d(10) },
    { businessId: business._id, customerId: custs[2]._id, items: [{ productId: prods[1]._id, quantity: 2, priceAtSale: 180000 }], totalAmount: 360000, status: "completed", createdAt: d(14) },
  ]);
  console.log("Created 8 orders");

  await Expense.insertMany([
    { businessId: business._id, category: "Salaries", amount: 350000, note: "Team salaries for July", date: "2026-07-01" },
    { businessId: business._id, category: "Software", amount: 85000, note: "Cloud hosting + subscriptions", date: "2026-07-05" },
    { businessId: business._id, category: "Marketing", amount: 120000, note: "LinkedIn ads campaign", date: "2026-07-10" },
    { businessId: business._id, category: "Office", amount: 65000, note: "Co-working space rent", date: "2026-07-12" },
    { businessId: business._id, category: "Misc", amount: 42000, note: "Team lunch + coffee", date: "2026-07-15" },
    { businessId: business._id, category: "Salaries", amount: 350000, note: "Team salaries for June", date: "2026-06-01" },
    { businessId: business._id, category: "Software", amount: 78000, note: "AWS + Vercel + GitHub", date: "2026-06-05" },
    { businessId: business._id, category: "Marketing", amount: 95000, note: "Google Ads", date: "2026-06-10" },
  ]);
  console.log("Created 8 expenses");

  console.log("\nSeed complete!");
  console.log("Demo account: demo@musab.com / 123456");
  await mongoose.disconnect();
}

seed().catch(console.error);