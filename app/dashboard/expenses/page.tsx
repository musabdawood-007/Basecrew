"use client";

import { useBusiness } from "../business-context";
import { useCurrency } from "../currency-context";
import { useState } from "react";

const CATEGORIES = ["Salaries", "Software", "Marketing", "Office", "Misc", "Utilities", "Travel", "Equipment"];

export default function ExpensesPage() {
  const { expenses, addExpense, deleteExpense, currentBusiness } = useBusiness();
  const { format } = useCurrency();
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [newExpense, setNewExpense] = useState({ category: "Salaries", amount: "", note: "", date: new Date().toISOString().split("T")[0] });

  if (!currentBusiness) {
    return <div className="flex items-center justify-center h-64 text-gray-400">Select a business first.</div>;
  }

  const filtered = expenses
    .filter((e) => catFilter === "all" || e.category === catFilter)
    .filter((e) => {
      if (!search) return true;
      return e.category.toLowerCase().includes(search.toLowerCase()) || e.note.toLowerCase().includes(search.toLowerCase());
    });

  const totalExpenses = filtered.reduce((s, e) => s + e.amount, 0);

  const byCategory = CATEGORIES.map((cat) => {
    const catExpenses = expenses.filter((e) => e.category === cat);
    return { category: cat, total: catExpenses.reduce((s, e) => s + e.amount, 0), count: catExpenses.length };
  }).filter((c) => c.count > 0)
    .sort((a, b) => b.total - a.total);

  const maxCat = Math.max(...byCategory.map((c) => c.total), 1);

  const handleSave = async () => {
    if (!newExpense.amount || Number(newExpense.amount) <= 0) return;
    setSaving(true);
    setError("");
    const ok = await addExpense({
      businessId: currentBusiness._id,
      category: newExpense.category,
      amount: Number(newExpense.amount),
      note: newExpense.note,
      date: newExpense.date,
    });
    setSaving(false);
    if (ok) {
      setNewExpense({ category: "Salaries", amount: "", note: "", date: new Date().toISOString().split("T")[0] });
      setShowAdd(false);
    } else {
      setError("Failed to log expense. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this expense?")) return;
    await deleteExpense(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
          <p className="text-sm text-gray-500 mt-1">{filtered.length} expenses totaling {format(totalExpenses)}</p>
        </div>
        <button
          onClick={() => { setShowAdd(!showAdd); setError(""); }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-all shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Log Expense
        </button>
      </div>

      {showAdd && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Log New Expense</h3>
          {error && <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">{error}</div>}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
              <select value={newExpense.category} onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Amount (PKR)</label>
              <input type="number" value={newExpense.amount} onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" placeholder="0" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Date</label>
              <input type="date" value={newExpense.date} onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Note</label>
              <input value={newExpense.note} onChange={(e) => setNewExpense({ ...newExpense, note: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" placeholder="Description" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleSave} disabled={saving || !newExpense.amount || Number(newExpense.amount) <= 0} className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors disabled:opacity-50">
              {saving ? "Saving..." : "Save"}
            </button>
            <button onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">By Category</h3>
        <div className="space-y-3">
          {byCategory.map((c) => (
            <div key={c.category} className="flex items-center gap-4">
              <span className="text-sm text-gray-600 w-24 shrink-0">{c.category}</span>
              <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-700" style={{ width: `${(c.total / maxCat) * 100}%` }} />
              </div>
              <span className="text-sm font-medium text-gray-900 w-28 text-right">{format(c.total)}</span>
              <span className="text-xs text-gray-400 w-12 text-right">{c.count}x</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search expenses..." className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all" />
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 flex-wrap">
          <button onClick={() => setCatFilter("all")} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${catFilter === "all" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>All</button>
          {CATEGORIES.filter((c) => expenses.some((e) => e.category === c)).map((c) => (
            <button key={c} onClick={() => setCatFilter(c)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${catFilter === c ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>{c}</button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-50">
          {filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((e) => (
            <div key={e._id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors group">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{e.category}</span>
                  <span className="text-xs text-gray-400">{new Date(e.date).toLocaleDateString()}</span>
                </div>
                {e.note && <p className="text-sm text-gray-500 mt-1 truncate">{e.note}</p>}
              </div>
              <p className="text-sm font-bold text-red-600">-{format(e.amount)}</p>
              <button onClick={() => handleDelete(e._id)} className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition-all shrink-0">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-sm text-gray-500">No expenses found</div>
        )}
      </div>
    </div>
  );
}
