import { motion } from "framer-motion";
import { TrendingUp, AlertTriangle, ShoppingCart, Frown } from "lucide-react";

const problems = [
  {
    icon: <ShoppingCart className="w-6 h-6 text-red-500" />,
    headline: "You buy more soap. It still doesn't work as well.",
    body: "Hard water minerals bind to soap molecules before they can lather. So you add more — and still get a fraction of the clean you're paying for. Soap companies have known this for decades. They've never mentioned it.",
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-red-500" />,
    headline: "You've spent over $7,200 on soap in the last 5 years.",
    body: "The average household with hard water spends $120/month on soap, laundry detergent, and cleaning products. That's $1,440 a year. $7,200 every five years. Every dollar is gone the moment you use it.",
  },
  {
    icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
    headline: "Your pipes, appliances, and water heater are paying the price too.",
    body: "Scale buildup from hard water makes your water heater work up to 30% harder. It shortens the lifespan of every appliance that touches water in your home. The damage is invisible — until a $2,000 repair bill isn't.",
  },
  {
    icon: <Frown className="w-6 h-6 text-red-500" />,
    headline: "Premium soap, 'concentrated' formulas, filtered pitchers — none of it fixes the source.",
    body: "You've probably tried switching detergents, buying purified water, or installing a pitcher filter. These are band-aids. They address the symptoms. Not one of them touches the water that's causing all of it.",
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
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-100 text-red-700 text-sm font-semibold mb-5">
              <AlertTriangle className="w-3.5 h-3.5" />
              Why nothing you've tried has worked
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-5">
              The soap industry has been profiting from your hard water for decades.
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Hard water forces you to use 2–3x more soap to get the same result. Every time you run out and buy more, the cycle resets. Switching brands doesn't help. Buying "concentrated" doesn't help. The problem isn't the soap — it's your water.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {problems.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-slate-50 border border-slate-200 rounded-2xl p-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
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
          className="mt-12 bg-amber-50 border border-amber-200 rounded-2xl p-6 md:p-8 text-center"
        >
          <p className="text-lg text-amber-900 font-medium leading-relaxed">
            This isn't a budgeting problem. It's a water problem.<br className="hidden md:block" />
            <span className="text-amber-700 font-semibold">And water problems have a permanent fix.</span>
          </p>
        </motion.div>

      </div>
    </section>
  );
}
