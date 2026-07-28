"use client";

import { useBusiness } from "../business-context";
import { useCurrency } from "../currency-context";
import { useState } from "react";

export default function OrdersPage() {
  const { orders, customers, products, addOrder, deleteOrder, currentBusiness } = useBusiness();
  const { format } = useCurrency();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "completed" | "cancelled">("all");
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [newOrder, setNewOrder] = useState({ customerId: "", items: [{ productId: "", quantity: "1" }], status: "pending" as "pending" | "completed" | "cancelled" });

  if (!currentBusiness) {
    return <div className="flex items-center justify-center h-64 text-gray-400">Select a business first.</div>;
  }

  const filtered = orders
    .filter((o) => statusFilter === "all" || o.status === statusFilter)
    .filter((o) => {
      if (!search) return true;
      const cust = customers.find((c) => c._id === o.customerId);
      return cust?.name.toLowerCase().includes(search.toLowerCase()) || o._id.toLowerCase().includes(search.toLowerCase());
    });

  const statusStyles: Record<string, string> = {
    completed: "bg-emerald-50 text-emerald-700",
    pending: "bg-amber-50 text-amber-700",
    cancelled: "bg-red-50 text-red-700",
  };

  const handleCreate = async () => {
    if (!newOrder.customerId || !newOrder.items.some((i) => i.productId)) return;
    setSaving(true);
    setError("");
    const total = newOrder.items.reduce((s, item) => {
      const prod = products.find((p) => p._id === item.productId);
      return s + (prod ? prod.price * Number(item.quantity) : 0);
    }, 0);
    const ok = await addOrder({
      businessId: currentBusiness._id,
      customerId: newOrder.customerId,
      items: newOrder.items.filter((i) => i.productId).map((i) => ({
        productId: i.productId,
        quantity: Number(i.quantity),
        priceAtSale: products.find((p) => p._id === i.productId)?.price || 0,
      })),
      totalAmount: total,
      status: newOrder.status,
    });
    setSaving(false);
    if (ok) {
      setNewOrder({ customerId: "", items: [{ productId: "", quantity: "1" }], status: "pending" });
      setShowAdd(false);
    } else {
      setError("Failed to create order. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this order?")) return;
    await deleteOrder(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">{filtered.length} orders found</p>
        </div>
        <button
          onClick={() => { setShowAdd(!showAdd); setError(""); }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-all shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Order
        </button>
      </div>

      {showAdd && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Create New Order</h3>
          {error && <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">{error}</div>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Customer</label>
              <select value={newOrder.customerId} onChange={(e) => setNewOrder({ ...newOrder, customerId: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all">
                <option value="">Select customer</option>
                {customers.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
              <select value={newOrder.status} onChange={(e) => setNewOrder({ ...newOrder, status: e.target.value as "pending" | "completed" | "cancelled" })} className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all">
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-600 mb-1">Items</label>
            {newOrder.items.map((item, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <select value={item.productId} onChange={(e) => { const items = [...newOrder.items]; items[idx].productId = e.target.value; setNewOrder({ ...newOrder, items }); }} className="flex-1 px-3 py-2 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all">
                  <option value="">Select product</option>
                  {products.map((p) => <option key={p._id} value={p._id}>{p.name} ({format(p.price)})</option>)}
                </select>
                <input type="number" value={item.quantity} onChange={(e) => { const items = [...newOrder.items]; items[idx].quantity = e.target.value; setNewOrder({ ...newOrder, items }); }} className="w-20 px-3 py-2 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" min="1" />
                {newOrder.items.length > 1 && <button onClick={() => setNewOrder({ ...newOrder, items: newOrder.items.filter((_, i) => i !== idx) })} className="px-2 text-red-400 hover:text-red-600">×</button>}
              </div>
            ))}
            <button onClick={() => setNewOrder({ ...newOrder, items: [...newOrder.items, { productId: "", quantity: "1" }] })} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">+ Add item</button>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleCreate} disabled={saving || !newOrder.customerId || !newOrder.items.some((i) => i.productId)} className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors disabled:opacity-50">
              {saving ? "Creating..." : "Create Order"}
            </button>
            <button onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors">Cancel</button>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search orders..." className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" />
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {(["all", "pending", "completed", "cancelled"] as const).map((f) => (
            <button key={f} onClick={() => setStatusFilter(f)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${statusFilter === f ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Order</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Customer</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Items</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Total</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((o) => {
                const cust = customers.find((c) => c._id === o.customerId);
                const initials = cust?.name.split(" ").map((n) => n[0]).join("") || "?";
                return (
                  <tr key={o._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-indigo-600">#{o._id.slice(-4)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold">{initials}</div>
                        <span className="text-sm font-medium text-gray-900">{cust?.name || "Unknown"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{o.items.length} item{o.items.length !== 1 ? "s" : ""}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-gray-900">{format(o.totalAmount)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${statusStyles[o.status]}`}>{o.status}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleDelete(o._id)} className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition-all">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-sm text-gray-500">No orders found</div>
        )}
      </div>
    </div>
  );
}
