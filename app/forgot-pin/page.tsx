"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ForgotPinPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, purpose: "reset" }),
      });
      const data = await res.json();
      setLoading(false);
      if (!res.ok) {
        setError(data.error || "Failed to send OTP");
        return;
      }
      setSuccess("Reset code sent! Check your inbox (and spam/junk folder).");
      sessionStorage.setItem("reset-pin-email", email);
      setTimeout(() => router.push("/reset-pin"), 1500);
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">Basecrew</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Forgot your PIN?</h1>
          <p className="text-sm text-gray-500 mt-2">Enter your email and we&apos;ll send you a reset code</p>
        </div>

        <div className="glass-card rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-gray-900 placeholder-gray-400 outline-none transition-all"
              />
            </div>

            {error && <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">{error}</div>}
            {success && <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-sm text-emerald-600">{success}</div>}

            <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-all shadow-sm disabled:opacity-50">
              {loading ? "Sending..." : "Send reset code"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          <Link href="/signin" className="font-medium text-indigo-600 hover:text-indigo-700">Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}
