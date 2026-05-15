import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, CheckCircle, PhoneCall, ShieldCheck, ChevronRight, TestTube } from "lucide-react";
import { useLocation } from "wouter";

export function Quiz() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState(1);
  const [soapSpend, setSoapSpend] = useState<string>("120");
  const [bottledWaterSpend, setBottledWaterSpend] = useState<string>("60");
  const [consultationPulse, setConsultationPulse] = useState(false);
  const [result, setResult] = useState<null | {
    monthlySoapSpend: number;
    monthlyBottledWaterSpend: number;
    totalCurrentSpend: number;
    annualSavingsLow: number;
    annualSavingsHigh: number;
  }>(null);

  const handleCalculate = (soap?: string) => {
    const monthlySoapSpend = Number(soap ?? soapSpend ?? 0);
    const monthlyBottledWaterSpend = Number(bottledWaterSpend ?? 0);
    const totalCurrentSpend = monthlySoapSpend + monthlyBottledWaterSpend;
    const rawMonthly = Math.max(0, totalCurrentSpend - 160);
    const annualSavingsLow = Math.round(rawMonthly * 12 * 0.75);
    const annualSavingsHigh = rawMonthly * 12;
    setResult({
      monthlySoapSpend,
      monthlyBottledWaterSpend,
      totalCurrentSpend,
      annualSavingsLow,
      annualSavingsHigh,
    });
    setStep(4);
  };

  const handleConsultation = () => {
    const el = document.getElementById("consultation-form");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setConsultationPulse(true);
      window.setTimeout(() => setConsultationPulse(false), 1200);
      const firstInput = el.querySelector<HTMLInputElement>("input, select, textarea");
      window.setTimeout(() => firstInput?.focus(), 350);
    }
  };

  const handleOrder = () => {
    navigate(`/order?soap=${result?.monthlySoapSpend ?? soapSpend}&water=${result?.monthlyBottledWaterSpend ?? bottledWaterSpend}`);
  };

  const handleReset = () => {
    setStep(1);
    setSoapSpend("120");
    setBottledWaterSpend("60");
    setResult(null);
  };

  return (
    <section id="quiz" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),transparent_70%)] pointer-events-none" />
      <div className="container mx-auto px-4 md:px-6 max-w-4xl relative z-10">
        <div className="text-center mb-14 max-w-3xl mx-auto">
          <div className="bg-slate-950/60 backdrop-blur-md rounded-2xl border border-white/10 p-7 md:p-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
              See how the numbers look for your household.
            </h2>
            <p className="text-lg text-slate-100">
              Three quick questions. We'll give you a rough estimate of how your current spending compares to the system cost.
            </p>
          </div>
        </div>

        <div className="bg-slate-950/60 backdrop-blur-md rounded-3xl border border-white/10 p-6 md:p-8 shadow-2xl shadow-sky-900/20">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Do you have hard water at home?</h3>
                  <p className="text-slate-300">Signs include white spots on dishes, faucets, or shower doors — or soap that doesn't lather well.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setStep(2)} className="h-20 rounded-2xl border-2 border-white/10 bg-slate-900/50 text-white hover:border-sky-400 hover:bg-sky-400/10 transition-all font-semibold text-lg">Yes</button>
                  <button onClick={() => setStep(2)} className="h-20 rounded-2xl border-2 border-white/10 bg-slate-900/50 text-white hover:border-sky-400 hover:bg-sky-400/10 transition-all font-semibold text-lg">Not sure</button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Roughly how much do you spend on bottled water each month?</h3>
                  <p className="text-slate-300">Across the whole household — single bottles, jugs, deliveries, all of it. A rough guess is fine.</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[["0", "None"], ["30", "Around $30"], ["60", "Around $60"], ["100", "$100+"]].map(([value, label]) => (
                    <button key={value} onClick={() => { setBottledWaterSpend(value); setStep(3); }} className="h-20 rounded-2xl border-2 border-white/10 bg-slate-900/50 text-white hover:border-sky-400 hover:bg-sky-400/10 transition-all font-semibold text-lg">{label}</button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Roughly how much do you spend on soap, detergent, and cleaning products?</h3>
                  <p className="text-slate-300">Think about laundry detergent, dish soap, hand soap, shampoo, household cleaners — all of it. A rough guess is fine.</p>
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  {[ ["80", "Around $80"], ["120", "Around $120"], ["160", "$160+"] ].map(([value, label]) => (
                    <button key={value} onClick={() => { setSoapSpend(value); handleCalculate(value); }} className="h-20 rounded-2xl border-2 border-white/10 bg-slate-900/50 text-white hover:border-sky-400 hover:bg-sky-400/10 transition-all font-semibold text-lg">{label}</button>
                  ))}
                </div>
                <div className="text-center">
                  <button onClick={() => handleCalculate()} className="text-sm text-sky-300 font-semibold hover:underline">Not sure — use the average</button>
                </div>
              </motion.div>
            )}

            {step === 4 && result && (
              <motion.div key="s4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-400/15 text-emerald-300 text-sm font-semibold mb-4">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Your rough estimate
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-3">
                    You're spending roughly ${result.totalCurrentSpend}/month on soap and bottled water.
                  </h3>
                  <p className="text-slate-300 max-w-2xl mx-auto">
                    The Hyperion Elite system costs $160/month and replaces both of those expenses — including a 5-year supply of cleaning products through the Pure & Gentle program. Your actual numbers may vary.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <Stat label="Soap & cleaners" value={`~$${result.monthlySoapSpend}/mo`} />
                  <Stat label="Bottled water" value={`~$${result.monthlyBottledWaterSpend}/mo`} />
                  <Stat label="Estimated total" value={`~$${result.totalCurrentSpend}/mo`} highlight />
                </div>

                {result.annualSavingsHigh > 0 && (
                  <div className="bg-slate-950/60 backdrop-blur-md rounded-2xl border border-white/10 p-6 md:p-8 text-center">
                    <div className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Estimated net savings range, first year</div>
                    <div className="text-4xl font-bold text-sky-300 mb-2">
                      ${result.annualSavingsLow.toLocaleString()} – ${result.annualSavingsHigh.toLocaleString()}
                    </div>
                    <p className="text-slate-400 text-sm">This is a rough estimate. A free in-home water test can give you more accurate numbers for your specific situation.</p>
                  </div>
                )}

                {result.annualSavingsHigh === 0 && (
                  <div className="bg-slate-950/60 backdrop-blur-md rounded-2xl border border-white/10 p-6 md:p-8 text-center">
                    <div className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Your monthly cost stays about the same</div>
                    <div className="text-3xl font-bold text-sky-300 mb-2">~$160/month</div>
                    <p className="text-slate-400 text-sm">You'd be spending a similar amount — but building equity in a system you'll own, instead of buying consumables. Once paid off (typically 8–15 years), the ongoing cost drops significantly.</p>
                  </div>
                )}

                <div className="bg-slate-950/60 backdrop-blur-md rounded-3xl border border-white/10 p-6 md:p-8">
                  <div className="max-w-2xl mx-auto text-center mb-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-400/10 text-sky-300 text-sm font-semibold mb-4">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      What most people do next
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-3">You don't need to decide right now.</h4>
                    <p className="text-slate-300 leading-relaxed">
                      Most homeowners have questions first — and that's completely normal. A quick call or a free in-home water test is usually the best next step to see if it makes sense for your home.
                    </p>
                  </div>

                  <div className={`grid md:grid-cols-2 gap-4 transition-all ${consultationPulse ? "ring-2 ring-sky-400 ring-offset-4 ring-offset-slate-950 rounded-2xl" : ""}`}>
                    <div className="rounded-2xl border-2 border-sky-400/40 bg-sky-400/10 p-6 flex flex-col">
                      <div className="text-sm font-semibold text-sky-300 uppercase tracking-wider mb-3">Recommended</div>
                      <h5 className="text-xl font-bold text-white mb-2">Talk to a Water Specialist</h5>
                      <p className="text-slate-300 text-sm leading-relaxed mb-2 flex-grow">
                        A 20-minute call to answer your questions and help you figure out if this is right for your home. No pressure, no obligation.
                      </p>
                      <div className="flex items-start gap-2 mb-5">
                        <TestTube className="w-4 h-4 text-sky-300 shrink-0 mt-0.5" />
                        <span className="text-xs text-slate-400">Includes a free in-home water test if you'd like one.</span>
                      </div>
                      <Button onClick={handleConsultation} className="w-full h-12 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold">
                        Request a Callback
                        <PhoneCall className="w-4 h-4 ml-2" />
                      </Button>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 flex flex-col">
                      <div className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Already decided?</div>
                      <h5 className="text-xl font-bold text-white mb-2">Move Forward</h5>
                      <p className="text-slate-300 text-sm leading-relaxed mb-5 flex-grow">
                        If you've done your research and want to get started, you can go straight to the order flow and schedule installation.
                      </p>
                      <Button onClick={handleOrder} variant="outline" className="w-full h-12 rounded-xl border-white/30 text-white bg-transparent hover:bg-white/10 hover:text-white font-bold">
                        Move Forward
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={handleReset} variant="outline" className="h-14 rounded-xl border-white/30 text-white bg-transparent hover:bg-white/10 hover:text-white">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Recalculate
                  </Button>
                </div>
                <p className="text-xs text-slate-400 text-center">These estimates are based on averages and your inputs. Your actual savings depend on your specific water conditions and usage.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl border p-5 text-center ${highlight ? "bg-sky-400/10 border-sky-400/40" : "bg-slate-900/50 border-white/10"}`}>
      <div className="text-sm text-slate-400 mb-1">{label}</div>
      <div className={`text-2xl font-bold ${highlight ? "text-sky-300" : "text-white"}`}>{value}</div>
    </div>
  );
}
