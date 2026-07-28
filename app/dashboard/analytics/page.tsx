"use client";

import { useBusiness } from "../business-context";
import { useCurrency } from "../currency-context";
import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, LineChart, Line,
} from "recharts";

const COLORS = ["#6366f1", "#8b5cf6", "#06b6d4", "#f59e0b", "#34d399", "#f87171", "#ec4899"];

export default function AnalyticsPage() {
  const { products, customers, orders, expenses, currentBusiness } = useBusiness();
  const { format } = useCurrency();

  if (!currentBusiness) {
    return <div className="flex items-center justify-center h-64 text-gray-400">Select a business to view analytics.</div>;
  }

  const bizOrders = orders.filter((o) => o.businessId === currentBusiness._id);
  const bizExpenses = expenses.filter((e) => e.businessId === currentBusiness._id);
  const bizProducts = products.filter((p) => p.businessId === currentBusiness._id);

  const totalRevenue = bizOrders.filter((o) => o.status === "completed").reduce((s, o) => s + o.totalAmount, 0);
  const totalExpenses = bizExpenses.reduce((s, e) => s + e.amount, 0);
  const profit = totalRevenue - totalExpenses;
  const avgOrderValue = bizOrders.filter((o) => o.status === "completed").length > 0 ? totalRevenue / bizOrders.filter((o) => o.status === "completed").length : 0;

  const monthlyData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    return months.slice(0, now.getMonth() + 1).map((month, i) => {
      const monthOrders = bizOrders.filter((o) => {
        const d = new Date(o.createdAt);
        return d.getMonth() === i && d.getFullYear() === now.getFullYear() && o.status === "completed";
      });
      const monthExpenses = bizExpenses.filter((e) => {
        const d = new Date(e.date);
        return d.getMonth() === i && d.getFullYear() === now.getFullYear();
      });
      return {
        month,
        revenue: monthOrders.reduce((s, o) => s + o.totalAmount, 0),
        expenses: monthExpenses.reduce((s, e) => s + e.amount, 0),
        orders: monthOrders.length,
      };
    });
  }, [bizOrders, bizExpenses]);

  const profitData = monthlyData.map((d) => ({ month: d.month, profit: d.revenue - d.expenses }));

  const topProducts = useMemo(() => {
    return bizProducts
      .map((p) => {
        const productOrders = bizOrders.filter((o) => o.status === "completed" && o.items.some((i) => i.productId === p._id));
        const sold = productOrders.reduce((s, o) => s + o.items.filter((i) => i.productId === p._id).reduce((s2, i) => s2 + i.quantity, 0), 0);
        const revenue = productOrders.reduce((s, o) => s + o.items.filter((i) => i.productId === p._id).reduce((s2, i) => s2 + i.priceAtSale * i.quantity, 0), 0);
        return { name: p.name, sold, revenue };
      })
      .filter((p) => p.sold > 0)
      .sort((a, b) => b.revenue - a.revenue);
  }, [bizProducts, bizOrders]);

  const expenseByCategory = useMemo(() => {
    return bizExpenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {} as Record<string, number>);
  }, [bizExpenses]);

  const expenseData = Object.entries(expenseByCategory)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const topCustomers = useMemo(() => {
    return customers
      .filter((c) => c.businessId === currentBusiness._id)
      .map((c) => {
        const custOrders = bizOrders.filter((o) => o.customerId === c._id && o.status === "completed");
        return { name: c.name, totalSpent: custOrders.reduce((s, o) => s + o.totalAmount, 0), orderCount: custOrders.length };
      })
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5);
  }, [customers, bizOrders, currentBusiness._id]);

  const hasData = bizOrders.length > 0 || bizExpenses.length > 0;

  const stats = [
    { label: "Total Revenue", value: format(totalRevenue), color: "indigo" },
    { label: "Total Expenses", value: format(totalExpenses), color: "amber" },
    { label: "Net Profit", value: format(profit), color: "emerald" },
    { label: "Avg. Order Value", value: format(avgOrderValue), color: "violet" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Business performance overview for {currentBusiness.name}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100">
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Revenue Trend */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h3 className="text-base font-semibold text-gray-900 mb-1">Revenue Trend</h3>
        <p className="text-sm text-gray-500 mb-6">Monthly revenue and expenses</p>
        {hasData ? (
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `${(v / 1000).toFixed(0)}K` : `${v}`} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #f1f5f9", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }} formatter={(value, name) => [format(Number(value)), name === "revenue" ? "Revenue" : "Expenses"]} />
              <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fill="url(#revenueGrad)" />
              <Area type="monotone" dataKey="expenses" stroke="#f59e0b" strokeWidth={2} fill="url(#expenseGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75z" /></svg>
            <p className="text-sm text-gray-500">No revenue data yet</p>
            <p className="text-xs text-gray-400 mt-1">Create completed orders to see trends</p>
          </div>
        )}
      </div>

      {/* Profit Trend + Expense Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="text-base font-semibold text-gray-900 mb-1">Profit Trend</h3>
          <p className="text-sm text-gray-500 mb-6">Monthly net profit</p>
          {hasData ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={profitData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `${(v / 1000).toFixed(0)}K` : `${v}`} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #f1f5f9", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }} formatter={(value) => [format(Number(value)), "Profit"]} />
                <Line type="monotone" dataKey="profit" stroke="#34d399" strokeWidth={2.5} dot={{ fill: "#34d399", r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25" /></svg>
              <p className="text-sm text-gray-500">No data yet</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="text-base font-semibold text-gray-900 mb-1">Expense Breakdown</h3>
          <p className="text-sm text-gray-500 mb-6">Spending by category</p>
          {expenseData.length > 0 ? (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width={180} height={180}>
                <PieChart>
                  <Pie data={expenseData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                    {expenseData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-3">
                {expenseData.map((e, i) => (
                  <div key={e.name} className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-sm text-gray-600 flex-1">{e.name}</span>
                    <span className="text-sm font-medium text-gray-900">{format(e.value)}</span>
                    <span className="text-xs text-gray-400 w-10 text-right">{totalExpenses > 0 ? Math.round((e.value / totalExpenses) * 100) : 0}%</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25" /></svg>
              <p className="text-sm text-gray-500">No expenses logged</p>
            </div>
          )}
        </div>
      </div>

      {/* Top Products + Top Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="text-base font-semibold text-gray-900 mb-5">Top Products by Revenue</h3>
          {topProducts.length > 0 ? (
            <ResponsiveContainer width="100%" height={Math.max(topProducts.length * 50, 200)}>
              <BarChart data={topProducts} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `${(v / 1000).toFixed(0)}K` : `${v}`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} width={140} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #f1f5f9", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }} formatter={(value) => [format(Number(value)), "Revenue"]} />
                <Bar dataKey="revenue" fill="#6366f1" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>
              <p className="text-sm text-gray-500">No products sold yet</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="text-base font-semibold text-gray-900 mb-5">Top Customers</h3>
          {topCustomers.length > 0 ? (
            <div className="space-y-4">
              {topCustomers.map((c) => (
                <div key={c.name} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {c.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900">{c.name}</p>
                      <p className="text-sm font-semibold text-gray-900">{format(c.totalSpent)}</p>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full" style={{ width: `${topCustomers[0] ? (c.totalSpent / topCustomers[0].totalSpent) * 100 : 0}%` }} />
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{c.orderCount} orders</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
              <p className="text-sm text-gray-500">No customers yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
