import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

export function SavingsBreakdown() {
  return (
    <section className="py-24 bg-slate-900 text-slate-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-900 to-slate-900"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">The Math Makes Sense</h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">See how reallocating your existing expenses pays for the system, leaving you with better water and extra cash in your pocket.</p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-3xl overflow-hidden backdrop-blur-sm">
          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-700/50">
            {/* Status Quo */}
            <div className="p-8 md:p-12">
              <h3 className="text-xl font-semibold text-slate-300 mb-8 uppercase tracking-wider text-center">Average Family (Status Quo)</h3>
              
              <ul className="space-y-6 mb-8">
                <li className="flex justify-between items-center text-lg">
                  <span className="text-slate-400">Monthly Soap & Cleaners</span>
                  <span className="font-semibold text-slate-200">$120</span>
                </li>
                <li className="flex justify-between items-center text-lg">
                  <span className="text-slate-400">Bottled Water</span>
                  <span className="font-semibold text-slate-200">$40</span>
                </li>
                <li className="flex justify-between items-center text-lg">
                  <span className="text-slate-400">System Payment</span>
                  <span className="font-semibold text-slate-200">$0</span>
                </li>
              </ul>

              <div className="pt-6 border-t border-slate-700/50">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-slate-400">Total Monthly Cost</span>
                  <span className="text-3xl font-bold text-white">$160</span>
                </div>
                <p className="text-sm text-slate-500 text-right">Money gone forever.</p>
              </div>

              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-3 text-slate-500 text-sm">
                  <X className="w-4 h-4 text-red-500/80" /> Hard water damage to pipes
                </div>
                <div className="flex items-center gap-3 text-slate-500 text-sm">
                  <X className="w-4 h-4 text-red-500/80" /> Dry skin and brittle hair
                </div>
                <div className="flex items-center gap-3 text-slate-500 text-sm">
                  <X className="w-4 h-4 text-red-500/80" /> Constant soap shopping
                </div>
              </div>
            </div>

            {/* With P&G */}
            <div className="p-8 md:p-12 bg-blue-950/20 relative">
              <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-bl-lg">SMART CHOICE</div>
              <h3 className="text-xl font-semibold text-blue-400 mb-8 uppercase tracking-wider text-center">With Pure & Gentle</h3>
              
              <ul className="space-y-6 mb-8">
                <li className="flex justify-between items-center text-lg">
                  <span className="text-slate-300">Monthly Soap & Cleaners</span>
                  <span className="font-bold text-green-400">$0 <span className="text-xs text-green-400/80 ml-1">(Covered)</span></span>
                </li>
                <li className="flex justify-between items-center text-lg">
                  <span className="text-slate-300">Bottled Water</span>
                  <span className="font-bold text-green-400">$0 <span className="text-xs text-green-400/80 ml-1">(RO Purified)</span></span>
                </li>
                <li className="flex justify-between items-center text-lg">
                  <span className="text-slate-300">System Payment <span className="text-xs text-slate-500 block">Own it in ~5 yrs</span></span>
                  <span className="font-semibold text-white">$160</span>
                </li>
              </ul>

              <div className="pt-6 border-t border-slate-700/50">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-slate-300">Total Monthly Cost</span>
                  <span className="text-3xl font-bold text-blue-400">$160</span>
                </div>
                <p className="text-sm text-slate-400 text-right">Building equity in your home.</p>
              </div>

              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-3 text-slate-300 text-sm">
                  <Check className="w-4 h-4 text-green-400" /> Luxurious soft water
                </div>
                <div className="flex items-center gap-3 text-slate-300 text-sm">
                  <Check className="w-4 h-4 text-green-400" /> Pure drinking water on tap
                </div>
                <div className="flex items-center gap-3 text-slate-300 text-sm">
                  <Check className="w-4 h-4 text-green-400" /> $0 soap costs after 5 years
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-xl text-slate-300 font-light">
            After 5 years, the system is yours. Your payment drops to $0. <br className="hidden md:block" />
            <strong className="text-white font-semibold">You instantly save ~$120/month, every month, forever.</strong>
          </p>
        </div>
      </div>
    </section>
  );
}
