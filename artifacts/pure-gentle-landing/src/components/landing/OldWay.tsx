import { motion } from "framer-motion";
import { ShoppingCart, Droplets, Wrench, TrendingUp } from "lucide-react";

const points = [
  {
    icon: <ShoppingCart className="w-6 h-6 text-slate-500" />,
    headline: "Soap, detergent, and cleaners add up quietly.",
    body: "Most households with hard water spend around $120/month on soap products. It doesn't feel like a lot per trip — but it's $1,440 a year, and none of it addresses the root cause.",
  },
  {
    icon: <Droplets className="w-6 h-6 text-slate-500" />,
    headline: "Bottled water is convenient, but it's a recurring cost.",
    body: "Between cases of water for drinking and the fridge, families typically spend $30–80/month. That's money you spend every single month, indefinitely.",
  },
  {
    icon: <Wrench className="w-6 h-6 text-slate-500" />,
    headline: "Hard water is tough on your home, too.",
    body: "Mineral buildup reduces the efficiency of your water heater, shortens appliance lifespans, and causes scale in your pipes. It's not urgent — but the long-term cost is real.",
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-slate-500" />,
    headline: "Switching brands or buying premium products doesn't change the math.",
    body: "Hard water reduces soap's ability to lather by up to 80%. So you use more, regardless of the brand. Better soap doesn't fix a water problem.",
  },
];

export function OldWay() {
  return (
    <section className="py-24 bg-white border-t border-slate-100">
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">

        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-5">
              How most families handle hard water today.
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              There's nothing wrong with buying soap and bottled water — it's what everyone does. But when you look at the numbers over time, the pattern is worth understanding.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {points.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-slate-50 border border-slate-200 rounded-2xl p-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                  {p.icon}
                </div>
                <div>
                  <div className="font-semibold text-slate-900 mb-2 leading-snug">{p.headline}</div>
                  <p className="text-slate-500 text-sm leading-relaxed">{p.body}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 bg-blue-50 border border-blue-200 rounded-2xl p-6 md:p-8 text-center"
        >
          <p className="text-lg text-slate-800 leading-relaxed">
            None of this means you're doing anything wrong.{" "}
            <span className="font-semibold text-slate-900">It just means there might be a more practical way to handle it.</span>
          </p>
        </motion.div>

      </div>
    </section>
  );
}
