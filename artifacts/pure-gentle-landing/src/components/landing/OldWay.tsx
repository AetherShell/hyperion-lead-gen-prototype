import { motion } from "framer-motion";
import { ShoppingCart, Droplets, Wrench, FlaskConical } from "lucide-react";

const points = [
  {
    icon: <FlaskConical className="w-6 h-6 text-slate-500" />,
    headline: "Desert groundwater is some of the hardest in the country.",
    body: "Across the Southwest, tap water carries unusually high levels of calcium and magnesium — the minerals that leave white crust on faucets and showerheads, spot your dishes, and build up inside your pipes. A basic softener helps with the minerals, but most homes also deal with chlorine that comes through with municipal supply — and a softener doesn't filter that out.",
  },
  {
    icon: <Droplets className="w-6 h-6 text-slate-500" />,
    headline: "Bottled water helps, but it adds up.",
    body: "Most families spend somewhere between $30 and $80 a month on bottled water, depending on household size. It solves the drinking water problem, but it doesn't address the rest of the water in your home.",
  },
  {
    icon: <ShoppingCart className="w-6 h-6 text-slate-500" />,
    headline: "Hard water means using more soap than you probably realize.",
    body: "When water is hard, soap doesn't lather as well. You end up using more detergent, more shampoo, more dish soap — and still dealing with spots and buildup. It's not dramatic, but over time the cost and hassle are real.",
  },
  {
    icon: <Wrench className="w-6 h-6 text-slate-500" />,
    headline: "Your pipes and appliances feel it too.",
    body: "Mineral scale builds up inside your water heater, dishwasher, and plumbing over time. It reduces efficiency and can shorten their lifespan. It's the kind of thing you don't notice until something breaks.",
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
              What most families are dealing with.
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
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
            None of this is unusual — it's just how most tap water works in this part of the country.{" "}
            <span className="font-semibold text-slate-900">The question is whether there's a practical way to deal with all of it at once.</span>
          </p>
        </motion.div>

      </div>
    </section>
  );
}
