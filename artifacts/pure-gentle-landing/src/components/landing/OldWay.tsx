import { motion } from "framer-motion";
import { ShoppingCart, Droplets, Wrench, FlaskConical } from "lucide-react";

const points = [
  {
    icon: <FlaskConical className="w-6 h-6 text-sky-300" />,
    headline: "Arizona water is loaded with calcium and magnesium.",
    body: "Groundwater across the Southwest carries high levels of calcium and magnesium — the minerals that make water 'hard.' Municipal treatment adds chlorine on top of that. A basic softener handles the hardness, but it doesn't touch the chlorine that comes through the tap.",
  },
  {
    icon: <Droplets className="w-6 h-6 text-sky-300" />,
    headline: "Bottled water helps, but it adds up.",
    body: "Most families spend somewhere between $30 and $80 a month on bottled water, depending on household size. It solves the drinking water problem, but it doesn't address the rest of the water in your home.",
  },
  {
    icon: <ShoppingCart className="w-6 h-6 text-sky-300" />,
    headline: "Hard water means using more soap than you probably realize.",
    body: "When water is hard, soap doesn't lather as well. You end up using more detergent, more shampoo, more dish soap — and still dealing with spots and buildup. It's not dramatic, but over time the cost and hassle are real.",
  },
  {
    icon: <Wrench className="w-6 h-6 text-sky-300" />,
    headline: "Your pipes and appliances feel it too.",
    body: "Mineral scale builds up inside your water heater, dishwasher, and plumbing over time. It reduces efficiency and can shorten their lifespan. It's the kind of thing you don't notice until something breaks.",
  },
];

export function OldWay() {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4 md:px-6 max-w-5xl relative z-10">

        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-slate-950/60 backdrop-blur-md rounded-2xl border border-white/10 p-7 md:p-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-5">
              What most families are dealing with.
            </h2>
            <p className="text-lg text-slate-100 leading-relaxed">
              If your water leaves spots, your skin feels dry after a shower, or you buy bottled water because the tap doesn't taste right — you're not imagining it. Here's what's usually going on.
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
              className="bg-slate-950/60 backdrop-blur-md border border-white/10 rounded-2xl p-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-sky-400/10 border border-sky-300/20 flex items-center justify-center shrink-0">
                  {p.icon}
                </div>
                <div>
                  <div className="font-semibold text-white mb-2 leading-snug">{p.headline}</div>
                  <p className="text-slate-200 text-sm leading-relaxed">{p.body}</p>
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
          className="mt-12 bg-sky-400/[0.08] border border-sky-300/20 rounded-2xl p-6 md:p-8 text-center"
        >
          <p className="text-lg text-slate-200 leading-relaxed">
            None of this is unusual — it's just how most tap water works in this part of the country.{" "}
            <span className="font-semibold text-white">The question is whether there's a practical way to deal with all of it at once.</span>
          </p>
        </motion.div>

      </div>
    </section>
  );
}
