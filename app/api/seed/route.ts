import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { Business } from "@/lib/models/Business";
import { Product } from "@/lib/models/Product";
import { Customer } from "@/lib/models/Customer";
import { Order } from "@/lib/models/Order";
import { Expense } from "@/lib/models/Expense";

export async function POST(req: NextRequest) {
  try {
    const { secret } = await req.json();
    if (secret !== "seed-basecrew-2026") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    await User.deleteMany({});
    await Business.deleteMany({});
    await Product.deleteMany({});
    await Customer.deleteMany({});
    await Order.deleteMany({});
    await Expense.deleteMany({});

    const pinHash = await bcrypt.hash("123456", 12);
    const user = await User.create({ name: "Musab Dawood", email: "demo@musab.com", pinHash, emailVerified: true });

    const biz1 = await Business.create({
      ownerId: user._id, name: "Musab's Software House", category: "Software House", description: "Custom web & mobile app development, UI/UX design, and maintenance retainers.", currency: "PKR",
    });
    const biz2 = await Business.create({
      ownerId: user._id, name: "Dawood Digital Agency", category: "Marketing Agency", description: "SEO, social media management, and paid ads for SMEs.", currency: "PKR",
    });

    const prods = await Product.insertMany([
      { businessId: biz1._id, name: "Web App Development", category: "Development", price: 450000, sku: "WEB-APP-001", isService: true },
      { businessId: biz1._id, name: "UI/UX Design Package", category: "Design", price: 180000, sku: "DESIGN-001", isService: true },
      { businessId: biz1._id, name: "Monthly Maintenance Retainer", category: "Maintenance", price: 50000, sku: "MAINT-001", isService: true },
      { businessId: biz1._id, name: "API Integration Service", category: "Development", price: 120000, sku: "API-INT-001", isService: true },
      { businessId: biz1._id, name: "Consulting Hour", category: "Consulting", price: 15000, sku: "CONSULT-001", isService: true },
      { businessId: biz2._id, name: "SEO Audit", category: "SEO", price: 75000, sku: "SEO-AUDIT", isService: true },
      { businessId: biz2._id, name: "Social Media Management", category: "Social Media", price: 60000, sku: "SMM-MONTH", isService: true },
    ]);

    const custs = await Customer.insertMany([
      { businessId: biz1._id, name: "Ahmed Khan", contact: "ahmed@techcorp.pk | +92 300 1234567", notes: "CEO of TechCorp" },
      { businessId: biz1._id, name: "Sara Ali", contact: "sara@startup.io | +92 321 9876543", notes: "Founder of Startup.io" },
      { businessId: biz1._id, name: "Bilal Malik", contact: "bilal@enterprise.pk | +92 333 5555555", notes: "CTO of Enterprise Solutions" },
      { businessId: biz1._id, name: "Fatima Noor", contact: "fatima@designstudio.pk | +92 311 4444444", notes: "Creative Director" },
      { businessId: biz1._id, name: "Omar Raza", contact: "omar@fintech.pk | +92 345 6666666", notes: "FinTech startup founder" },
    ]);

    const now = Date.now();
    const d = (days: number) => new Date(now - days * 86400000).toISOString();

    await Order.insertMany([
      { businessId: biz1._id, customerId: custs[0]._id, items: [{ productId: prods[0]._id, quantity: 1, priceAtSale: 450000 }], totalAmount: 450000, status: "completed", createdAt: d(0) },
      { businessId: biz1._id, customerId: custs[1]._id, items: [{ productId: prods[1]._id, quantity: 1, priceAtSale: 180000 }], totalAmount: 180000, status: "pending", createdAt: d(1) },
      { businessId: biz1._id, customerId: custs[2]._id, items: [{ productId: prods[0]._id, quantity: 1, priceAtSale: 450000 }, { productId: prods[2]._id, quantity: 3, priceAtSale: 50000 }], totalAmount: 600000, status: "completed", createdAt: d(2) },
      { businessId: biz1._id, customerId: custs[3]._id, items: [{ productId: prods[3]._id, quantity: 1, priceAtSale: 120000 }], totalAmount: 120000, status: "cancelled", createdAt: d(3) },
      { businessId: biz1._id, customerId: custs[4]._id, items: [{ productId: prods[0]._id, quantity: 1, priceAtSale: 450000 }, { productId: prods[1]._id, quantity: 1, priceAtSale: 180000 }], totalAmount: 630000, status: "completed", createdAt: d(5) },
      { businessId: biz1._id, customerId: custs[0]._id, items: [{ productId: prods[4]._id, quantity: 10, priceAtSale: 15000 }], totalAmount: 150000, status: "completed", createdAt: d(7) },
      { businessId: biz1._id, customerId: custs[1]._id, items: [{ productId: prods[2]._id, quantity: 6, priceAtSale: 50000 }], totalAmount: 300000, status: "completed", createdAt: d(10) },
      { businessId: biz1._id, customerId: custs[2]._id, items: [{ productId: prods[1]._id, quantity: 2, priceAtSale: 180000 }], totalAmount: 360000, status: "completed", createdAt: d(14) },
    ]);

    await Expense.insertMany([
      { businessId: biz1._id, category: "Salaries", amount: 350000, note: "Team salaries for July", date: "2026-07-01" },
      { businessId: biz1._id, category: "Software", amount: 85000, note: "Cloud hosting + subscriptions", date: "2026-07-05" },
      { businessId: biz1._id, category: "Marketing", amount: 120000, note: "LinkedIn ads campaign", date: "2026-07-10" },
      { businessId: biz1._id, category: "Office", amount: 65000, note: "Co-working space rent", date: "2026-07-12" },
      { businessId: biz1._id, category: "Misc", amount: 42000, note: "Team lunch + coffee", date: "2026-07-15" },
      { businessId: biz1._id, category: "Salaries", amount: 350000, note: "Team salaries for June", date: "2026-06-01" },
      { businessId: biz1._id, category: "Software", amount: 78000, note: "AWS + Vercel + GitHub", date: "2026-06-05" },
      { businessId: biz1._id, category: "Marketing", amount: 95000, note: "Google Ads", date: "2026-06-10" },
    ]);

    return NextResponse.json({ message: "Seed complete. Demo: demo@musab.com / 123456" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
