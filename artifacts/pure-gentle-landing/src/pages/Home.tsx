import { Hero } from "@/components/landing/Hero";
import { Quiz } from "@/components/landing/Quiz";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { SavingsBreakdown } from "@/components/landing/SavingsBreakdown";
import { Testimonials } from "@/components/landing/Testimonials";
import { FAQ } from "@/components/landing/FAQ";
import { CTA } from "@/components/landing/CTA";

export default function Home() {
  return (
    <div className="min-h-screen bg-white selection:bg-blue-200 selection:text-blue-900">
      <header className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 z-50">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
              P
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">Pure & Gentle</span>
          </div>
          <button 
            onClick={() => document.getElementById('schedule')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-sm font-semibold px-5 py-2 rounded-full bg-slate-900 text-white hover:bg-blue-600 transition-colors"
          >
            Get a Quote
          </button>
        </div>
      </header>

      <main>
        <Hero />
        <Quiz />
        <HowItWorks />
        <SavingsBreakdown />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>

      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-sm">
              P
            </div>
            <span className="font-semibold text-slate-300">Pure & Gentle Home Solutions</span>
          </div>
          <div className="text-sm">
            &copy; {new Date().getFullYear()} Pure & Gentle. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
