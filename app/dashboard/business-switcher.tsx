"use client";

import { useState, useRef, useEffect } from "react";
import { useBusiness } from "./business-context";

const CATEGORIES = ["Technology", "Retail", "Services", "Food & Beverage", "Healthcare", "Education", "Finance", "Other"];

export default function BusinessSwitcher() {
  const { businesses, currentBusiness, setCurrentBusiness, addBusiness } = useBusiness();
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("Technology");
  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setShowCreate(false);
        setNewName("");
        setError("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!currentBusiness) return null;

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    setError("");
    const ok = await addBusiness(newName.trim(), newCategory);
    setSaving(false);
    if (ok) {
      setNewName("");
      setNewCategory("Technology");
      setShowCreate(false);
      setOpen(false);
    } else {
      setError("Failed to create business. Please try again.");
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
          {currentBusiness.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
        </div>
        <div className="flex-1 text-left min-w-0">
          <p className="font-medium text-gray-900 truncate">{currentBusiness.name}</p>
          <p className="text-xs text-gray-400 truncate">{currentBusiness.category}</p>
        </div>
        <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0 ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 right-0 mt-1 bg-white rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100 py-2 z-50">
          <p className="px-4 py-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Your Businesses</p>
          {businesses.map((b) => (
            <button
              key={b._id}
              onClick={() => {
                setCurrentBusiness(b);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                currentBusiness._id === b._id
                  ? "bg-indigo-50 text-indigo-700 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {b.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="font-medium truncate">{b.name}</p>
                <p className="text-xs text-gray-400 truncate">{b.category}</p>
              </div>
              {currentBusiness._id === b._id && (
                <svg className="w-4 h-4 text-indigo-600 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              )}
            </button>
          ))}
          <hr className="my-2 border-gray-100" />
          {!showCreate ? (
            <button
              onClick={() => setShowCreate(true)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-indigo-600 hover:bg-indigo-50 transition-colors font-medium"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add new business
            </button>
          ) : (
            <div className="px-4 pb-2 space-y-2">
              {error && <div className="p-2 rounded-lg bg-red-50 border border-red-100 text-xs text-red-600">{error}</div>}
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Business name"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                autoFocus
                onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); }}
              />
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <div className="flex gap-2">
                <button
                  onClick={handleCreate}
                  disabled={saving || !newName.trim()}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-3 rounded-xl text-sm transition-colors disabled:opacity-50"
                >
                  {saving ? "Creating..." : "Create"}
                </button>
                <button type="button" onClick={() => { setShowCreate(false); setNewName(""); setError(""); }} className="flex-1 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-2 px-3 rounded-xl text-sm transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
