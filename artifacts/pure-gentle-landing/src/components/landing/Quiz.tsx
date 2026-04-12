import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Calculator, ArrowRight, RefreshCw, Droplets, Sparkles, CheckCircle } from "lucide-react";

const CATEGORIES = [
  {
    key: "laundry",
    label: "Laundry",
    description: "Detergent, bleach, fabric softener, dryer sheets",
    default: 35,
    max: 120,
  },
  {
    key: "skinBody",
    label: "Skin & Body Care",
    description: "Bar soap, body wash, liquid hand soap, lotion",
    default: 25,
    max: 100,
  },
  {
    key: "hairCare",
    label: "Hair Care",
    description: "Shampoo, conditioner",
    default: 20,
    max: 80,
  },
  {
    key: "dishes",
    label: "Dish Washing",
    description: "Hand dish soap, dishwasher pods or powder",
    default: 15,
    max: 60,
  },
  {
    key: "cleaners",
    label: "Household Cleaners",
    description: "All-purpose, bathroom, toilet bowl, glass cleaners",
    default: 25,
    max: 100,
  },
];

const DEFAULT_CATEGORY_VALUES: Record<string, number> = Object.fromEntries(
  CATEGORIES.map((c) => [c.key, c.default])
);

export function Quiz() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState(1);
  const [people, setPeople] = useState<number | null>(null);
  const [soapMode, setSoapMode] = useState<"quick" | "detailed">("quick");
  const [soapCost, setSoapCost] = useState<number[]>([120]);
  const [categoryValues, setCategoryValues] = useState<Record<string, number>>(DEFAULT_CATEGORY_VALUES);
  const [waterCost, setWaterCost] = useState<number[]>([40]);

  const detailedTotal = Object.values(categoryValues).reduce((a, b) => a + b, 0);
  const effectiveSoapCost = soapMode === "detailed" ? detailedTotal : soapCost[0];

  const handleNext = () => setStep((s) => s + 1);
  const handleReset = () => {
    setStep(1);
    setPeople(null);
    setSoapMode("quick");
    setSoapCost([120]);
    setCategoryValues(DEFAULT_CATEGORY_VALUES);
    setWaterCost([40]);
  };

  const annualCurrent = effectiveSoapCost * 12 + waterCost[0] * 12;
  const fiveYearCurrent = annualCurrent * 5;
  const monthlySystem = 160;
  const fiveYearSystem = monthlySystem * 12 * 5;
  const fiveYearSavings = fiveYearCurrent - fiveYearSystem;

  const totalSteps = 3;
  const progressStep = Math.min(step, totalSteps);

  return (
    <section id="quiz" className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
            Find Out Exactly What You're Spending
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Take 30 seconds to see how much your hard water is costing you in extra soap, cleaning supplies, and utilities.
          </p>
        </div>

        <Card className="border-0 shadow-xl rounded-2xl overflow-hidden bg-white relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-slate-100">
            <div
              className="h-full bg-blue-600 transition-all duration-500 ease-out"
              style={{ width: `${(progressStep / totalSteps) * 100}%` }}
            />
          </div>

          <CardContent className="p-8 md:p-12 min-h-[400px] flex flex-col justify-center">
            <AnimatePresence mode="wait">

              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="text-center space-y-2">
                    <span className="text-blue-600 font-semibold tracking-wide uppercase text-sm">
                      STEP 1 OF 3
                    </span>
                    <h3 className="text-2xl font-bold text-slate-900">
                      How many people live in your home?
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[1, 2, 3, 4, "5+"].map((num) => (
                      <button
                        key={num.toString()}
                        onClick={() => {
                          setPeople(typeof num === "string" ? 5 : num);
                          handleNext();
                        }}
                        className="h-20 rounded-xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 text-xl font-medium text-slate-700 transition-all flex items-center justify-center"
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="text-center space-y-2">
                    <span className="text-blue-600 font-semibold tracking-wide uppercase text-sm">
                      STEP 2 OF 3
                    </span>
                    <h3 className="text-2xl font-bold text-slate-900">
                      How much do you spend on soap &amp; cleaning products monthly?
                    </h3>
                    <p className="text-slate-500 text-sm">
                      Includes laundry, dish soap, shampoo, body wash, and household cleaners.
                    </p>
                  </div>

                  <div className="flex rounded-xl border border-slate-200 overflow-hidden text-sm font-medium">
                    <button
                      onClick={() => setSoapMode("quick")}
                      className={`flex-1 py-2.5 transition-colors ${
                        soapMode === "quick"
                          ? "bg-slate-900 text-white"
                          : "bg-white text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      Quick Estimate
                    </button>
                    <button
                      onClick={() => setSoapMode("detailed")}
                      className={`flex-1 py-2.5 transition-colors ${
                        soapMode === "detailed"
                          ? "bg-slate-900 text-white"
                          : "bg-white text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      Break It Down by Category
                    </button>
                  </div>

                  <AnimatePresence mode="wait">
                    {soapMode === "quick" && (
                      <motion.div
                        key="quick"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="px-6 space-y-10"
                      >
                        <div className="text-center">
                          <span className="text-5xl font-bold text-blue-600">${soapCost[0]}</span>
                          <span className="text-slate-500 ml-2">/ month</span>
                        </div>
                        <Slider
                          value={soapCost}
                          onValueChange={setSoapCost}
                          max={300}
                          min={30}
                          step={10}
                          className="[&_[role=slider]]:h-6 [&_[role=slider]]:w-6 [&_[role=slider]]:bg-blue-600 [&_[role=slider]]:border-4 [&_[role=slider]]:border-white [&_[role=slider]]:shadow-md"
                        />
                        <div className="flex justify-between text-sm font-medium text-slate-400">
                          <span>$30</span>
                          <span>$300+</span>
                        </div>
                      </motion.div>
                    )}

                    {soapMode === "detailed" && (
                      <motion.div
                        key="detailed"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="space-y-5"
                      >
                        {CATEGORIES.map((cat) => (
                          <div key={cat.key} className="bg-slate-50 rounded-xl p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-semibold text-slate-900 text-sm">{cat.label}</div>
                                <div className="text-xs text-slate-500">{cat.description}</div>
                              </div>
                              <div className="text-blue-600 font-bold text-lg min-w-[56px] text-right">
                                ${categoryValues[cat.key]}
                              </div>
                            </div>
                            <Slider
                              value={[categoryValues[cat.key]]}
                              onValueChange={([val]) =>
                                setCategoryValues((prev) => ({ ...prev, [cat.key]: val }))
                              }
                              max={cat.max}
                              min={0}
                              step={5}
                              className="[&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_[role=slider]]:bg-blue-600 [&_[role=slider]]:border-4 [&_[role=slider]]:border-white [&_[role=slider]]:shadow-md"
                            />
                            <div className="flex justify-between text-xs text-slate-400">
                              <span>$0</span>
                              <span>${cat.max}+</span>
                            </div>
                          </div>
                        ))}

                        <div className="flex items-center justify-between rounded-xl bg-blue-50 border border-blue-100 px-5 py-3">
                          <span className="text-sm font-semibold text-slate-700">Total monthly spend</span>
                          <span className="text-2xl font-bold text-blue-600">${detailedTotal}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex justify-center">
                    <Button
                      onClick={handleNext}
                      size="lg"
                      className="w-full sm:w-auto px-12 h-14 rounded-xl text-lg bg-slate-900 hover:bg-slate-800"
                    >
                      Continue <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-10"
                >
                  <div className="text-center space-y-2">
                    <span className="text-blue-600 font-semibold tracking-wide uppercase text-sm">
                      STEP 3 OF 3
                    </span>
                    <h3 className="text-2xl font-bold text-slate-900">
                      How much is your monthly water bill?
                    </h3>
                    <p className="text-slate-500 text-sm">Estimate if you're not entirely sure.</p>
                  </div>

                  <div className="px-6 space-y-12">
                    <div className="text-center">
                      <span className="text-5xl font-bold text-blue-600">${waterCost[0]}</span>
                      <span className="text-slate-500 ml-2">/ month</span>
                    </div>
                    <Slider
                      value={waterCost}
                      onValueChange={setWaterCost}
                      max={150}
                      min={20}
                      step={5}
                      className="[&_[role=slider]]:h-6 [&_[role=slider]]:w-6 [&_[role=slider]]:bg-blue-600 [&_[role=slider]]:border-4 [&_[role=slider]]:border-white [&_[role=slider]]:shadow-md"
                    />
                    <div className="flex justify-between text-sm font-medium text-slate-400">
                      <span>$20</span>
                      <span>$150+</span>
                    </div>
                  </div>

                  <div className="flex justify-center mt-8">
                    <Button
                      onClick={handleNext}
                      size="lg"
                      className="w-full sm:w-auto px-12 h-14 rounded-xl text-lg bg-blue-600 hover:bg-blue-700"
                    >
                      Calculate Savings <Calculator className="ml-2 w-5 h-5" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="space-y-8"
                >
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-6">
                      <Sparkles className="w-8 h-8" />
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900 mb-2">
                      Here is your savings potential
                    </h3>
                    {soapMode === "detailed" && (
                      <p className="text-sm text-slate-500">Based on your category breakdown of ${detailedTotal}/mo in soap &amp; cleaning products</p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 relative">
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-100 border-4 border-white hidden md:flex items-center justify-center z-10 text-slate-400 font-bold text-sm">
                      VS
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                      <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
                        Doing Nothing
                      </h4>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Soap &amp; Cleaning</span>
                          <span className="font-medium">${effectiveSoapCost}/mo</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Water Bill</span>
                          <span className="font-medium">${waterCost[0]}/mo</span>
                        </div>
                        <div className="pt-4 border-t border-slate-200">
                          <div className="text-sm text-slate-500 mb-1">5-Year Total Cost</div>
                          <div className="text-3xl font-bold text-slate-800">
                            ${fiveYearCurrent.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-600 rounded-2xl p-6 border border-blue-500 text-white shadow-lg relative overflow-hidden">
                      <div className="absolute -right-10 -top-10 text-blue-500 opacity-20">
                        <Droplets className="w-40 h-40" />
                      </div>
                      <h4 className="text-sm font-semibold text-blue-200 uppercase tracking-wider mb-4 relative z-10">
                        With Hyperion Elite
                      </h4>
                      <div className="space-y-4 relative z-10">
                        <div className="flex justify-between items-center">
                          <span className="text-blue-100 flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" /> Pure &amp; Gentle Soap Program
                          </span>
                          <span className="font-bold text-green-300">$0/mo</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-blue-100">System Payment</span>
                          <span className="font-medium">$160/mo</span>
                        </div>
                        <div className="pt-4 border-t border-blue-500/50">
                          <div className="text-sm text-blue-200 mb-1">5-Year Total Cost</div>
                          <div className="text-3xl font-bold text-white">
                            ${fiveYearSystem.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-2xl p-6 border border-green-100 text-center">
                    <div className="text-green-800 text-lg font-medium mb-1">You could save</div>
                    <div className="text-5xl font-extrabold text-green-600 tracking-tight">
                      ${fiveYearSavings > 0 ? fiveYearSavings.toLocaleString() : "0"}
                    </div>
                    <div className="text-green-700/80 text-sm mt-2 font-medium">
                      Over the next 5 years — and then the system is paid off
                    </div>
                  </div>

                  {soapMode === "detailed" && (
                    <div className="bg-slate-50 rounded-xl border border-slate-200 p-5">
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                        Your Breakdown
                      </div>
                      <div className="space-y-2">
                        {CATEGORIES.map((cat) => (
                          <div key={cat.key} className="flex justify-between text-sm">
                            <span className="text-slate-600">{cat.label}</span>
                            <span className="font-medium text-slate-800">${categoryValues[cat.key]}/mo</span>
                          </div>
                        ))}
                        <div className="flex justify-between text-sm font-semibold border-t border-slate-200 pt-2 mt-2">
                          <span className="text-slate-700">Total Soap &amp; Cleaning</span>
                          <span className="text-blue-600">${detailedTotal}/mo</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col items-center gap-4 pt-4">
                    <Button
                      onClick={() =>
                        navigate(`/order?soap=${effectiveSoapCost}&water=${waterCost[0]}`)
                      }
                      size="lg"
                      className="w-full sm:w-auto px-12 h-16 rounded-xl text-xl bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-600/20 transition-all hover:-translate-y-1"
                    >
                      Get Started — Order Online
                    </Button>
                    <button
                      onClick={handleReset}
                      className="text-slate-500 hover:text-slate-700 text-sm flex items-center gap-2 font-medium transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" /> Recalculate
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
