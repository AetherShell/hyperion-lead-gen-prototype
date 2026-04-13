import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, CheckCircle, TestTube } from "lucide-react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export function CTA() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", zipCode: "", time: "", waterTest: false });
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
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
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
      const res = await fetch(`${BASE}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, zipCode: form.zipCode, time: form.time, waterTest: form.waterTest }),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      setSubmitError("Something went wrong. Please call us directly.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="schedule" className="py-20 bg-slate-900 relative overflow-hidden scroll-mt-24">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-slate-900 pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-14 items-center">

          <div className="text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-5 tracking-tight leading-tight">
              Want to talk it through first?
            </h2>
            <p className="text-lg text-slate-400 mb-8 leading-relaxed">
              No pressure. Leave your info and a water specialist will call you at your preferred time. We'll answer your questions and help you figure out if it makes sense for your home.
            </p>
            <div className="space-y-4">
              {[
                "A 20-minute conversation — questions, not a pitch",
                "We can schedule a free in-home water test if you want one",
                "No obligation — if it's not the right fit, we'll tell you",
              ].map(item => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                  <span className="text-slate-300 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div id="consultation-form" className="bg-white rounded-2xl p-8 shadow-2xl scroll-mt-24">
            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">We'll be in touch.</h3>
                <p className="text-slate-500 text-sm">A water specialist will call you at your preferred time. In the meantime, feel free to browse our FAQ above.</p>
              </motion.div>
            ) : (
              <form onSubmit={(e) => { void handleSubmit(e); }} className="space-y-4">
                <div className="mb-5">
                  <h3 className="text-xl font-bold text-slate-900">Request a Callback</h3>
                  <p className="text-slate-400 text-sm mt-0.5">We'll reach out at your preferred time.</p>
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
                <Fld label="Email" error={errors.email}>
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

                <label className="flex items-start gap-3 p-3 rounded-xl bg-blue-50 border border-blue-100 cursor-pointer select-none">
                  <input type="checkbox" checked={form.waterTest} onChange={e => set("waterTest", e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  <div>
                    <div className="flex items-center gap-1.5 text-sm font-medium text-slate-800">
                      <TestTube className="w-3.5 h-3.5 text-blue-600" />
                      I'd also like a free in-home water test
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">A technician tests your water on-site in about 15 minutes. No charge, no obligation.</div>
                  </div>
                </label>

                {submitError && <p className="text-sm text-red-600">{submitError}</p>}

                <button type="submit" disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold text-base transition-colors mt-1">
                  {loading ? "Sending..." : "Request a Callback"}
                </button>
                <p className="text-xs text-center text-slate-400">
                  You can also scroll up and use the calculator to explore your options on your own.
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
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );
}

function inp(error?: string) {
  return `w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${error ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50"}`;
}
