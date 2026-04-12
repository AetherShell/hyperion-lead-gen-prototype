import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import SignatureCanvas from "react-signature-canvas";
import { CheckCircle, ArrowRight, ArrowLeft, RotateCcw, Pen } from "lucide-react";

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

function formatCurrency(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

type FormData = {
  name: string; email: string; phone: string;
  address: string; city: string; state: string; zipCode: string;
  ownershipType: string;
  preferredDate: string; accessNotes: string;
  signedName: string;
};

const EMPTY: FormData = {
  name: "", email: "", phone: "",
  address: "", city: "", state: "", zipCode: "",
  ownershipType: "own",
  preferredDate: "", accessNotes: "",
  signedName: "",
};

export default function Order() {
  const [, navigate] = useLocation();
  const params = new URLSearchParams(window.location.search);
  const soapCost = Number(params.get("soap") ?? 120);
  const waterCost = Number(params.get("water") ?? 40);

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [sigEmpty, setSigEmpty] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);

  const sigRef = useRef<SignatureCanvas>(null);

  const monthlySystem = 160;
  const fiveYearSystem = monthlySystem * 12 * 5;
  const fiveYearCurrent = (soapCost + waterCost) * 12 * 5;
  const savings = fiveYearCurrent - fiveYearSystem;

  function set(field: keyof FormData, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validateStep2() {
    const e: Partial<FormData> = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.phone.trim()) e.phone = "Required";
    if (!form.address.trim()) e.address = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.state) e.state = "Required";
    if (!form.zipCode.trim()) e.zipCode = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateStep3() {
    const e: Partial<FormData> = {};
    if (!form.preferredDate) e.preferredDate = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateStep4() {
    const e: Partial<FormData> = {};
    if (!form.signedName.trim()) e.signedName = "Please type your full name to sign";
    if (sigEmpty) {
      setErrors({ ...e, signedName: e.signedName ?? "" });
      return false;
    }
    setErrors(e);
    return Object.keys(e).length === 0 && !sigEmpty;
  }

  async function handleSubmit() {
    if (!validateStep4()) return;
    setSubmitting(true);
    const signatureData = sigRef.current?.toDataURL() ?? "";
    try {
      const res = await fetch(`${BASE}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          monthlySoapCost: soapCost,
          monthlyWaterCost: waterCost,
          signatureData,
        }),
      });
      const data = await res.json() as { success: boolean; orderId: number; error?: string };
      if (data.success) {
        setOrderId(data.orderId);
        setStep(5);
      } else {
        alert(data.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      alert("Connection error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function nextStep() {
    if (step === 2 && !validateStep2()) return;
    if (step === 3 && !validateStep3()) return;
    setStep((s) => s + 1);
  }

  const progress = Math.min((step / 4) * 100, 100);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
              H
            </div>
            <span className="font-bold text-slate-900">Hyperion Elite Systems</span>
          </button>
          {step < 5 && (
            <span className="text-sm text-slate-500">Step {step} of 4</span>
          )}
        </div>
      </header>

      {step < 5 && (
        <div className="w-full h-1.5 bg-slate-100">
          <div
            className="h-full bg-blue-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <main className="max-w-3xl mx-auto px-4 py-10">

        {step === 1 && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-slate-900">Review Your Plan</h1>
              <p className="text-slate-500 mt-2">Everything included with your Hyperion Elite system.</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="bg-blue-600 px-6 py-5 text-white">
                <div className="text-sm font-semibold text-blue-200 uppercase tracking-wider mb-1">Your System</div>
                <div className="text-2xl font-bold">Hyperion Elite Water Refiner + RO System</div>
              </div>
              <div className="p-6 space-y-4">
                {[
                  ["Whole-home water softening system", true],
                  ["Reverse osmosis drinking water system", true],
                  ["Professional installation included", true],
                  ["Pure & Gentle soap program (5-year supply)", true],
                  ["$50/yr maintenance after system is paid off", true],
                ].map(([item, included]) => (
                  <div key={String(item)} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 shrink-0" />
                    <span className="text-slate-700">{String(item)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
                <div className="text-2xl font-bold text-slate-900">$10,990</div>
                <div className="text-sm text-slate-500 mt-1">System Price</div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
                <div className="text-2xl font-bold text-blue-600">$160<span className="text-base font-medium">/mo</span></div>
                <div className="text-sm text-slate-500 mt-1">For ~5 Years</div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
                <div className="text-2xl font-bold text-green-600">$50<span className="text-base font-medium">/yr</span></div>
                <div className="text-sm text-slate-500 mt-1">After Payoff</div>
              </div>
            </div>

            <div className="bg-green-50 rounded-2xl border border-green-100 p-6">
              <div className="text-sm font-semibold text-green-800 uppercase tracking-wider mb-3">Your Projected Savings</div>
              <div className="grid sm:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-slate-800">{formatCurrency((soapCost + waterCost) * 12)}</div>
                  <div className="text-xs text-slate-500">Annual spend today</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-slate-800">{formatCurrency(fiveYearCurrent)}</div>
                  <div className="text-xs text-slate-500">5-year without system</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{formatCurrency(savings > 0 ? savings : 0)}</div>
                  <div className="text-xs text-slate-500">5-year savings potential</div>
                </div>
              </div>
            </div>

            <button
              onClick={nextStep}
              className="w-full h-14 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-600/20"
            >
              Continue to Your Information <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-slate-900">Your Information</h1>
              <p className="text-slate-500 mt-2">We'll use this to prepare your work order and schedule installation.</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Full Name" error={errors.name}>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="Jane Smith"
                    className={input(errors.name)}
                  />
                </Field>
                <Field label="Phone Number" error={errors.phone}>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder="(555) 000-0000"
                    className={input(errors.phone)}
                  />
                </Field>
              </div>
              <Field label="Email Address" error={errors.email}>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="jane@example.com"
                  className={input(errors.email)}
                />
              </Field>
              <Field label="Installation Address" error={errors.address}>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                  placeholder="123 Main Street"
                  className={input(errors.address)}
                />
              </Field>
              <div className="grid sm:grid-cols-3 gap-5">
                <Field label="City" error={errors.city} className="sm:col-span-1">
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => set("city", e.target.value)}
                    placeholder="Phoenix"
                    className={input(errors.city)}
                  />
                </Field>
                <Field label="State" error={errors.state} className="sm:col-span-1">
                  <select
                    value={form.state}
                    onChange={(e) => set("state", e.target.value)}
                    className={input(errors.state)}
                  >
                    <option value="">Select</option>
                    {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>
                <Field label="ZIP Code" error={errors.zipCode} className="sm:col-span-1">
                  <input
                    type="text"
                    value={form.zipCode}
                    onChange={(e) => set("zipCode", e.target.value)}
                    placeholder="85001"
                    className={input(errors.zipCode)}
                  />
                </Field>
              </div>
              <Field label="Do you own or rent this home?" error={errors.ownershipType}>
                <div className="grid grid-cols-2 gap-3">
                  {[["own", "I Own"], ["rent", "I Rent"]].map(([val, label]) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => set("ownershipType", val)}
                      className={`h-12 rounded-xl border-2 font-medium text-sm transition-all ${
                        form.ownershipType === val
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                {form.ownershipType === "rent" && (
                  <p className="text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2 mt-2">
                    Note: Landlord approval may be required before installation. Our team will contact you to verify.
                  </p>
                )}
              </Field>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="h-14 px-6 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button onClick={nextStep} className="flex-1 h-14 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg flex items-center justify-center gap-2 transition-colors">
                Continue <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-slate-900">Installation Preferences</h1>
              <p className="text-slate-500 mt-2">Help us plan your installation visit.</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
              <Field label="Preferred Installation Date" error={errors.preferredDate}>
                <input
                  type="date"
                  value={form.preferredDate}
                  min={new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0]}
                  onChange={(e) => set("preferredDate", e.target.value)}
                  className={input(errors.preferredDate)}
                />
                <p className="text-xs text-slate-400 mt-1">Our team will confirm availability within 1 business day.</p>
              </Field>

              <Field label="Access Notes (optional)">
                <textarea
                  value={form.accessNotes}
                  onChange={(e) => set("accessNotes", e.target.value)}
                  placeholder="Gate code, dog in yard, best entry point, parking info..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </Field>

              <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-600 space-y-2">
                <div className="font-semibold text-slate-800">What to expect on installation day:</div>
                <ul className="space-y-1 list-disc list-inside text-slate-600">
                  <li>Installation typically takes 3–4 hours</li>
                  <li>Someone 18+ must be present for the full visit</li>
                  <li>Access to main water shutoff valve is required</li>
                  <li>We handle all cleanup — your home stays spotless</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="h-14 px-6 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button onClick={nextStep} className="flex-1 h-14 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg flex items-center justify-center gap-2 transition-colors">
                Continue to Agreement <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-slate-900">Review &amp; Sign</h1>
              <p className="text-slate-500 mt-2">Read the agreement below, then sign to submit your order.</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Work Order Agreement</div>
              <div className="text-sm text-slate-500">Date: {today()}</div>

              <div className="border-t border-slate-100 pt-4 space-y-3 text-sm text-slate-700 leading-relaxed max-h-64 overflow-y-auto pr-2">
                <p><strong>Customer:</strong> {form.name || "[Customer Name]"}<br />
                <strong>Installation Address:</strong> {[form.address, form.city, form.state, form.zipCode].filter(Boolean).join(", ") || "[Address]"}</p>

                <p><strong>System:</strong> Hyperion Elite Water Refiner + Reverse Osmosis System<br />
                <strong>Total System Price:</strong> $10,990<br />
                <strong>Monthly Payment:</strong> $160/month for approximately 60 months<br />
                <strong>Soap Program:</strong> Pure &amp; Gentle 5-year supply included at no additional cost<br />
                <strong>Annual Maintenance (post-payoff):</strong> $50/year</p>

                <p><strong>Scope of Work:</strong> Hyperion Elite Systems agrees to supply and professionally install one (1) whole-home water conditioning system and one (1) reverse osmosis drinking water system at the address listed above. Installation includes all necessary fittings, connections, and bypass valves. Installer will demonstrate system operation upon completion.</p>

                <p><strong>Customer Representations:</strong> Customer confirms they are the homeowner or have obtained written landlord approval for installation. Customer agrees to provide unobstructed access to the water main shutoff valve and utility areas during the scheduled installation appointment.</p>

                <p><strong>Warranty:</strong> The system is covered by Hyperion Elite Systems' limited warranty for defects in materials and workmanship for a period of one (1) year from the date of installation. The soap program supply is subject to availability and will be delivered within 30 days of installation.</p>

                <p><strong>Cancellation:</strong> Customer may cancel this agreement within 3 business days of signing without penalty by contacting Hyperion Elite Systems in writing. After the cancellation period, standard financing terms apply.</p>

                <p><strong>Governing Law:</strong> This agreement is governed by the laws of the state of installation.</p>

                <p>By signing below, Customer acknowledges they have read, understood, and agree to the terms of this Work Order Agreement.</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
              <div className="flex items-center gap-2">
                <Pen className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-slate-900">Your Signature</span>
              </div>

              <div>
                <div className="text-sm text-slate-600 mb-2">Draw your signature below:</div>
                <div className={`rounded-xl border-2 overflow-hidden bg-slate-50 ${sigEmpty ? "border-slate-200" : "border-blue-400"}`}>
                  <SignatureCanvas
                    ref={sigRef}
                    penColor="#1e293b"
                    canvasProps={{ className: "w-full", height: 160 }}
                    onEnd={() => setSigEmpty(false)}
                  />
                </div>
                <button
                  onClick={() => { sigRef.current?.clear(); setSigEmpty(true); }}
                  className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 mt-2 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" /> Clear signature
                </button>
                {sigEmpty && errors.signedName === undefined && (
                  <p className="text-xs text-red-500 mt-1">Please draw your signature above</p>
                )}
              </div>

              <Field label="Type your full name to confirm" error={errors.signedName}>
                <input
                  type="text"
                  value={form.signedName}
                  onChange={(e) => set("signedName", e.target.value)}
                  placeholder={form.name || "Your full name"}
                  className={input(errors.signedName)}
                />
              </Field>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(3)} className="h-14 px-6 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={() => { void handleSubmit(); }}
                disabled={submitting}
                className="flex-1 h-14 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold text-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-600/20"
              >
                {submitting ? "Submitting..." : "Submit Signed Order"}
              </button>
            </div>

            <p className="text-center text-xs text-slate-400">
              By submitting you agree to Hyperion Elite Systems' terms. Your information is encrypted and stored securely.
            </p>
          </div>
        )}

        {step === 5 && (
          <div className="text-center space-y-8 py-12">
            <div className="inline-flex w-20 h-20 rounded-full bg-green-100 items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-3">Order Received!</h1>
              <p className="text-slate-600 max-w-md mx-auto">
                Thank you, {form.name.split(" ")[0]}. Your signed work order has been submitted successfully.
                {orderId && <span className="block text-sm text-slate-400 mt-1">Order #{orderId}</span>}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 text-left space-y-4 max-w-md mx-auto">
              <div className="font-semibold text-slate-800">What happens next:</div>
              <div className="space-y-3">
                {[
                  ["Within 1 business day", "Our team will call you to confirm your installation date of " + new Date(form.preferredDate + "T12:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })],
                  ["Before installation", "You'll receive a reminder with technician details and arrival window"],
                  ["Installation day", "Our team installs your system in 3–4 hours and walks you through everything"],
                  ["Within 30 days", "Your Pure & Gentle soap supply ships to your door"],
                ].map(([timing, detail]) => (
                  <div key={String(timing)} className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                    <div>
                      <div className="text-sm font-semibold text-slate-800">{String(timing)}</div>
                      <div className="text-sm text-slate-500">{String(detail)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-sm text-slate-500">
              Questions? Call us at{" "}
              <a href="tel:+18005550100" className="text-blue-600 font-medium hover:underline">
                (800) 555-0100
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function Field({
  label, error, children, className,
}: {
  label: string; error?: string; children: React.ReactNode; className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function input(error?: string) {
  return `w-full px-4 py-2.5 rounded-lg border text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
    error ? "border-red-400 bg-red-50" : "border-slate-200"
  }`;
}
