import { motion } from "framer-motion";
import { Droplet, CircleDollarSign, CheckCircle2 } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 pb-32 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="/hero-kitchen.png" 
          alt="Modern clean kitchen" 
          className="w-full h-full object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/90 via-blue-50/80 to-transparent mix-blend-multiply" />
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px]" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-6">
              <Droplet className="w-4 h-4" />
              <span>Smarter water for your home</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-tight mb-6 tracking-tight">
              Is your hard water secretly costing you <span className="text-blue-600 relative">
                $1,920 a year?
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-blue-300 opacity-60" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="none" />
                </svg>
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-700 mb-8 leading-relaxed max-w-2xl font-light">
              Stop throwing money down the drain. A Pure & Gentle system gives you luxurious soft water and pure drinking water while eliminating your household soap and cleaning costs.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => document.getElementById('quiz')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Calculate Your Savings
                <CircleDollarSign className="ml-2 w-5 h-5" />
              </button>
            </div>

            <div className="mt-10 flex items-center gap-6 text-sm text-slate-600 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-500" />
                <span>$0 Upfront</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-500" />
                <span>Free Installation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-500" />
                <span>Lifetime Warranty</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
