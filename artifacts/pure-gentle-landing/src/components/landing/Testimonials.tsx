import { motion } from "framer-motion";
import review1 from "@assets/Screenshot_2026-04-12_172053_1776039905038-dark.png";
import review2 from "@assets/Screenshot_2026-04-12_172116_1776039905038-dark.png";

const reviews = [
  {
    image: review1,
    alt: "Yelp review from Sophie Y.",
  },
  {
    image: review2,
    alt: "Yelp review from David M.",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-14 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-slate-950/60 backdrop-blur-md rounded-2xl border border-white/10 p-7 md:p-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">
              Families who made the switch.
            </h2>
            <p className="text-lg text-slate-100">Real households, real numbers.</p>
          </motion.div>
        </div>

        <div className="grid gap-8 max-w-4xl mx-auto">
          {reviews.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="block"
            >
              <img
                src={review.image}
                alt={review.alt}
                className="w-full rounded-xl border border-white/10 object-contain bg-black max-h-[560px]"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
