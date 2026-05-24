import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, TestTube, Gift } from "lucide-react";
import { readAttribution } from "@/lib/useUtmCapture";
import { trackLead } from "@/lib/fb";

const LEAD_INTAKE_URL =
  import.meta.env.VITE_LEAD_INTAKE_URL ||
  "https://bbccnglbxwnxpxlplxyv.supabase.co/functions/v1/lead-intake";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export function CTA() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", zipCode: "", time: "", waterTest: true });
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function set(field: keyof typeof form, value: string | boolean) {
    setForm(f => ({ ...f, [field]: value }));
    setErrors(e => ({ ...e, [field]: undefined }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Required";
    if (form.email.trim() && !/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email format";
    if (!form.phone.trim() || form.phone.replace(/\D/g,"").length < 10) e.phone = "Valid phone required";
    if (!form.zipCode.trim() || form.zipCode.length < 5) e.zipCode = "Required";
    if (!form.time) e.time = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true); setSubmitError("");
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
          waterTest: form.waterTest,
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

  return (
    <section id="schedule" className="py-20 relative overflow-hidden scroll-mt-24">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-14 items-center">

          <div className="text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#7e671b]/15 border border-[#7e671b]/40 text-[#b39636] text-sm font-semibold mb-5">
              <Gift className="w-4 h-4" />
              Limited availability — $25 gift card included
            </div>
            <div className="bg-slate-950/60 backdrop-blur-md rounded-2xl border border-white/10 p-7 mb-8">
              <h2 className="text-4xl md:text-5xl font-bold mb-5 tracking-tight leading-tight text-white">
                Get a free water test — and you get a $25 gift card.
              </h2>
              <p className="text-lg text-slate-100 leading-relaxed">
                Schedule a free in-home water test, get your questions answered on-site by a technician, and we'll send you a $25 gift card after the visit — no purchase necessary.
              </p>
            </div>
            <div className="space-y-4">
              {[
                "A technician tests your water on-site in 30–45 minutes",
                "Get your questions answered during the visit — no pressure, no pitch",
                "$25 gift card sent after your visit, regardless of outcome",
              ].map(item => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
                  <span className="text-slate-300 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            id="consultation-form"
            className="bg-slate-950/85 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl shadow-sky-900/30 scroll-mt-24"
          >
            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
                <div className="w-16 h-16 bg-emerald-400/15 rounded-full flex items-center justify-center mx-auto mb-5">
                  <CheckCircle className="w-8 h-8 text-emerald-300" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">One step closer to good water.</h3>
                <p className="text-slate-300 text-sm">We'll call to confirm your free water test. Your $25 gift card will be sent after the visit — no purchase necessary.</p>
              </motion.div>
            ) : (
              <form onSubmit={(e) => { void handleSubmit(e); }} className="space-y-4">
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-1">
                    <Gift className="w-4 h-4 text-sky-300" />
                    <h3 className="text-xl font-bold text-white">Claim Your $25 Gift Card</h3>
                  </div>
                  <p className="text-slate-400 text-sm">Schedule a free water test. We'll call to confirm, then send your gift card after the visit.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Fld label="Your Name" error={errors.name}>
                    <input type="text" value={form.name} onChange={e => set("name", e.target.value)}
                      placeholder="First Last" className={inp(errors.name)} />
                  </Fld>
                  <Fld label="Phone Number" error={errors.phone}>
                    <input type="tel" value={form.phone} onChange={e => set("phone", e.target.value)}
                      placeholder="(555) 123-4567" className={inp(errors.phone)} />
                  </Fld>
                </div>
                <Fld label="Email (optional)" error={errors.email}>
                  <input type="email" value={form.email} onChange={e => set("email", e.target.value)}
                    placeholder="jane@example.com" className={inp(errors.email)} />
                </Fld>
                <div className="grid grid-cols-2 gap-4">
                  <Fld label="ZIP Code" error={errors.zipCode}>
                    <input type="text" value={form.zipCode} onChange={e => set("zipCode", e.target.value)}
                      placeholder="85001" maxLength={5} className={inp(errors.zipCode)} />
                  </Fld>
                  <Fld label="Best Time to Call" error={errors.time}>
                    <select value={form.time} onChange={e => set("time", e.target.value)} className={inp(errors.time)}>
                      <option value="">Select</option>
                      <option value="morning">Morning (8am – 12pm)</option>
                      <option value="afternoon">Afternoon (12pm – 5pm)</option>
                      <option value="evening">Evening (5pm – 8pm)</option>
                      <option value="anytime">Anytime</option>
                    </select>
                  </Fld>
                </div>

                <label className="flex items-start gap-3 p-3 rounded-xl bg-sky-400/10 border border-sky-300/30 cursor-pointer select-none">
                  <input type="checkbox" checked={form.waterTest} onChange={e => set("waterTest", e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-white/20 text-sky-400 accent-sky-400 focus:ring-sky-400" />
                  <div>
                    <div className="flex items-center gap-1.5 text-sm font-medium text-white">
                      <TestTube className="w-3.5 h-3.5 text-sky-300" />
                      I'd also like a free in-home water test
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">A technician tests your water on-site in 30–45 minutes. No charge, no obligation.</div>
                  </div>
                </label>

                {submitError && <p className="text-sm text-rose-300">{submitError}</p>}

                <button type="submit" disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-60 text-white font-bold text-base transition-colors mt-1 shadow-lg shadow-sky-500/30">
                  {loading ? "Sending..." : "Claim My Gift Card"}
                </button>
                <p className="text-[11px] text-center text-slate-400 leading-relaxed mt-2">
                  By submitting, I agree that Hyperion Elite Systems and its service partners may contact me by phone and SMS (including auto-dialed and pre-recorded calls) at the number above regarding the free water test and related offers. Consent is not required to purchase. Msg &amp; data rates may apply. Reply STOP to opt out of SMS.
                </p>
                <p className="text-xs text-center text-slate-400 mt-1">
                  *Must complete the in-home water test and consultation to qualify. Subject to availability.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Fld({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-200 mb-1">{label}</label>
      {children}
      {error && <p className="text-xs text-rose-300 mt-0.5">{error}</p>}
    </div>
  );
}

function inp(error?: string) {
  return `w-full px-3.5 py-2.5 rounded-lg border text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent ${error ? "border-rose-400/60 bg-rose-500/10" : "border-white/10 bg-white/5"}`;
}
