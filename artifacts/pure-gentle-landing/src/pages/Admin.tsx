import { useState, useEffect, useCallback } from "react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

type Lead = {
  id: number;
  name: string;
  email: string;
  phone: string;
  zipCode: string;
  preferredTime: string;
  createdAt: string;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatTime(val: string) {
  const map: Record<string, string> = {
    morning: "Morning (8am – 12pm)",
    afternoon: "Afternoon (12pm – 5pm)",
    evening: "Evening (5pm – 8pm)",
    anytime: "Anytime",
  };
  return map[val] ?? val;
}

export default function Admin() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [leadsError, setLeadsError] = useState("");

  const checkSession = useCallback(async () => {
    try {
      const res = await fetch(`${BASE}/api/admin/session`, { credentials: "include" });
      const data = await res.json() as { authenticated: boolean };
      setAuthenticated(data.authenticated);
    } catch {
      setAuthenticated(false);
    }
  }, []);

  const fetchLeads = useCallback(async () => {
    setLeadsLoading(true);
    setLeadsError("");
    try {
      const res = await fetch(`${BASE}/api/admin/leads`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json() as { leads: Lead[] };
      setLeads(data.leads);
    } catch {
      setLeadsError("Failed to load leads. Please refresh.");
    } finally {
      setLeadsLoading(false);
    }
  }, []);

  useEffect(() => {
    void checkSession();
  }, [checkSession]);

  useEffect(() => {
    if (authenticated) {
      void fetchLeads();
    }
  }, [authenticated, fetchLeads]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    try {
      const res = await fetch(`${BASE}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setAuthenticated(true);
      } else {
        setLoginError("Incorrect password.");
      }
    } catch {
      setLoginError("Connection error. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch(`${BASE}/api/admin/logout`, { method: "POST", credentials: "include" });
    setAuthenticated(false);
    setLeads([]);
    setPassword("");
  };

  if (authenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <div className="inline-flex w-12 h-12 rounded-xl bg-blue-600 items-center justify-center text-white font-bold text-2xl mb-4">
              H
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1">Hyperion Elite Systems</p>
          </div>
          <form onSubmit={(e) => { void handleLogin(e); }} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {loginError && (
              <p className="text-sm text-red-600">{loginError}</p>
            )}
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-2.5 rounded-lg bg-slate-900 text-white font-semibold text-sm hover:bg-blue-600 transition-colors disabled:opacity-60"
            >
              {loginLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
              H
            </div>
            <div>
              <span className="font-bold text-slate-900 text-sm">Hyperion Elite Systems</span>
              <span className="text-slate-400 text-sm"> — Admin</span>
            </div>
          </div>
          <button
            onClick={() => { void handleLogout(); }}
            className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Leads</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {leads.length} {leads.length === 1 ? "submission" : "submissions"} total
            </p>
          </div>
          <button
            onClick={() => { void fetchLeads(); }}
            disabled={leadsLoading}
            className="text-sm font-medium px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            {leadsLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {leadsError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-6">
            {leadsError}
          </div>
        )}

        {leadsLoading && leads.length === 0 ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : leads.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 text-center py-20">
            <p className="text-slate-400 text-sm">No leads yet. Share your landing page to start collecting them.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left font-semibold text-slate-500 px-5 py-3">Name</th>
                    <th className="text-left font-semibold text-slate-500 px-5 py-3">Email</th>
                    <th className="text-left font-semibold text-slate-500 px-5 py-3">Phone</th>
                    <th className="text-left font-semibold text-slate-500 px-5 py-3">Zip</th>
                    <th className="text-left font-semibold text-slate-500 px-5 py-3">Best Time</th>
                    <th className="text-left font-semibold text-slate-500 px-5 py-3">Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead, i) => (
                    <tr
                      key={lead.id}
                      className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}
                    >
                      <td className="px-5 py-3 font-medium text-slate-900">{lead.name}</td>
                      <td className="px-5 py-3 text-slate-600">
                        <a href={`mailto:${lead.email}`} className="hover:text-blue-600 transition-colors">
                          {lead.email}
                        </a>
                      </td>
                      <td className="px-5 py-3 text-slate-600">
                        <a href={`tel:${lead.phone}`} className="hover:text-blue-600 transition-colors">
                          {lead.phone}
                        </a>
                      </td>
                      <td className="px-5 py-3 text-slate-600">{lead.zipCode}</td>
                      <td className="px-5 py-3 text-slate-600">{formatTime(lead.preferredTime)}</td>
                      <td className="px-5 py-3 text-slate-500">{formatDate(lead.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
