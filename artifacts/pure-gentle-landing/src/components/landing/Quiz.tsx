import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, RotateCcw, CheckCircle } from "lucide-react";
import { useLocation } from "wouter";

export function Quiz() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState(1);
  const [soapSpend, setSoapSpend] = useState<string>("120");
  const [bottledWaterSpend, setBottledWaterSpend] = useState<string>("40");
  const [result, setResult] = useState<null | {
    monthlySoapSpend: number;
    monthlyBottledWaterSpend: number;
    totalCurrentSpend: number;
    annualSavings: number;
    fiveYearSavings: number;
  }>(null);

  const handleCalculate = (soap?: string) => {
    const monthlySoapSpend = Number(soap ?? soapSpend ?? 0);
    const monthlyBottledWaterSpend = Number(bottledWaterSpend ?? 0);
    const totalCurrentSpend = monthlySoapSpend + monthlyBottledWaterSpend;
    const annualSavings = Math.max(0, totalCurrentSpend - 160) * 12;
    const fiveYearSavings = annualSavings * 5;
    setResult({
      monthlySoapSpend,
      monthlyBottledWaterSpend,
      totalCurrentSpend,
      annualSavings,
      fiveYearSavings,
    });
    setStep(4);
  };

  const handleOrder = () => {
    navigate(`/order?soap=${result?.monthlySoapSpend ?? soapSpend}&water=${result?.monthlyBottledWaterSpend ?? bottledWaterSpend}`);
  };

  const handleReset = () => {
    setStep(1);
    setSoapSpend("120");
    setBottledWaterSpend("40");
    setResult(null);
  };

  return (
    <section id="quiz" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.08),transparent_70%)] pointer-events-none" />
      <div className="container mx-auto px-4 md:px-6 max-w-4xl relative z-10">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">
            Run the numbers for your household.
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Three quick questions. We'll show you how your current spending compares to the system cost — so you can decide if it makes sense.
          </p>
        </div>

        <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Do you have hard water at home?</h3>
                  <p className="text-slate-600">Signs include white spots on dishes, faucets, or shower doors — or soap that doesn't lather well.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setStep(2)} className="h-20 rounded-2xl border-2 border-slate-200 bg-white hover:border-blue-500 hover:bg-blue-50 transition-all font-semibold text-lg">Yes</button>
                  <button onClick={() => setStep(2)} className="h-20 rounded-2xl border-2 border-slate-200 bg-white hover:border-blue-500 hover:bg-blue-50 transition-all font-semibold text-lg">Not sure</button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Roughly how much do you spend on bottled water each month?</h3>
                  <p className="text-slate-600">Include cases, delivery services, or fridge refills — whatever applies.</p>
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  {[["20", "$20 or less"], ["40", "Around $40"], ["80", "$80+"]].map(([value, label]) => (
                    <button key={value} onClick={() => { setBottledWaterSpend(value); setStep(3); }} className="h-20 rounded-2xl border-2 border-slate-200 bg-white hover:border-blue-500 hover:bg-blue-50 transition-all font-semibold text-lg">{label}</button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">How much do you spend on soap, detergent, and cleaning products?</h3>
                  <p className="text-slate-600">Think about laundry detergent, dish soap, hand soap, shampoo, household cleaners — all of it.</p>
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  {[["80", "Around $80"], ["120", "Around $120"], ["160", "$160+"]].map(([value, label]) => (
                    <button key={value} onClick={() => { setSoapSpend(value); handleCalculate(value); }} className="h-20 rounded-2xl border-2 border-slate-200 bg-white hover:border-blue-500 hover:bg-blue-50 transition-all font-semibold text-lg">{label}</button>
                  ))}
                </div>
                <div className="text-center">
                  <button onClick={() => handleCalculate()} className="text-sm text-blue-600 font-semibold hover:underline">Not sure — use the average</button>
                </div>
              </motion.div>
            )}

            {step === 4 && result && (
              <motion.div key="s4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-semibold mb-4">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Your estimate is ready
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-3">
                    You're spending roughly ${result.totalCurrentSpend}/month on soap and bottled water.
                  </h3>
                  <p className="text-slate-600 max-w-2xl mx-auto">
                    The Hyperion Elite system costs $160/month and replaces both of those expenses — including a 5-year supply of cleaning products through the Pure & Gentle program.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <Stat label="Soap & cleaners" value={`$${result.monthlySoapSpend}/mo`} />
                  <Stat label="Bottled water" value={`$${result.monthlyBottledWaterSpend}/mo`} />
                  <Stat label="Your total" value={`$${result.totalCurrentSpend}/mo`} highlight />
                </div>

                {result.annualSavings > 0 && (
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 text-center">
                    <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Estimated net savings, first year</div>
                    <div className="text-5xl font-bold text-blue-600 mb-2">${result.annualSavings.toLocaleString()}</div>
                    <p className="text-slate-500 text-sm">After the system is paid off (~5 years), you save the full ${result.totalCurrentSpend}/month going forward.</p>
                  </div>
                )}

                {result.annualSavings === 0 && (
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 text-center">
                    <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Your monthly cost stays the same</div>
                    <div className="text-3xl font-bold text-blue-600 mb-2">$160/month</div>
                    <p className="text-slate-500 text-sm">You spend the same amount — but now you're building equity in a system you'll own. After ~5 years, the payment stops and you save ${result.totalCurrentSpend}/month going forward.</p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={handleOrder} className="flex-1 h-14 text-lg rounded-xl bg-blue-600 hover:bg-blue-700">
                    Get Started — Order Online
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button onClick={handleReset} variant="outline" className="h-14 rounded-xl">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Recalculate
                  </Button>
                </div>
                <p className="text-xs text-slate-400 text-center">Takes about 5 minutes. No sales call required unless you want one.</p>
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
    <div className={`rounded-2xl border p-5 text-center ${highlight ? "bg-blue-50 border-blue-200" : "bg-white border-slate-200"}`}>
      <div className="text-sm text-slate-500 mb-1">{label}</div>
      <div className={`text-2xl font-bold ${highlight ? "text-blue-700" : "text-slate-900"}`}>{value}</div>
    </div>
  );
}
