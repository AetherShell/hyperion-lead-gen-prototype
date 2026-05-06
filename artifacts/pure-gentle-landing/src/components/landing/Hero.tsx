import { motion } from "framer-motion";
import { Droplets, Phone } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-[92vh] flex items-center pt-20 pb-28 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="/hero-kitchen.png"
          alt="Modern clean kitchen"
          className="w-full h-full object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/95 via-blue-50/85 to-transparent" />
        <div className="absolute inset-0 bg-white/55 backdrop-blur-[2px]" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.05] mb-5 tracking-tight">
              Do you know what's{" "}
              <span className="text-blue-600 relative">
                in your water?
                <svg
                  className="absolute -bottom-1.5 left-0 w-full h-3 text-blue-300 opacity-70"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                >
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="none" />
                </svg>
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-700 mb-8 leading-relaxed max-w-2xl font-light">
              In much of the Southwest, tap water is loaded with calcium and magnesium — the hard minerals that calcify your fixtures, spot your shower glass, and wear down your appliances. The Hyperion Elite system removes them at the source — so every faucet in your home delivers clean, refined water.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button
                onClick={() => document.getElementById("quiz")?.scrollIntoView({ behavior: "smooth" })}
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 hover:-translate-y-0.5"
              >
                <Droplets className="mr-2 w-5 h-5 shrink-0" />
                <span className="flex flex-col items-start leading-tight text-left">
                  <span className="text-lg font-bold">See How It Works</span>
                  <span className="text-xs font-medium opacity-90">+ $25 gift card with free water test</span>
                </span>
              </button>
              <a
                href="tel:+18005550100"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl border-2 border-slate-300 text-slate-700 hover:border-blue-400 hover:text-blue-700 transition-all"
              >
                <Phone className="mr-2 w-4 h-4" />
                (800) 555-0100
              </a>
            </div>

            <div className="flex items-center gap-5 text-sm text-slate-600 font-medium">
              <span>$0 upfront</span>
              <span className="w-1 h-1 rounded-full bg-slate-400" />
              <span>Professional installation included</span>
              <span className="w-1 h-1 rounded-full bg-slate-400" />
              <span>Lifetime warranty</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
