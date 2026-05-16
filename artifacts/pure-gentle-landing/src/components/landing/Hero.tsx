import { motion } from "framer-motion";
import { Gift, Phone, Star } from "lucide-react";

/**
 * Hero copy block. The faucet image is rendered at the page level (see PageBackdrop
 * in Home.tsx) so the water column can continue flowing through subsequent sections
 * without a hard cut at the hero boundary.
 */
export function Hero() {
  return (
    <section className="relative min-h-[100vh] flex items-center pt-24 pb-20 overflow-hidden">
      {/* Left-side darkening gradient so copy stays legible over the photo behind */}
      <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-r from-[#020617]/92 via-[#020617]/70 to-[#020617]/10" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-slate-950/60 backdrop-blur-md rounded-2xl border border-white/10 p-6 md:p-8 mb-8">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.04] mb-5 tracking-tight">
                Do you know what's{" "}
                <span className="text-sky-300 relative">
                  in your water?
                  <svg
                    className="absolute -bottom-1.5 left-0 w-full h-3 text-sky-400/70"
                    viewBox="0 0 100 10"
                    preserveAspectRatio="none"
                  >
                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="none" />
                  </svg>
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-white leading-relaxed font-light max-w-xl">
                In much of the Southwest, tap water is loaded with calcium and magnesium — the hard minerals that spot your shower glass, calcify your fixtures, and reduce soap performance — plus chlorine from the municipal supply. The Hyperion Elite system removes them at the source, so every faucet in your home delivers clean, refined water.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <button
                onClick={() => document.getElementById("schedule")?.scrollIntoView({ behavior: "smooth" })}
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-xl bg-slate-900/80 backdrop-blur border border-sky-400/30 text-white hover:bg-slate-800/90 hover:border-sky-300/60 transition-all shadow-lg shadow-sky-500/10 hover:shadow-sky-400/30 hover:-translate-y-0.5"
              >
                <Gift className="mr-2 w-5 h-5 text-sky-300" />
                Get a Free Water Test + $25 Gift Card
              </button>
              <a
                href="tel:+14808497274"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl border-2 border-white/30 text-white hover:border-sky-300 hover:text-sky-200 transition-all bg-white/5 backdrop-blur"
              >
                <Phone className="mr-2 w-4 h-4" />
                (480) 849-7274
              </a>
            </div>

            <div className="flex items-start gap-3 mb-6 max-w-xl">
              <div className="flex gap-0.5 shrink-0 mt-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3.5 h-3.5 fill-[#d32323] text-[#d32323]" />
                ))}
              </div>
              <p className="text-sm text-slate-300 leading-snug">
                <span className="font-semibold text-white">"The difference was amazing — we will never go back to hard water."</span>{" "}
                — David M. · <span className="text-slate-400">Verified Yelp review</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white font-semibold mb-3">
              <span>$0 upfront</span>
              <span className="w-1 h-1 rounded-full bg-slate-400/70" />
              <span>Professional installation included</span>
              <span className="w-1 h-1 rounded-full bg-slate-400/70" />
              <span>Lifetime warranty</span>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <p className="text-xs text-slate-400">
                *Must complete the in-home water test and consultation to qualify. Subject to availability.
              </p>
              <span className="text-slate-500">·</span>
              <button
                onClick={() => document.getElementById("quiz")?.scrollIntoView({ behavior: "smooth" })}
                className="text-xs text-sky-300 hover:text-sky-200 hover:underline whitespace-nowrap"
              >
                See how the numbers look for your household →
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
