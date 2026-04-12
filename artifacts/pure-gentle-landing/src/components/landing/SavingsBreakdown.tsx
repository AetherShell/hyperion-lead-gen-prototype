import { motion } from "framer-motion";
import { Check, X, PackageCheck, Droplets, Filter, Wrench } from "lucide-react";

const included = [
  { icon: <Filter className="w-4 h-4" />, item: "Whole-home water refiner", value: "Installed" },
  { icon: <Droplets className="w-4 h-4" />, item: "Under-sink reverse osmosis system", value: "Installed" },
  { icon: <PackageCheck className="w-4 h-4" />, item: "Pure & Gentle 5-year soap supply", value: "$7,200 value" },
  { icon: <Wrench className="w-4 h-4" />, item: "Professional installation", value: "Included" },
  { icon: <Check className="w-4 h-4" />, item: "1-year parts & labor warranty", value: "Included" },
  { icon: <Check className="w-4 h-4" />, item: "Annual maintenance after payoff", value: "$50/yr only" },
];

export function SavingsBreakdown() {
  return (
    <section className="py-24 bg-slate-900 text-slate-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-900 to-slate-900 pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-5xl">
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-300 text-sm font-semibold mb-5">
              The offer — here's exactly what you get
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
              You're already spending the money.<br className="hidden md:block" /> Now make it work for you.
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              The system costs $160/month — the same amount the average household spends on soap and bottled water today. You redirect existing spending. You don't add a new bill.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-8"
          >
            <div className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6">What you spend today</div>
            <div className="space-y-5 mb-8">
              {[
                ["Soap, detergent & cleaners", "$120/mo"],
                ["Bottled water", "$40/mo"],
                ["Hard water appliance damage", "Ongoing"],
                ["System payment", "$0"],
              ].map(([label, val]) => (
                <div key={String(label)} className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-slate-400">
                    <X className="w-4 h-4 text-red-500 shrink-0" />
                    <span>{label}</span>
                  </div>
                  <span className="font-semibold text-slate-200">{val}</span>
                </div>
              ))}
            </div>
            <div className="pt-5 border-t border-slate-700/50">
              <div className="flex justify-between items-baseline">
                <span className="text-slate-400">Monthly total</span>
                <span className="text-3xl font-bold text-white">$160</span>
              </div>
              <p className="text-sm text-slate-500 text-right mt-1">Gone. Nothing to show for it.</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-blue-950/40 border border-blue-700/40 rounded-2xl p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl">REDIRECTED</div>
            <div className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-6">What you spend with Hyperion Elite</div>
            <div className="space-y-5 mb-8">
              {[
                ["Soap, detergent & cleaners", "$0", "Pure & Gentle included"],
                ["Bottled water", "$0", "RO purified on tap"],
                ["Hard water damage", "$0", "Soft water protects everything"],
                ["System payment", "$160/mo", "Own it in ~5 years"],
              ].map(([label, val, note]) => (
                <div key={String(label)} className="flex justify-between items-start">
                  <div className="flex items-start gap-2 text-slate-300">
                    <Check className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                    <div>
                      <div>{label}</div>
                      <div className="text-xs text-slate-500">{note}</div>
                    </div>
                  </div>
                  <span className={`font-bold shrink-0 ml-4 ${val === "$0" ? "text-green-400" : "text-white"}`}>{val}</span>
                </div>
              ))}
            </div>
            <div className="pt-5 border-t border-blue-700/40">
              <div className="flex justify-between items-baseline">
                <span className="text-slate-300">Monthly total</span>
                <span className="text-3xl font-bold text-blue-400">$160</span>
              </div>
              <p className="text-sm text-slate-400 text-right mt-1">Building toward something you own.</p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-7"
        >
          <div className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-5">Everything included in your $160/month</div>
          <div className="grid sm:grid-cols-2 gap-3">
            {included.map(({ icon, item, value }) => (
              <div key={item} className="flex items-center justify-between gap-3 bg-slate-800/60 rounded-xl px-4 py-3">
                <div className="flex items-center gap-3 text-slate-300 text-sm">
                  <span className="text-blue-400">{icon}</span>
                  {item}
                </div>
                <span className="text-xs font-semibold text-green-400 shrink-0">{value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-8 text-center"
        >
          <p className="text-xl text-slate-300 font-light">
            After 5 years, the system is paid off and you own it outright.
            <br className="hidden md:block" />
            <strong className="text-white font-semibold">Your payment drops to $50/year. You keep saving ~$120/month — every month — forever.</strong>
          </p>
        </motion.div>

      </div>
    </section>
  );
}
