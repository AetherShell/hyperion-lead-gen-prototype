import { motion } from "framer-motion";
import { Filter, Droplets, PackageCheck, ArrowDown } from "lucide-react";

const steps = [
  {
    icon: <Filter className="w-10 h-10 text-sky-300" />,
    tag: "Step 1",
    title: "Refine the water at the source — not just soften it",
    body: "A water refiner does everything a softener does — removes hard minerals so soap works properly, your skin feels better, and your plumbing stays clean. But it goes further. It also filters out chemicals like chlorine, arsenic, and uranium that are common in Southwest groundwater. A basic softener can't do that.",
    outcome: "Soft water + chemical filtration in one system",
  },
  {
    icon: <Droplets className="w-10 h-10 text-cyan-300" />,
    tag: "Step 2",
    title: "Replace bottled water with purified water on tap",
    body: "A reverse osmosis system installs under your kitchen sink and filters out up to 99.9% of remaining contaminants — lead, fluoride, microplastics, and PFAS. The water tastes clean and pure. Most families stop buying bottles within the first week.",
    outcome: "No more monthly bottled water costs",
  },
  {
    icon: <PackageCheck className="w-10 h-10 text-emerald-300" />,
    tag: "Step 3",
    title: "Get your soap and cleaning products included",
    body: "Because refined water reduces how much product you need, our partner Pure & Gentle provides a 5-year supply of household cleaners, laundry detergent, dish soap, shampoo, and personal care products — included with the system. You stop buying them at the store.",
    outcome: "5-year soap supply included",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl relative z-10">

        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-slate-950/60 backdrop-blur-md rounded-2xl border border-white/10 p-7 md:p-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
              One system that handles all of it.
            </h2>
            <p className="text-lg text-slate-100">
              Instead of buying soap, bottled water, and dealing with hard water damage separately, the Hyperion Elite system addresses the root cause — so the downstream problems take care of themselves.
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
              <div className="bg-slate-950/60 backdrop-blur-md rounded-2xl border border-white/10 p-7 flex gap-6 items-start">
                <div className="w-16 h-16 rounded-2xl bg-sky-400/10 border border-sky-300/20 flex items-center justify-center shrink-0">
                  {step.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-sky-300 uppercase tracking-wider mb-1">{step.tag}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-slate-200 leading-relaxed mb-4">{step.body}</p>
                  <div className="inline-flex items-center gap-2 bg-emerald-400/10 border border-emerald-300/30 text-emerald-200 text-sm font-medium px-3 py-1.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                    {step.outcome}
                  </div>
                </div>
              </div>
              {i < steps.length - 1 && (
                <div className="flex justify-center my-1">
                  <ArrowDown className="w-5 h-5 text-white/30" />
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
          className="mt-10 bg-sky-500 rounded-2xl p-7 text-white text-center shadow-lg shadow-sky-500/20"
        >
          <p className="text-xl font-semibold mb-1">The system costs $160/month, financed typically over 8–15 years.</p>
          <p className="text-sky-100">
            Your money goes toward owning something — not replacing consumables every month. Once it's paid off, you own it outright.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
