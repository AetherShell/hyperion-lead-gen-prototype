import { motion } from "framer-motion";
import { Filter, Droplets, PackageCheck, ArrowDown } from "lucide-react";

const steps = [
  {
    icon: <Filter className="w-10 h-10 text-blue-600" />,
    tag: "Step 1",
    title: "Refine the water at the source — not just soften it",
    body: "A water refiner does everything a softener does — removes hard minerals so soap works properly, your skin feels better, and your plumbing stays clean. But it goes further. It also filters out chemicals like chlorine, arsenic, and uranium that are common in Southwest groundwater. A basic softener can't do that. In desert areas, a refiner is what's needed for the safest possible water throughout your home.",
    outcome: "Soft water + chemical filtration in one system",
  },
  {
    icon: <Droplets className="w-10 h-10 text-cyan-500" />,
    tag: "Step 2",
    title: "Replace bottled water with purified water on tap",
    body: "A reverse osmosis system installs under your kitchen sink and filters out up to 99% of remaining contaminants — lead, fluoride, microplastics, and PFAS. The water tastes clean and pure. Most families stop buying bottles within the first week.",
    outcome: "No more monthly bottled water costs",
  },
  {
    icon: <PackageCheck className="w-10 h-10 text-green-500" />,
    tag: "Step 3",
    title: "Get your soap and cleaning products included",
    body: "Because refined water reduces how much product you need, our partner Pure & Gentle provides a 5-year supply of household cleaners, laundry detergent, dish soap, shampoo, and personal care products — included with the system. You stop buying them at the store.",
    outcome: "5-year soap supply included",
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
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">
              A simpler approach: treat the water, not the symptoms.
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Instead of spending more on soap and bottled water, the Hyperion Elite system addresses the root cause — hard, unfiltered water — so the downstream costs take care of themselves.
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
                  <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 text-sm font-medium px-3 py-1.5 rounded-full">
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
          <p className="text-xl font-semibold mb-1">The monthly cost stays the same: $160.</p>
          <p className="text-blue-100">
            The difference is that now your money goes toward owning something — not replacing consumables every month. After about 5 years, the system is paid off and yours to keep.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
