import { motion } from "framer-motion";
import { Filter, Droplets, PackageCheck, ArrowDown } from "lucide-react";

const steps = [
  {
    icon: <Filter className="w-10 h-10 text-blue-600" />,
    tag: "Step 1 — Attack the Root Cause",
    title: "The Refiner removes what's costing you money",
    body: "Hard minerals are stripped from every drop of water entering your home. Immediately, your soap lathers the way it's supposed to. You need 80% less product to get a better result. The monthly soap run stops making sense.",
    outcome: "80% less soap needed — starting day one",
  },
  {
    icon: <Droplets className="w-10 h-10 text-cyan-500" />,
    tag: "Step 2 — Eliminate the Bottled Water Bill",
    title: "The RO system delivers purer water than bottled",
    body: "A reverse osmosis system installed under your kitchen sink removes up to 99% of contaminants — chlorine, lead, fluoride, PFAS, microplastics. The water tastes better. The $40/month on cases of bottles stops.",
    outcome: "$0/month on bottled water — forever",
  },
  {
    icon: <PackageCheck className="w-10 h-10 text-green-500" />,
    tag: "Step 3 — Lock In the Savings",
    title: "Pure & Gentle delivers 5 years of products — free",
    body: "Because your system cuts your soap needs by 80%, we can supply your household's entire cleaning and personal care needs for 5 years — included with the system. No more shopping for laundry detergent, dish soap, shampoo, or cleaners.",
    outcome: "$120/month in soap costs — gone",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">

        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-5">
              The new way
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">
              The fix isn't a better soap.<br className="hidden md:block" /> It's better water.
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Treat the source, and everything downstream changes automatically. Here's exactly how the Hyperion Elite system eliminates the costs — step by step.
            </p>
          </motion.div>
        </div>

        <div className="space-y-5">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="bg-white rounded-2xl border border-slate-200 p-7 flex gap-6 items-start">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                  {step.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">{step.tag}</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-slate-500 leading-relaxed mb-4">{step.body}</p>
                  <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 text-sm font-semibold px-3 py-1.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    {step.outcome}
                  </div>
                </div>
              </div>
              {i < steps.length - 1 && (
                <div className="flex justify-center my-1">
                  <ArrowDown className="w-5 h-5 text-slate-300" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 bg-blue-600 rounded-2xl p-7 text-white text-center"
        >
          <p className="text-xl font-semibold mb-1">The result: you spend the same $160/month.</p>
          <p className="text-blue-100">
            Except now that money builds toward owning a system — not disappearing into the drain. After 5 years, the payment stops. The soft water and soap program don't.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
