import { motion } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
  {
    name: "Sarah Jenkins",
    location: "Austin, TX",
    savings: "$145/mo",
    text: "I honestly wasn't sure how much we spent on soap until I tracked it for a month. It was over $140. We've had the system for three years now and haven't bought laundry detergent, dish soap, or body wash once. My daughter's eczema cleared up too — I think the soft water helped.",
  },
  {
    name: "Michael & Elena Torres",
    location: "Phoenix, AZ",
    savings: "$180/mo",
    text: "We were buying three cases of bottled water a week for a family of six. When we saw the RO system side-by-side with what we were spending, it was a straightforward decision. The water tastes cleaner than anything we bought at the store.",
  },
  {
    name: "David Chen",
    location: "Denver, CO",
    savings: "$110/mo",
    text: "I'm an engineer, so I ran the numbers myself before signing anything. The monthly payment essentially replaces what we were already spending at the grocery store. After the system is paid off, that money stays in our pocket. It was an easy decision.",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">

        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3">
              Families who made the switch.
            </h2>
            <p className="text-lg text-slate-600">Real households, real numbers.</p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-7 max-w-6xl mx-auto">
          {reviews.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm flex flex-col"
            >
              <div className="flex gap-1 mb-4">
                {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-slate-700 leading-relaxed flex-grow mb-6">"{review.text}"</p>
              <div className="pt-5 border-t border-slate-100 flex justify-between items-end">
                <div>
                  <div className="font-semibold text-slate-900">{review.name}</div>
                  <div className="text-sm text-slate-500">{review.location}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-green-600 font-bold uppercase tracking-wide">Saving</div>
                  <div className="font-bold text-slate-900">{review.savings}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
