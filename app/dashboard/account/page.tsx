"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useCurrency, CURRENCIES } from "../currency-context";

type Profile = {
  name: string;
  email: string;
  role: string;
  emailVerified: boolean;
  createdAt: string;
};

type Message = { ok: boolean; text: string } | null;

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "U";

export default function AccountPage() {
  const { update } = useSession();
  const { currency, setCurrency } = useCurrency();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [nameForm, setNameForm] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [nameMsg, setNameMsg] = useState<Message>(null);

  const [pinForm, setPinForm] = useState({ current: "", next: "", confirm: "" });
  const [savingPin, setSavingPin] = useState(false);
  const [pinMsg, setPinMsg] = useState<Message>(null);

  const [showOnline, setShowOnline] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/user/profile");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load account");
        if (cancelled) return;
        setProfile(data);
        setNameForm(data.name);
      } catch (e: any) {
        if (!cancelled) setLoadError(e?.message || "Failed to load account");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    setShowOnline(localStorage.getItem("basecrew_online_status") !== "0");
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSaveName = async () => {
    const trimmed = nameForm.trim();
    if (!trimmed || !profile || trimmed === profile.name) return;
    setSavingName(true);
    setNameMsg(null);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update name");
      setProfile((p) => (p ? { ...p, name: data.name } : p));
      setNameForm(data.name);
      setNameMsg({ ok: true, text: "Name updated successfully." });
      await update({ name: data.name });
    } catch (e: any) {
      setNameMsg({ ok: false, text: e?.message || "Failed to update name. Please try again." });
    } finally {
      setSavingName(false);
    }
  };

  const handleChangePin = async () => {
    setPinMsg(null);
    if (!/^\d{6}$/.test(pinForm.current)) {
      setPinMsg({ ok: false, text: "Current PIN must be 6 digits." });
      return;
    }
    if (!/^\d{6}$/.test(pinForm.next)) {
      setPinMsg({ ok: false, text: "New PIN must be 6 digits." });
      return;
    }
    if (pinForm.next !== pinForm.confirm) {
      setPinMsg({ ok: false, text: "New PIN and confirmation do not match." });
      return;
    }
    if (pinForm.next === pinForm.current) {
      setPinMsg({ ok: false, text: "New PIN must be different from current PIN." });
      return;
    }
    setSavingPin(true);
    try {
      const res = await fetch("/api/user/change-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPin: pinForm.current, newPin: pinForm.next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to change PIN");
      setPinForm({ current: "", next: "", confirm: "" });
      setPinMsg({ ok: true, text: "PIN changed successfully." });
    } catch (e: any) {
      setPinMsg({ ok: false, text: e?.message || "Failed to change PIN. Please try again." });
    } finally {
      setSavingPin(false);
    }
  };

  const toggleOnlineStatus = (value: boolean) => {
    setShowOnline(value);
    localStorage.setItem("basecrew_online_status", value ? "1" : "0");
    window.dispatchEvent(new CustomEvent("basecrew-online-status", { detail: value ? "1" : "0" }));
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-gray-400">Loading account...</div>;
  }

  if (!profile) {
    return (
      <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
        {loadError || "Failed to load account."}
      </div>
    );
  }

  const createdDate = new Date(profile.createdAt);
  const createdText = isNaN(createdDate.getTime())
    ? "—"
    : createdDate.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Account</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your profile, security and preferences</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-4">
        <div className="w-14 h-14 shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-lg font-bold">
          {getInitials(profile.name)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-lg font-semibold text-gray-900 truncate">{profile.name}</p>
          <p className="text-sm text-gray-500 truncate">{profile.email}</p>
        </div>
        <span
          className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium ${
            profile.role === "admin" ? "bg-amber-50 text-amber-700" : "bg-indigo-50 text-indigo-700"
          }`}
        >
          {profile.role === "admin" ? "Admin" : "Member"}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Profile Information</h3>
            <p className="text-xs text-gray-500 mb-4">Update your display name</p>
            {nameMsg && (
              <div
                className={`mb-4 p-3 rounded-xl border text-sm ${
                  nameMsg.ok
                    ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                    : "bg-red-50 border-red-100 text-red-600"
                }`}
              >
                {nameMsg.text}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                <input
                  value={nameForm}
                  onChange={(e) => setNameForm(e.target.value)}
                  maxLength={60}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                <input
                  value={profile.email}
                  disabled
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-100/50 text-sm text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>
            <button
              onClick={handleSaveName}
              disabled={savingName || !nameForm.trim() || nameForm.trim() === profile.name}
              className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors disabled:opacity-50"
            >
              {savingName ? "Saving..." : "Save Changes"}
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Change PIN</h3>
            <p className="text-xs text-gray-500 mb-4">
              Your PIN must be 6 digits. Enter your current PIN to confirm the change.
            </p>
            {pinMsg && (
              <div
                className={`mb-4 p-3 rounded-xl border text-sm ${
                  pinMsg.ok
                    ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                    : "bg-red-50 border-red-100 text-red-600"
                }`}
              >
                {pinMsg.text}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Current PIN</label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={6}
                  value={pinForm.current}
                  onChange={(e) => setPinForm({ ...pinForm, current: e.target.value.replace(/\D/g, "") })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all tracking-widest"
                  placeholder="••••••"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">New PIN</label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={6}
                  value={pinForm.next}
                  onChange={(e) => setPinForm({ ...pinForm, next: e.target.value.replace(/\D/g, "") })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all tracking-widest"
                  placeholder="••••••"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Confirm New PIN</label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={6}
                  value={pinForm.confirm}
                  onChange={(e) => setPinForm({ ...pinForm, confirm: e.target.value.replace(/\D/g, "") })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all tracking-widest"
                  placeholder="••••••"
                />
              </div>
            </div>
            <button
              onClick={handleChangePin}
              disabled={
                savingPin ||
                !/^\d{6}$/.test(pinForm.current) ||
                !/^\d{6}$/.test(pinForm.next) ||
                !/^\d{6}$/.test(pinForm.confirm)
              }
              className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors disabled:opacity-50"
            >
              {savingPin ? "Changing..." : "Change PIN"}
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Preferences</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Default currency</label>
                <select
                  value={currency.code}
                  onChange={(e) => {
                    const found = CURRENCIES.find((c) => c.code === e.target.value);
                    if (found) setCurrency(found);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} — {c.name} ({c.symbol})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">Show online status</p>
                  <p className="text-xs text-gray-500">Display the green online badge in the top bar</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={showOnline}
                  onClick={() => toggleOnlineStatus(!showOnline)}
                  className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                    showOnline ? "bg-indigo-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      showOnline ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Account Details</h3>
            <dl className="space-y-3 text-sm">
              <div className="flex items-start justify-between gap-3">
                <dt className="text-gray-500">Account created</dt>
                <dd className="text-gray-900 font-medium text-right">{createdText}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-gray-500">Email verified</dt>
                <dd className={`font-medium ${profile.emailVerified ? "text-emerald-600" : "text-amber-600"}`}>
                  {profile.emailVerified ? "Yes" : "No"}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-gray-500">Role</dt>
                <dd className="text-gray-900 font-medium">{profile.role === "admin" ? "Admin" : "Member"}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-gray-500">Currency</dt>
                <dd className="text-gray-900 font-medium">{currency.code}</dd>
              </div>
            </dl>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">About</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              <span className="font-medium text-gray-900">BaseCrew Native/V1 Developer</span> — Musab Dawood
            </p>
            <a
              href="https://musab-007.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              musab-007.netlify.app
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
            <p className="mt-2 text-xs text-gray-400">Click to access the developer&apos;s website</p>
          </div>
        </div>
      </div>
    </div>
  );
}
