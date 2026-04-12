import { useState, useEffect, useCallback } from "react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

type Lead = {
  id: number; name: string; email: string; phone: string;
  zipCode: string; preferredTime: string; createdAt: string;
};

type Order = {
  id: number; name: string; email: string; phone: string;
  address: string; city: string; state: string; zipCode: string;
  ownershipType: string; preferredDate: string; accessNotes: string | null;
  monthlySoapCost: number; monthlyWaterCost: number;
  signedName: string; signedAt: string; status: string; createdAt: string;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit", hour12: true,
  });
}

function formatTime(val: string) {
  const map: Record<string, string> = {
    morning: "Morning (8am – 12pm)", afternoon: "Afternoon (12pm – 5pm)",
    evening: "Evening (5pm – 8pm)", anytime: "Anytime",
  };
  return map[val] ?? val;
}

export default function Admin() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [tab, setTab] = useState<"leads" | "orders">("orders");

  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [leadsError, setLeadsError] = useState("");

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");

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
    setLeadsLoading(true); setLeadsError("");
    try {
      const res = await fetch(`${BASE}/api/admin/leads`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json() as { leads: Lead[] };
      setLeads(data.leads);
    } catch { setLeadsError("Failed to load leads."); }
    finally { setLeadsLoading(false); }
  }, []);

  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true); setOrdersError("");
    try {
      const res = await fetch(`${BASE}/api/admin/orders`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json() as { orders: Order[] };
      setOrders(data.orders);
    } catch { setOrdersError("Failed to load orders."); }
    finally { setOrdersLoading(false); }
  }, []);

  useEffect(() => { void checkSession(); }, [checkSession]);

  useEffect(() => {
    if (authenticated) { void fetchLeads(); void fetchOrders(); }
  }, [authenticated, fetchLeads, fetchOrders]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setLoginLoading(true); setLoginError("");
    try {
      const res = await fetch(`${BASE}/api/admin/login`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        credentials: "include", body: JSON.stringify({ password }),
      });
      if (res.ok) setAuthenticated(true);
      else setLoginError("Incorrect password.");
    } catch { setLoginError("Connection error. Please try again."); }
    finally { setLoginLoading(false); }
  };

  const handleLogout = async () => {
    await fetch(`${BASE}/api/admin/logout`, { method: "POST", credentials: "include" });
    setAuthenticated(false); setLeads([]); setOrders([]); setPassword("");
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
            <div className="inline-flex w-12 h-12 rounded-xl bg-blue-600 items-center justify-center text-white font-bold text-2xl mb-4">H</div>
            <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1">Hyperion Elite Systems</p>
          </div>
          <form onSubmit={(e) => { void handleLogin(e); }} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="password">Password</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password" required
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {loginError && <p className="text-sm text-red-600">{loginError}</p>}
            <button type="submit" disabled={loginLoading}
              className="w-full py-2.5 rounded-lg bg-slate-900 text-white font-semibold text-sm hover:bg-blue-600 transition-colors disabled:opacity-60">
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
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xl">H</div>
            <div>
              <span className="font-bold text-slate-900 text-sm">Hyperion Elite Systems</span>
              <span className="text-slate-400 text-sm"> — Admin</span>
            </div>
          </div>
          <button onClick={() => { void handleLogout(); }}
            className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
            Sign out
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 space-y-6">
        <div className="grid sm:grid-cols-3 gap-4">
          <StatCard label="Total Orders" value={orders.length} accent="blue" />
          <StatCard label="Total Leads" value={leads.length} accent="slate" />
          <StatCard label="Pending Orders" value={orders.filter(o => o.status === "pending").length} accent="green" />
        </div>

        <div className="flex rounded-xl border border-slate-200 overflow-hidden bg-white w-fit">
          <TabBtn active={tab === "orders"} onClick={() => setTab("orders")}>
            Orders {orders.length > 0 && <span className="ml-1.5 bg-blue-100 text-blue-700 text-xs font-semibold px-1.5 py-0.5 rounded-full">{orders.length}</span>}
          </TabBtn>
          <TabBtn active={tab === "leads"} onClick={() => setTab("leads")}>
            Leads {leads.length > 0 && <span className="ml-1.5 bg-slate-100 text-slate-600 text-xs font-semibold px-1.5 py-0.5 rounded-full">{leads.length}</span>}
          </TabBtn>
        </div>

        {tab === "orders" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">Signed Orders</h2>
              <button onClick={() => { void fetchOrders(); }} disabled={ordersLoading}
                className="text-sm font-medium px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50">
                {ordersLoading ? "Refreshing..." : "Refresh"}
              </button>
            </div>
            {ordersError && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">{ordersError}</div>}
            {ordersLoading && orders.length === 0 ? (
              <div className="flex items-center justify-center py-24"><div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 text-center py-20">
                <p className="text-slate-400 text-sm">No signed orders yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-2xl border border-slate-200 p-6">
                    <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                      <div>
                        <div className="font-bold text-slate-900 text-lg">{order.name}</div>
                        <div className="text-sm text-slate-500">{order.address}, {order.city}, {order.state} {order.zipCode}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          order.status === "pending" ? "bg-amber-100 text-amber-700" :
                          order.status === "scheduled" ? "bg-blue-100 text-blue-700" :
                          "bg-green-100 text-green-700"
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                        <span className="text-xs text-slate-400">Order #{order.id}</span>
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-xs text-slate-400 mb-0.5">Contact</div>
                        <a href={`mailto:${order.email}`} className="text-slate-700 hover:text-blue-600 block">{order.email}</a>
                        <a href={`tel:${order.phone}`} className="text-slate-700 hover:text-blue-600 block">{order.phone}</a>
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 mb-0.5">Preferred Date</div>
                        <div className="text-slate-700">{new Date(order.preferredDate + "T12:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 mb-0.5">Monthly Budget</div>
                        <div className="text-slate-700">${order.monthlySoapCost}/mo soap · ${order.monthlyWaterCost}/mo water</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 mb-0.5">Signed</div>
                        <div className="text-slate-700">{formatDate(order.signedAt)}</div>
                        <div className="text-xs text-slate-400">{order.signedName}</div>
                      </div>
                    </div>
                    {order.accessNotes && (
                      <div className="mt-3 bg-slate-50 rounded-lg px-3 py-2 text-xs text-slate-600">
                        <span className="font-semibold">Access notes:</span> {order.accessNotes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "leads" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">Consultation Requests</h2>
              <button onClick={() => { void fetchLeads(); }} disabled={leadsLoading}
                className="text-sm font-medium px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50">
                {leadsLoading ? "Refreshing..." : "Refresh"}
              </button>
            </div>
            {leadsError && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">{leadsError}</div>}
            {leadsLoading && leads.length === 0 ? (
              <div className="flex items-center justify-center py-24"><div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
            ) : leads.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 text-center py-20">
                <p className="text-slate-400 text-sm">No leads yet.</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100">
                        {["Name","Email","Phone","Zip","Best Time","Submitted"].map(h => (
                          <th key={h} className="text-left font-semibold text-slate-500 px-5 py-3">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {leads.map((lead, i) => (
                        <tr key={lead.id} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                          <td className="px-5 py-3 font-medium text-slate-900">{lead.name}</td>
                          <td className="px-5 py-3"><a href={`mailto:${lead.email}`} className="text-slate-600 hover:text-blue-600">{lead.email}</a></td>
                          <td className="px-5 py-3"><a href={`tel:${lead.phone}`} className="text-slate-600 hover:text-blue-600">{lead.phone}</a></td>
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
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: number; accent: "blue" | "slate" | "green" }) {
  const colors = {
    blue: "text-blue-600", slate: "text-slate-700", green: "text-green-600",
  };
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className={`text-3xl font-bold ${colors[accent]}`}>{value}</div>
      <div className="text-sm text-slate-500 mt-1">{label}</div>
    </div>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`px-5 py-2.5 text-sm font-medium transition-colors flex items-center ${
      active ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-50"
    }`}>{children}</button>
  );
}
