import { motion } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
  {
    name: "Sarah Jenkins",
    location: "Austin, TX",
    savings: "$145/month",
    before: "I was spending $150 a month on soap products and thought that was just normal.",
    text: "We haven't bought laundry detergent, dish soap, or body wash in three years. My daughter's eczema completely cleared up within a month of soft water. I kept waiting for the catch. There wasn't one — the math just works.",
  },
  {
    name: "Michael & Elena Torres",
    location: "Phoenix, AZ",
    savings: "$180/month",
    before: "We thought a water softener was a luxury. We were wrong about what it actually does.",
    text: "We used to buy three cases of bottled water a week and easily spent $150 on cleaning supplies for our family of six. The RO water tastes better than anything we bought at the store, and we haven't set foot in the cleaning aisle since installation.",
  },
  {
    name: "David Chen",
    location: "Denver, CO",
    savings: "$110/month",
    before: "As an engineer, I was skeptical. So I spent two weeks running the numbers myself.",
    text: "The monthly payment replaces money we were already spending at the grocery store. Dollar for dollar, it's a break-even from day one — and after the system is paid off, we save over a hundred dollars a month for the rest of our lives. It was the easiest financial decision I've ever made.",
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
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 text-sm font-semibold mb-5">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />)}
              <span className="ml-1">4.9 from 200+ installations</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3">
              They thought it was too good to be true.
            </h2>
            <p className="text-lg text-slate-600">Then they did the math.</p>
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
              <p className="text-sm font-semibold text-slate-500 italic mb-3">"{review.before}"</p>
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
