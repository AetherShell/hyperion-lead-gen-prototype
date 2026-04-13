import { useState, useRef } from "react";
import { useLocation } from "wouter";
import SignatureCanvas from "react-signature-canvas";
import { CheckCircle, ArrowRight, ArrowLeft, RotateCcw, Pen, ShieldCheck } from "lucide-react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY",
];

function today() {
  return new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

type FormData = {
  name: string; email: string; phone: string;
  address: string; city: string; state: string; zipCode: string;
  ownershipType: string; preferredDate: string; accessNotes: string; signedName: string;
};

const EMPTY: FormData = {
  name: "", email: "", phone: "",
  address: "", city: "", state: "", zipCode: "",
  ownershipType: "own", preferredDate: "", accessNotes: "", signedName: "",
};

const TOTAL_STEPS = 3;

export default function Order() {
  const [, navigate] = useLocation();
  const params = new URLSearchParams(window.location.search);
  const soapCost = Number(params.get("soap") ?? 120);
  const bottledWaterCost = Number(params.get("water") ?? 40);

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [sigEmpty, setSigEmpty] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);

  const sigRef = useRef<SignatureCanvas>(null);

  const monthlySaving = soapCost + bottledWaterCost - 160;
  const fiveYearSavings = Math.max(0, monthlySaving * 12 * 5);

  function set(field: keyof FormData, value: string) {
    setForm(f => ({ ...f, [field]: value }));
    setErrors(e => ({ ...e, [field]: undefined }));
  }

  function validateStep1() {
    const e: Partial<FormData> = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.phone.trim()) e.phone = "Required";
    if (!form.address.trim()) e.address = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.state) e.state = "Required";
    if (!form.zipCode.trim()) e.zipCode = "Required";
    setErrors(e); return Object.keys(e).length === 0;
  }

  function validateStep2() {
    const e: Partial<FormData> = {};
    if (!form.preferredDate) e.preferredDate = "Required";
    setErrors(e); return Object.keys(e).length === 0;
  }

  function validateStep3() {
    const e: Partial<FormData> = {};
    if (!form.signedName.trim()) e.signedName = "Type your full name to sign";
    setErrors(e);
    if (sigEmpty) return false;
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validateStep3()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${BASE}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          monthlySoapCost: soapCost,
          monthlyBottledWaterCost: bottledWaterCost,
          signatureData: sigRef.current?.toDataURL() ?? "",
        }),
      });
      const data = await res.json() as { success: boolean; orderId: number; error?: string };
      if (data.success) { setOrderId(data.orderId); setStep(4); }
      else alert(data.error ?? "Something went wrong. Please try again.");
    } catch { alert("Connection error. Please try again."); }
    finally { setSubmitting(false); }
  }

  function next() {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep(s => s + 1);
  }

  const progress = Math.min((step / TOTAL_STEPS) * 100, 100);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">H</div>
            <span className="font-bold text-slate-900">Hyperion Elite Systems</span>
          </button>
          {step < 4 && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              <span>Secure checkout · Step {step} of {TOTAL_STEPS}</span>
            </div>
          )}
        </div>
      </header>

      {step < 4 && (
        <div className="w-full h-1.5 bg-slate-100">
          <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      )}

      {step < 4 && (
        <div className="bg-blue-600 text-white text-sm py-2.5 text-center font-medium">
          $10,990 system · $160/mo · 5-year soap supply included · Professional installation
          {fiveYearSavings > 0 && <span className="ml-2 bg-white/20 rounded-full px-2.5 py-0.5 text-xs font-bold">Save ~${fiveYearSavings.toLocaleString()} over 5 yrs</span>}
        </div>
      )}

      <main className="max-w-2xl mx-auto px-4 py-10">

        {step === 1 && (
          <div className="space-y-7">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Your Contact & Installation Address</h1>
              <p className="text-slate-500 text-sm mt-1">We'll prepare your work order and reach out to confirm scheduling.</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <F label="Full Name" error={errors.name}>
                  <input type="text" value={form.name} onChange={e => set("name", e.target.value)}
                    placeholder="Jane Smith" className={cls(errors.name)} autoFocus />
                </F>
                <F label="Phone Number" error={errors.phone}>
                  <input type="tel" value={form.phone} onChange={e => set("phone", e.target.value)}
                    placeholder="(555) 000-0000" className={cls(errors.phone)} />
                </F>
              </div>
              <F label="Email Address" error={errors.email}>
                <input type="email" value={form.email} onChange={e => set("email", e.target.value)}
                  placeholder="jane@example.com" className={cls(errors.email)} />
              </F>
              <F label="Installation Address" error={errors.address}>
                <input type="text" value={form.address} onChange={e => set("address", e.target.value)}
                  placeholder="123 Main Street" className={cls(errors.address)} />
              </F>
              <div className="grid grid-cols-5 gap-4">
                <F label="City" error={errors.city} className="col-span-2">
                  <input type="text" value={form.city} onChange={e => set("city", e.target.value)}
                    placeholder="Phoenix" className={cls(errors.city)} />
                </F>
                <F label="State" error={errors.state} className="col-span-1">
                  <select value={form.state} onChange={e => set("state", e.target.value)} className={cls(errors.state)}>
                    <option value="">—</option>
                    {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </F>
                <F label="ZIP" error={errors.zipCode} className="col-span-2">
                  <input type="text" value={form.zipCode} onChange={e => set("zipCode", e.target.value)}
                    placeholder="85001" className={cls(errors.zipCode)} />
                </F>
              </div>
              <F label="Do you own this home?" error={errors.ownershipType}>
                <div className="grid grid-cols-2 gap-3">
                  {[ ["own","I Own"],["rent","I Rent"] ].map(([v,l]) => (
                    <button key={v} type="button" onClick={() => set("ownershipType", v)}
                      className={`h-11 rounded-lg border-2 font-medium text-sm transition-all ${form.ownershipType === v ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-600 hover:border-slate-300"}`}>
                      {l}
                    </button>
                  ))}
                </div>
                {form.ownershipType === "rent" && (
                  <p className="text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2 mt-2">
                    Landlord written approval is required before installation. Our team will verify with you.
                  </p>
                )}
              </F>
            </div>

            <button onClick={next} className="w-full h-14 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-600/20">
              Continue to Scheduling <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-center text-xs text-slate-400">No payment today. We'll confirm your order by phone before installation.</p>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-7">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Schedule Your Installation</h1>
              <p className="text-slate-500 text-sm mt-1">We'll confirm your exact appointment window within 1 business day.</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
              <F label="Preferred Installation Date" error={errors.preferredDate}>
                <input type="date" value={form.preferredDate}
                  min={new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0]}
                  onChange={e => set("preferredDate", e.target.value)} className={cls(errors.preferredDate)} />
                <p className="text-xs text-slate-400 mt-1">Installation typically takes 3–4 hours. Someone 18+ must be home.</p>
              </F>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Gate Code or Access Notes <span className="text-slate-400 font-normal">(optional)</span></label>
                <textarea value={form.accessNotes} onChange={e => set("accessNotes", e.target.value)}
                  placeholder="Gate code, parking, best entrance..."
                  rows={2} className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>

              <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-sm text-slate-600">
                <div className="font-semibold text-slate-800 mb-1">What to expect</div>
                {["Installation takes 3–4 hours","Someone 18+ must be present the entire time","We need access to your main water shutoff valve","We handle all cleanup"].map(t => (
                  <div key={t} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="h-14 px-6 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 flex items-center gap-2 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button onClick={next} className="flex-1 h-14 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg flex items-center justify-center gap-2 transition-colors">
                Review &amp; Sign Agreement <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-7">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Review &amp; Sign</h1>
              <p className="text-slate-500 text-sm mt-1">Read the agreement, draw your signature, and submit to lock in your installation.</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex justify-between text-sm">
                <span className="font-semibold text-slate-700">Work Order Agreement</span>
                <span className="text-slate-400">{today()}</span>
              </div>
              <div className="px-5 py-4 space-y-3 text-sm text-slate-700 leading-relaxed max-h-56 overflow-y-auto">
                <p><strong>Customer:</strong> {form.name || "—"} &nbsp;·&nbsp; <strong>Address:</strong> {[form.address, form.city, form.state, form.zipCode].filter(Boolean).join(", ") || "—"}</p>
                <p><strong>System:</strong> Hyperion Elite Water Refiner + RO System &nbsp;·&nbsp; <strong>Price:</strong> $10,990 &nbsp;·&nbsp; <strong>Payment:</strong> $160/month (financing commonly 8–15 years)</p>
                <p><strong>Included:</strong> Whole-home water refiner (softening + chemical filtration), RO drinking water system, professional installation, Pure &amp; Gentle 5-year soap supply. After payoff: annual service is separate and typically about $180 for RO service plus about $340 for alkaline filters.</p>
                <p><strong>Scope:</strong> Hyperion Elite Systems agrees to supply and install the above system at the listed address. Installer will demonstrate operation at completion.</p>
                <p><strong>Customer Representations:</strong> Customer confirms they are the homeowner or have landlord written approval. Customer will provide access to main water shutoff valve during the scheduled visit.</p>
                <p><strong>Warranty:</strong> 1-year limited warranty on materials and workmanship from installation date. Soap supply delivered within 30 days of installation.</p>
                <p><strong>Cancellation:</strong> Customer may cancel within 3 business days of signing without penalty by contacting Hyperion Elite Systems in writing.</p>
                <p>By signing, Customer confirms they have read and agree to these terms.</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
              <div className="flex items-center gap-2">
                <Pen className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-slate-900">Sign Below</span>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-2">Draw your signature in the box:</p>
                <div className={`rounded-xl border-2 overflow-hidden bg-slate-50 ${sigEmpty ? "border-slate-200" : "border-blue-400"}`}>
                  <SignatureCanvas ref={sigRef} penColor="#1e293b"
                    canvasProps={{ className: "w-full", height: 140 }}
                    onEnd={() => setSigEmpty(false)} />
                </div>
                <div className="flex items-center justify-between mt-1.5">
                  <button onClick={() => { sigRef.current?.clear(); setSigEmpty(true); }}
                    className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors">
                    <RotateCcw className="w-3 h-3" /> Clear
                  </button>
                  {sigEmpty && <p className="text-xs text-red-500">Please draw your signature</p>}
                </div>
              </div>
              <F label="Type your full legal name to confirm" error={errors.signedName}>
                <input type="text" value={form.signedName} onChange={e => set("signedName", e.target.value)}
                  placeholder={form.name || "Your full name"} className={cls(errors.signedName)} />
              </F>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="h-14 px-6 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 flex items-center gap-2 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button onClick={() => { void handleSubmit(); }} disabled={submitting}
                className="flex-1 h-14 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold text-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-600/20">
                {submitting ? "Submitting..." : "Submit My Signed Order"}
              </button>
            </div>
            <p className="text-center text-xs text-slate-400">Your signature is stored securely. No payment is charged today.</p>
          </div>
        )}

        {step === 4 && (
          <div className="text-center space-y-8 py-12">
            <div className="inline-flex w-20 h-20 rounded-full bg-green-100 items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-3">You're all set, {form.name.split(" ")[0]}!</h1>
              <p className="text-slate-500 max-w-md mx-auto">
                Your signed work order has been submitted.
                {orderId && <span className="block text-sm text-slate-400 mt-1">Order #{orderId}</span>}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 text-left space-y-4 max-w-md mx-auto">
              <div className="font-semibold text-slate-800">What happens next:</div>
              <div className="space-y-3">
                {
                  [
                    ["Within 1 business day", "We'll call to confirm your installation on " + new Date(form.preferredDate + "T12:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })],
                    ["Day before installation", "You'll get a reminder with your technician's name and arrival window"],
                    ["Installation day", "3–4 hours, system demo included. We clean up after ourselves."],
                    ["Within 30 days", "Your Pure & Gentle soap supply ships to your door"],
                  ].map(([t, d]) => (
                    <div key={String(t)} className="flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                      <div>
                        <div className="text-sm font-semibold text-slate-800">{String(t)}</div>
                        <div className="text-sm text-slate-500">{String(d)}</div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>

            <p className="text-sm text-slate-500">
              Questions? Call{" "}
              <a href="tel:+18005550100" className="text-blue-600 font-medium hover:underline">(800) 555-0100</a>
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

function F({ label, error, children, className }: { label: string; error?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );
}

function cls(error?: string) {
  return `w-full px-3.5 py-2.5 rounded-lg border text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${error ? "border-red-400 bg-red-50" : "border-slate-200"}`;
}
