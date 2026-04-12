import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, RotateCcw, CheckCircle, Sparkles } from "lucide-react";
import { useLocation } from "wouter";

export function Quiz() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState(1);
  const [soapSpend, setSoapSpend] = useState<string>("120");
  const [bottledWaterSpend, setBottledWaterSpend] = useState<string>("40");
  const [hasHardWater, setHasHardWater] = useState<boolean | null>(null);
  const [result, setResult] = useState<null | {
    monthlySoapSpend: number;
    monthlyBottledWaterSpend: number;
    totalCurrentSpend: number;
    annualSavings: number;
    fiveYearSavings: number;
  }>(null);

  const handleCalculate = () => {
    const monthlySoapSpend = Number(soapSpend || 0);
    const monthlyBottledWaterSpend = Number(bottledWaterSpend || 0);
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
    navigate(`/order?soap=${soapSpend}&water=${bottledWaterSpend}`);
  };

  const handleReset = () => {
    setStep(1);
    setHasHardWater(null);
    setSoapSpend("120");
    setBottledWaterSpend("40");
    setResult(null);
  };

  return (
    <section id="quiz" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.08),transparent_70%)] pointer-events-none" />
      <div className="container mx-auto px-4 md:px-6 max-w-4xl relative z-10">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            30-second savings estimate
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">
            See what you're already spending on soap and bottled water.
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            A few quick answers and we'll show you how much of that money the Hyperion Elite system can replace.
          </p>
        </div>

        <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Do you have hard water at home?</h3>
                  <p className="text-slate-600">If your faucets leave spots or soap doesn't lather well, the answer is probably yes.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => { setHasHardWater(true); setStep(2); }} className="h-20 rounded-2xl border-2 border-slate-200 bg-white hover:border-blue-500 hover:bg-blue-50 transition-all font-semibold text-lg">Yes</button>
                  <button onClick={() => { setHasHardWater(false); setStep(2); }} className="h-20 rounded-2xl border-2 border-slate-200 bg-white hover:border-blue-500 hover:bg-blue-50 transition-all font-semibold text-lg">Not sure</button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">How much do you spend on bottled water each month?</h3>
                  <p className="text-slate-600">This is the money we can potentially replace with purified water on tap.</p>
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  {[ ["20", "$20"], ["40", "$40"], ["80", "$80+"] ].map(([value, label]) => (
                    <button key={value} onClick={() => { setBottledWaterSpend(value); setStep(3); }} className="h-20 rounded-2xl border-2 border-slate-200 bg-white hover:border-blue-500 hover:bg-blue-50 transition-all font-semibold text-lg">{label}</button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">How much do you spend on soap, detergent, and cleaners?</h3>
                  <p className="text-slate-600">Most families with hard water spend far more than they realize.</p>
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  {["80", "120", "160"].map(value => (
                    <button key={value} onClick={() => { setSoapSpend(value); handleCalculate(); }} className="h-20 rounded-2xl border-2 border-slate-200 bg-white hover:border-blue-500 hover:bg-blue-50 transition-all font-semibold text-lg">${value}</button>
                  ))}
                </div>
                <div className="text-center">
                  <button onClick={handleCalculate} className="text-sm text-blue-600 font-semibold hover:underline">Skip and see my estimate</button>
                </div>
              </motion.div>
            )}

            {step === 4 && result && (
              <motion.div key="s4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-semibold mb-4">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Here's your estimated savings
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-3">You may be spending ${result.totalCurrentSpend}/month on bottled water and soap today.</h3>
                  <p className="text-slate-600 max-w-2xl mx-auto">The Hyperion Elite system replaces that spending with one monthly payment of $160, plus the included Pure & Gentle program.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <Stat label="Soap & cleaners" value={`$${result.monthlySoapSpend}`} />
                  <Stat label="Bottled water" value={`$${result.monthlyBottledWaterSpend}`} />
                  <Stat label="Total current spend" value={`$${result.totalCurrentSpend}`} />
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 text-center">
                  <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Estimated first-year savings</div>
                  <div className="text-5xl font-bold text-blue-600 mb-2">${result.annualSavings.toLocaleString()}</div>
                  <p className="text-slate-600">Over 5 years, that can add up to ${result.fiveYearSavings.toLocaleString()} in redirected spend.</p>
                </div>

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
                <p className="text-xs text-slate-400 text-center">Takes 5 minutes online. No sales call required.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center">
      <div className="text-sm text-slate-500 mb-1">{label}</div>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
    </div>
  );
}
