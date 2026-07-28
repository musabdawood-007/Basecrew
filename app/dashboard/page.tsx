"use client";

import { useBusiness } from "./business-context";
import { useCurrency } from "./currency-context";
import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import ScrollReveal from "../components/ScrollReveal";

const COLORS = ["#6366f1", "#8b5cf6", "#06b6d4", "#f59e0b", "#34d399", "#f87171", "#ec4899"];

function AnimatedCounter({ value, duration = 1500 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (value === 0) { setDisplay(0); return; }
    const start = performance.now();
    let raf: number;
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * value));
      if (progress < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return <>{display.toLocaleString()}</>;
}

function EmptyCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-14 h-14 rounded-2xl glass-badge flex items-center justify-center text-gray-400 mb-4">{icon}</div>
      <p className="text-sm font-medium text-gray-900 mb-1">{title}</p>
      <p className="text-xs text-gray-500">{desc}</p>
    </div>
  );
}

function LiveClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  if (!now) return <div className="flex items-center gap-3 text-sm text-gray-500"><span className="font-medium text-gray-700">&nbsp;</span></div>;
  const time = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const date = now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  return (
    <div className="flex items-center gap-3 text-sm text-gray-500">
      <span className="font-medium text-gray-700">{date}</span>
      <span className="w-px h-4 bg-gray-200" />
      <span className="font-mono tabular-nums text-indigo-600">{time}</span>
    </div>
  );
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const { products, customers, orders, expenses } = useBusiness();
  const { format } = useCurrency();

  const firstName = session?.user?.name?.split(" ")[0] || "there";

  const totalRevenue = orders.filter((o) => o.status === "completed").reduce((s, o) => s + o.totalAmount, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const completedOrders = orders.filter((o) => o.status === "completed").length;
  const cancelledOrders = orders.filter((o) => o.status === "cancelled").length;
  const profit = totalRevenue - totalExpenses;

  const monthlyData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    return months.slice(0, now.getMonth() + 1).map((month, i) => {
      const monthOrders = orders.filter((o) => {
        const d = new Date(o.createdAt);
        return d.getMonth() === i && d.getFullYear() === now.getFullYear() && o.status === "completed";
      });
      const monthExpenses = expenses.filter((e) => {
        const d = new Date(e.date);
        return d.getMonth() === i && d.getFullYear() === now.getFullYear();
      });
      return {
        month,
        revenue: monthOrders.reduce((s, o) => s + o.totalAmount, 0),
        expenses: monthExpenses.reduce((s, e) => s + e.amount, 0),
      };
    });
  }, [orders, expenses]);

  const expenseByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    expenses.forEach((e) => { map[e.category] = (map[e.category] || 0) + e.amount; });
    return Object.entries(map)
      .map(([name, value], i) => ({ name, value, color: COLORS[i % COLORS.length] }))
      .sort((a, b) => b.value - a.value);
  }, [expenses]);

  const hasData = orders.length > 0 || expenses.length > 0;

  const stats = [
    { label: "Total Revenue", value: totalRevenue, change: 0, icon: "M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z", color: "indigo" },
    { label: "Total Orders", value: totalOrders, change: 0, icon: "M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z", color: "emerald" },
    { label: "Customers", value: customers.length, change: 0, icon: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z", color: "violet" },
    { label: "Total Expenses", value: totalExpenses, change: 0, icon: "M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z", color: "amber" },
  ];

  const colorMap: Record<string, { bg: string; icon: string }> = {
    indigo: { bg: "bg-indigo-50/80", icon: "text-indigo-600" },
    emerald: { bg: "bg-emerald-50/80", icon: "text-emerald-600" },
    violet: { bg: "bg-violet-50/80", icon: "text-violet-600" },
    amber: { bg: "bg-amber-50/80", icon: "text-amber-600" },
  };

  const statusStyles: Record<string, string> = {
    completed: "bg-emerald-50/80 text-emerald-700",
    pending: "bg-amber-50/80 text-amber-700",
    cancelled: "bg-red-50/80 text-red-700",
  };

  const topProducts = useMemo(() => {
    return products
      .map((p) => {
        const productOrders = orders.filter((o) => o.status === "completed" && o.items.some((i) => i.productId === p._id));
        const totalSold = productOrders.reduce((s, o) => s + o.items.filter((i) => i.productId === p._id).reduce((s2, i) => s2 + i.quantity, 0), 0);
        const totalRev = productOrders.reduce((s, o) => s + o.items.filter((i) => i.productId === p._id).reduce((s2, i) => s2 + i.priceAtSale * i.quantity, 0), 0);
        return { name: p.name, sold: totalSold, revenue: totalRev };
      })
      .filter((p) => p.sold > 0)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [products, orders]);

  const maxProductRevenue = Math.max(...topProducts.map((p) => p.revenue), 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <ScrollReveal>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome, {firstName}</h1>
            <LiveClock />
          </div>
          <div className="flex items-center gap-2">
            <a href="/dashboard/products" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass-card text-sm font-medium text-gray-700 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add Product
            </a>
            <a href="/dashboard/orders" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-all shadow-sm hover:shadow-md">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
              </svg>
              New Order
            </a>
          </div>
        </div>
      </ScrollReveal>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const c = colorMap[stat.color];
          return (
            <ScrollReveal key={stat.label} delay={i * 60}>
              <div className="glass-card rounded-2xl p-5 transition-all duration-300 group hover:-translate-y-0.5">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <svg className={`w-5 h-5 ${c.icon}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
                    </svg>
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {stat.value === 0 && !hasData ? "—" : <AnimatedCounter value={Math.round(stat.value)} />}
                </p>
                <p className="text-sm text-gray-500 text-gray-500 mt-1">{stat.label}</p>
              </div>
            </ScrollReveal>
          );
        })}
      </div>

      {/* Net Profit */}
      <ScrollReveal delay={100}>
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 text-white relative overflow-hidden glass-shimmer">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-6 -translate-x-6 blur-xl" />
          <div className="relative">
            <p className="text-sm font-medium text-indigo-200">Net Profit (YTD)</p>
            <p className="text-3xl font-bold mt-2">{format(profit)}</p>
            <div className="flex items-center gap-4 mt-4 text-sm">
              <div>
                <p className="text-indigo-300 text-xs">Revenue</p>
                <p className="font-semibold">{format(totalRevenue)}</p>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div>
                <p className="text-indigo-300 text-xs">Expenses</p>
                <p className="font-semibold">{format(totalExpenses)}</p>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div>
                <p className="text-indigo-300 text-xs">Margin</p>
                <p className="font-semibold">{totalRevenue > 0 ? Math.round((profit / totalRevenue) * 100) : 0}%</p>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Revenue Chart + Order Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ScrollReveal className="lg:col-span-2">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-semibold text-gray-900">Revenue vs Expenses</h3>
                <p className="text-sm text-gray-500 text-gray-500 mt-0.5">Monthly overview</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  <span className="text-gray-500">Revenue</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-violet-300" />
                  <span className="text-gray-500">Expenses</span>
                </div>
              </div>
            </div>
            {hasData ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={monthlyData} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `${(v / 1000).toFixed(0)}K` : `${v}`} />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.8)", backdropFilter: "blur(8px)", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }} formatter={(value, name) => [format(Number(value)), name === "revenue" ? "Revenue" : "Expenses"]} />
                  <Bar dataKey="revenue" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="expenses" fill="#c4b5fd" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyCard
                icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75z" /></svg>}
                title="No revenue data yet"
                desc="Create your first completed order to see charts"
              />
            )}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-6">Order Status</h3>
            {hasData ? (
              <>
                <div className="flex justify-center mb-6">
                  <ResponsiveContainer width={180} height={180}>
                    <PieChart>
                      <Pie data={[{ name: "Completed", value: completedOrders }, { name: "Pending", value: pendingOrders }, { name: "Cancelled", value: cancelledOrders }]} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                        <Cell fill="#34d399" />
                        <Cell fill="#fbbf24" />
                        <Cell fill="#f87171" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3">
                  {[{ label: "Completed", value: completedOrders, color: "bg-emerald-500" }, { label: "Pending", value: pendingOrders, color: "bg-amber-500" }, { label: "Cancelled", value: cancelledOrders, color: "bg-red-400" }].map((s) => (
                    <div key={s.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${s.color}`} />
                        <span className="text-sm text-gray-600 text-gray-500">{s.label}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{s.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <EmptyCard
                icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" /></svg>}
                title="No orders yet"
                desc="Create your first order to track statuses"
              />
            )}
          </div>
        </ScrollReveal>
      </div>

      {/* Expense Breakdown + Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ScrollReveal>
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-5">Expense Breakdown</h3>
            {expenseByCategory.length > 0 ? (
              <div className="flex items-center gap-6">
                <ResponsiveContainer width={160} height={160}>
                  <PieChart>
                    <Pie data={expenseByCategory} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                      {expenseByCategory.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-3">
                  {expenseByCategory.map((exp) => {
                    const total = expenseByCategory.reduce((s, e) => s + e.value, 0);
                    return (
                      <div key={exp.name} className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: exp.color }} />
                        <span className="text-sm text-gray-600 text-gray-500 flex-1">{exp.name}</span>
                        <span className="text-sm font-medium text-gray-900">{format(exp.value)}</span>
                        <span className="text-xs text-gray-400 w-10 text-right">{Math.round((exp.value / total) * 100)}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <EmptyCard
                icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25" /></svg>}
                title="No expenses logged"
                desc="Log your first expense to see the breakdown"
              />
            )}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-5">Top Selling Services</h3>
            {topProducts.length > 0 ? (
              <div className="space-y-4">
                {topProducts.map((p, i) => (
                  <div key={p.name} className="group">
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-sm font-medium text-gray-700 text-gray-300 group-hover:text-indigo-600 transition-colors">{p.name}</p>
                      <p className="text-sm font-semibold text-gray-900">{format(p.revenue)}</p>
                    </div>
                    <div className="w-full h-2 bg-gray-100/80 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-1000 ease-out" style={{ width: `${(p.revenue / maxProductRevenue) * 100}%`, transitionDelay: `${i * 100}ms` }} />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{p.sold} units sold</p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyCard
                icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>}
                title="No products sold yet"
                desc="Add products and create orders to see top sellers"
              />
            )}
          </div>
        </ScrollReveal>
      </div>

      {/* Recent Orders + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ScrollReveal className="lg:col-span-2">
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/20 border-white/20">
              <h3 className="text-base font-semibold text-gray-900">Recent Orders</h3>
              {orders.length > 0 && <a href="/dashboard/orders" className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors">View all</a>}
            </div>
            {orders.length > 0 ? (
              <div className="divide-y divide-white/20">
                {orders.slice(0, 5).map((order) => {
                  const cust = customers.find((c) => c._id === order.customerId);
                  const custName = cust?.name || "Unknown";
                  const initials = custName.split(" ").map((n) => n[0]).join("");
                  return (
                    <div key={order._id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-white/30 transition-colors">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold shrink-0">{initials}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{custName}</p>
                        <p className="text-xs text-gray-400">{order._id}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">{format(order.totalAmount)}</p>
                        <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${statusStyles[order.status]}`}>{order.status}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyCard
                icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" /></svg>}
                title="No orders yet"
                desc="Create your first order to get started"
              />
            )}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-5">Quick Actions</h3>
            <div className="space-y-3">
              {[
                { label: "New Order", href: "/dashboard/orders", icon: "M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" },
                { label: "Add Product", href: "/dashboard/products", icon: "M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" },
                { label: "Add Customer", href: "/dashboard/customers", icon: "M12 4.5v15m7.5-7.5h-15" },
                { label: "Log Expense", href: "/dashboard/expenses", icon: "M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375" },
                { label: "View Analytics", href: "/dashboard/analytics", icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625z" },
              ].map((action) => (
                <a key={action.label} href={action.href} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 text-gray-500 hover:bg-white/50 hover:text-indigo-700 transition-colors group">
                  <div className="w-8 h-8 rounded-lg glass-badge flex items-center justify-center transition-colors group-hover:scale-110">
                    <svg className="w-4 h-4 text-gray-500 group-hover:text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d={action.icon} />
                    </svg>
                  </div>
                  {action.label}
                  <svg className="w-4 h-4 text-gray-300 group-hover:text-indigo-400 ml-auto transition-colors" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
