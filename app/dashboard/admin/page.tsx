"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface UserData {
  _id: string;
  name: string;
  email: string;
  role: string;
  blocked: boolean;
  blockedAt?: string;
  emailVerified: boolean;
  createdAt: string;
  businesses: { _id: string; name: string; category: string }[];
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    if (!session || (session.user as any).role !== "admin") {
      router.push("/dashboard");
      return;
    }
    fetchUsers();
  }, [session, status, router]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users);
        setTotal(data.total);
      }
    } catch {}
    setLoading(false);
  };

  const toggleBlock = async (userId: string, currentBlocked: boolean) => {
    setActionLoading(userId);
    setError("");
    try {
      const res = await fetch("/api/admin/users/block", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, blocked: !currentBlocked }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
      } else {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, blocked: !currentBlocked, blockedAt: !currentBlocked ? new Date().toISOString() : undefined } : u))
        );
      }
    } catch {
      setError("Failed to update");
    }
    setActionLoading(null);
  };

  const filtered = users.filter(
    (u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = users.filter((u) => !u.blocked && u.role !== "admin").length;
  const blockedCount = users.filter((u) => u.blocked).length;

  if (status === "loading" || (!session && loading)) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400 text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-sm text-gray-500 mt-1">Manage registered accounts and businesses</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Accounts</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{total}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <p className="text-sm text-gray-500">Active</p>
          <p className="text-3xl font-bold text-emerald-600 mt-1">{activeCount}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <p className="text-sm text-gray-500">Blocked</p>
          <p className="text-3xl font-bold text-red-500 mt-1">{blockedCount}</p>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">{error}</div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="p-4 border-b border-gray-100">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
        </div>

        <div className="divide-y divide-gray-50">
          {loading ? (
            <div className="p-8 text-center text-gray-400 text-sm">Loading accounts...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">No accounts found</div>
          ) : (
            filtered.map((user) => (
              <div key={user._id} className={`p-4 hover:bg-gray-50/50 transition-colors ${user.blocked ? "opacity-60" : ""}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900 text-sm truncate">{user.name}</p>
                      {user.role === "admin" && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full">Admin</span>
                      )}
                      {user.blocked && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-600 rounded-full">Blocked</span>
                      )}
                      {user.emailVerified && !user.blocked && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-full">Active</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
                    {user.businesses.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {user.businesses.map((biz) => (
                          <span key={biz._id} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-lg">
                            {biz.name}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-gray-400 mt-1.5">
                      Joined {new Date(user.createdAt).toLocaleDateString()}
                      {user.blockedAt && ` · Blocked ${new Date(user.blockedAt).toLocaleDateString()}`}
                    </p>
                  </div>
                  {user.role !== "admin" && (
                    <button
                      onClick={() => toggleBlock(user._id, user.blocked)}
                      disabled={actionLoading === user._id}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                        user.blocked
                          ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200"
                          : "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                      } disabled:opacity-50`}
                    >
                      {actionLoading === user._id ? "..." : user.blocked ? "Unblock" : "Block"}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
