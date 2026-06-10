import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Droplets, Filter, FlaskConical, Sparkles, Lock, PhoneCall } from "lucide-react";
import { readAttribution } from "@/lib/useUtmCapture";
import { trackLead } from "@/lib/fb";

// --- Lead intake (shared endpoint with the free-test funnel; self-gen is
// discriminated by lead_type so it can never be counted as a $50 trial lead). ---
const LEAD_INTAKE_URL =
  import.meta.env.VITE_LEAD_INTAKE_URL ||
  "https://bbccnglbxwnxpxlplxyv.supabase.co/functions/v1/lead-intake";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// --- Pricing (LOCKED, confirmed by James 2026-06-02). These are Hyperion's real
// product prices, so the closers honor them. Do not change without James. ---
const PRICE = {
  refiner: 7990,
  ro: 3500,
  bundle: 10990, // refiner + ro together ($500 off vs separate)
  alkaline: 500, // gated: only with RO
  aaAddon: 1500, // activated alumina added to any build
  aaAlone: 2000, // activated alumina as the only item
} as const;

type Key = "refiner" | "ro" | "alkaline" | "aa";

interface Selection {
  refiner: boolean;
  ro: boolean;
  alkaline: boolean;
  aa: boolean;
}

const EMPTY: Selection = { refiner: false, ro: false, alkaline: false, aa: false };

/** Pure pricing per the locked logic. Verified against James's example totals:
 * refiner 7990 | refiner+ro 10990 | +alk 11490 | +aa 12990 | aa-alone 2000 */
export function computeTotal(sel: Selection): number {
  let total = 0;
  if (sel.refiner && sel.ro) total += PRICE.bundle;
  else if (sel.refiner) total += PRICE.refiner;
  else if (sel.ro) total += PRICE.ro;
  if (sel.alkaline && sel.ro) total += PRICE.alkaline; // alkaline requires RO
  if (sel.aa) {
    const hasOther = sel.refiner || sel.ro; // alkaline can't exist without RO, so RO covers it
    total += hasOther ? PRICE.aaAddon : PRICE.aaAlone;
  }
  return total;
}

interface ComponentDef {
  key: Key;
  name: string;
  icon: typeof Filter;
  tagline: string;
  // priceLabel is informational on the card; the real total comes from computeTotal.
  priceLabel: (sel: Selection) => string;
}

const COMPONENTS: ComponentDef[] = [
  {
    key: "refiner",
    name: "Whole-Home Refiner",
    icon: Filter,
    tagline: "Softer water at every tap — protects skin, hair, appliances, and plumbing.",
    priceLabel: () => "$7,990",
  },
  {
    key: "ro",
    name: "Reverse Osmosis Drinking Water",
    icon: Droplets,
    tagline: "Bottled-quality drinking water straight from your tap.",
    priceLabel: (s) => (s.refiner ? "+$3,000 with refiner" : "$3,500"),
  },
  {
    key: "alkaline",
    name: "Alkaline Remineralization",
    icon: Sparkles,
    tagline: "Adds back beneficial minerals and raises pH on your RO water.",
    priceLabel: () => "+$500",
  },
  {
    key: "aa",
    name: "Activated Alumina",
    icon: FlaskConical,
    tagline: "Targeted reduction of fluoride and arsenic.",
    priceLabel: (s) => (s.refiner || s.ro ? "+$1,500" : "$2,000"),
  },
];

export function SystemConfigurator() {
  const [sel, setSel] = useState<Selection>(EMPTY);
  const [revealed, setRevealed] = useState(false);

  // Form state mirrors CTA.tsx so the handoff behaves identically.
  const [form, setForm] = useState({ name: "", email: "", phone: "", zipCode: "", time: "" });
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const total = useMemo(() => computeTotal(sel), [sel]);
  const anySelected = sel.refiner || sel.ro || sel.aa;

  function toggle(key: Key) {
    setRevealed(false); // changing the build re-gates the price
    setSel((s) => {
      const next = { ...s, [key]: !s[key] };
      // Alkaline requires RO. Deselecting RO clears alkaline.
      if (!next.ro) next.alkaline = false;
      return next;
    });
  }

  function setField(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Required";
    if (form.email.trim() && !/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email format";
    if (!form.phone.trim() || form.phone.replace(/\D/g, "").length < 10) e.phone = "Valid phone required";
    if (!form.zipCode.trim() || form.zipCode.length < 5) e.zipCode = "Required";
    if (!form.time) e.time = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function buildSummary(): string {
    const parts: string[] = [];
    if (sel.refiner) parts.push("Whole-Home Refiner");
    if (sel.ro) parts.push("Reverse Osmosis");
    if (sel.alkaline) parts.push("Alkaline");
    if (sel.aa) parts.push("Activated Alumina");
    return parts.join(" + ") || "—";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setSubmitError("");
    try {
      const attribution = readAttribution();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (SUPABASE_ANON_KEY) {
        headers["Authorization"] = `Bearer ${SUPABASE_ANON_KEY}`;
        headers["apikey"] = SUPABASE_ANON_KEY;
      }
      const res = await fetch(LEAD_INTAKE_URL, {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          zipCode: form.zipCode,
          time: form.time,
          // --- self-gen discriminators: keep these leads OUT of the trial bucket ---
          lead_type: "selfgen",
          system_config: {
            components: { ...sel },
            summary: buildSummary(),
            total,
          },
          attribution,
        }),
      });
      if (!res.ok) throw new Error();
      const result = await res.json().catch(() => ({} as { id?: string }));
      trackLead(result.id ?? crypto.randomUUID());
      setSubmitted(true);
    } catch {
      setSubmitError("Something went wrong. Please call us directly.");
    } finally {
      setLoading(false);
    }
  }

  const inp = (err?: string) =>
    `w-full px-4 py-3 rounded-xl bg-slate-900/60 border ${
      err ? "border-red-400/60" : "border-white/10"
    } text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-400 transition-colors`;

  return (
    <section id="configurator" className="py-20 relative overflow-hidden scroll-mt-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),transparent_70%)] pointer-events-none" />
      <div className="container mx-auto px-4 md:px-6 max-w-4xl relative z-10">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
            Build your system.
          </h2>
          <p className="text-lg text-slate-100">
            Pick the pieces that fit your home. Your price appears once your build is set.
          </p>
        </div>

        {/* Component picker */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {COMPONENTS.map((c) => {
            const active = sel[c.key];
            const gated = c.key === "alkaline" && !sel.ro;
            const Icon = c.icon;
            return (
              <button
                key={c.key}
                type="button"
                disabled={gated}
                onClick={() => toggle(c.key)}
                className={`text-left rounded-2xl border-2 p-5 transition-all ${
                  gated
                    ? "border-white/5 bg-slate-900/30 opacity-50 cursor-not-allowed"
                    : active
                    ? "border-sky-400 bg-sky-400/10"
                    : "border-white/10 bg-slate-900/50 hover:border-sky-400/60"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800/80 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-sky-300" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white leading-tight">{c.name}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{c.priceLabel(sel)}</p>
                    </div>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 ${
                      active ? "border-sky-400 bg-sky-400" : "border-white/20"
                    }`}
                  >
                    {active && <Check className="w-4 h-4 text-slate-950" />}
                  </div>
                </div>
                <p className="text-sm text-slate-300 mt-3">{c.tagline}</p>
                {gated && (
                  <p className="text-xs text-amber-300/80 mt-2">Add Reverse Osmosis to include this.</p>
                )}
              </button>
            );
          })}
        </div>

        {/* Gated price reveal */}
        <div className="bg-slate-950/60 backdrop-blur-md rounded-3xl border border-white/10 p-6 md:p-8 shadow-2xl shadow-sky-900/20">
          <div className="flex items-center justify-between gap-4 mb-2">
            <div>
              <p className="text-sm text-slate-400">Your build</p>
              <p className="text-lg font-semibold text-white">{buildSummary()}</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!revealed ? (
              <motion.div key="gate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <button
                  type="button"
                  disabled={!anySelected}
                  onClick={() => setRevealed(true)}
                  className={`mt-4 w-full h-14 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 transition-all ${
                    anySelected
                      ? "bg-sky-500 hover:bg-sky-400 text-white"
                      : "bg-slate-800 text-slate-500 cursor-not-allowed"
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  {anySelected ? "See my system price" : "Select at least one component"}
                </button>
              </motion.div>
            ) : (
              <motion.div key="price" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
                <div className="text-center py-4">
                  <p className="text-sm text-slate-400 mb-1">Your system</p>
                  <p className="text-5xl font-bold text-white">${total.toLocaleString()}</p>
                  {/* FINANCING: James to confirm real terms before a monthly figure ships.
                      The ~$42/mo figure on file is RO-ONLY and must NOT be shown next to an
                      $11k build. Showing a neutral line until James supplies financed terms. */}
                  <p className="text-sm text-slate-400 mt-2">Financing options available — ask on your call.</p>
                </div>

                {submitted ? (
                  <div className="text-center py-6">
                    <div className="w-14 h-14 bg-emerald-400/15 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="w-7 h-7 text-emerald-300" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {`You're set, ${form.name.trim().split(/\s+/)[0]}.`}
                    </h3>
                    <p className="text-slate-300 text-sm">
                      A water specialist will call to finalize your build and schedule installation.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4 mt-2">
                    <div className="flex items-center gap-2 mb-1">
                      <PhoneCall className="w-4 h-4 text-sky-300" />
                      <h3 className="text-lg font-bold text-white">Book your call to lock this in</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <input value={form.name} onChange={(e) => setField("name", e.target.value)} placeholder="Full name" className={inp(errors.name)} />
                        {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
                      </div>
                      <div>
                        <input value={form.phone} onChange={(e) => setField("phone", e.target.value)} placeholder="Phone" className={inp(errors.phone)} />
                        {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <input value={form.email} onChange={(e) => setField("email", e.target.value)} placeholder="Email (optional)" className={inp(errors.email)} />
                        {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
                      </div>
                      <div>
                        <input value={form.zipCode} onChange={(e) => setField("zipCode", e.target.value)} placeholder="ZIP" maxLength={5} className={inp(errors.zipCode)} />
                        {errors.zipCode && <p className="text-xs text-red-400 mt-1">{errors.zipCode}</p>}
                      </div>
                    </div>
                    <div>
                      <select value={form.time} onChange={(e) => setField("time", e.target.value)} className={inp(errors.time)}>
                        <option value="">Best time to call</option>
                        <option value="morning">Morning (8am – 12pm)</option>
                        <option value="afternoon">Afternoon (12pm – 5pm)</option>
                        <option value="evening">Evening (5pm – 8pm)</option>
                      </select>
                      {errors.time && <p className="text-xs text-red-400 mt-1">{errors.time}</p>}
                    </div>
                    {submitError && <p className="text-sm text-red-400">{submitError}</p>}
                    <button type="submit" disabled={loading} className="w-full h-14 rounded-2xl bg-sky-500 hover:bg-sky-400 disabled:opacity-60 text-white font-semibold text-lg transition-all">
                      {loading ? "Sending…" : "Book my call"}
                    </button>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
