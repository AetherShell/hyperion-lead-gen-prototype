import { Hero } from "@/components/landing/Hero";
import { OldWay } from "@/components/landing/OldWay";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { SavingsBreakdown } from "@/components/landing/SavingsBreakdown";
import { Quiz } from "@/components/landing/Quiz";
import { Testimonials } from "@/components/landing/Testimonials";
import { FAQ } from "@/components/landing/FAQ";
import { CTA } from "@/components/landing/CTA";

export default function Home() {
  return (
    <div className="min-h-screen bg-white selection:bg-blue-200 selection:text-blue-900">
      <header className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md border-b border-slate-100 z-50">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
              H
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">Hyperion Elite Systems</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => document.getElementById("quiz")?.scrollIntoView({ behavior: "smooth" })}
              className="text-sm font-bold px-5 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
            >
              See How It Works
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* 1. Acknowledge the common approach */}
        <Hero />

        {/* 2. Explain its limitations — gently */}
        <OldWay />

        {/* 3. Introduce a simpler approach */}
        <HowItWorks />

        {/* 4. Show why it works — the numbers */}
        <SavingsBreakdown />

        {/* 5. Present the offer — personalized calculator */}
        <Quiz />

        {/* 6. Social proof — real families */}
        <Testimonials />

        {/* 7. Answer common questions */}
        <FAQ />

        {/* 8. Simple call to action */}
        <CTA />
      </main>

      <footer className="bg-slate-950 text-slate-400 py-10 border-t border-slate-900">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-sm">H</div>
            <span className="font-semibold text-slate-300">Hyperion Elite Systems</span>
          </div>
          <div className="text-sm">&copy; {new Date().getFullYear()} Hyperion Elite Systems. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
