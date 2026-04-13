import { motion } from "framer-motion";
import { Star, ExternalLink } from "lucide-react";
import review1 from "@assets/Screenshot_2026-04-12_172053_1776039905038.png";
import review2 from "@assets/Screenshot_2026-04-12_172116_1776039905038.png";
import review3 from "@assets/Screenshot_2026-04-12_172312_1776039905038.png";

const reviews = [
  {
    image: review1,
    alt: "Yelp review from Sophie Y. in Phoenix, AZ",
  },
  {
    image: review2,
    alt: "Yelp review from David M. in Everett, WA",
  },
  {
    image: review3,
    alt: "Yelp review from Eileen L. in Dublin, CA",
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

        <div className="grid gap-8 max-w-4xl mx-auto">
          {reviews.map((review, i) => (
            <motion.a
              key={i}
              href={review.image}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group block bg-white border border-slate-200 p-4 md:p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-slate-500 group-hover:text-blue-600 transition-colors">
                  <span>Open full size</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </div>
              <img src={review.image} alt={review.alt} className="w-full rounded-xl border border-slate-200 object-contain bg-white max-h-[560px]" />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
