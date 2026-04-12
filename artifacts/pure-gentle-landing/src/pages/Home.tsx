import { Hero } from "@/components/landing/Hero";
import { OldWay } from "@/components/landing/OldWay";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { SavingsBreakdown } from "@/components/landing/SavingsBreakdown";
import { Quiz } from "@/components/landing/Quiz";
import { Testimonials } from "@/components/landing/Testimonials";
import { FAQ } from "@/components/landing/FAQ";
import { CTA } from "@/components/landing/CTA";
import { Phone } from "lucide-react";

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
            <a
              href="tel:+18005550100"
              className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              (800) 555-0100
            </a>
            <button
              onClick={() => document.getElementById("quiz")?.scrollIntoView({ behavior: "smooth" })}
              className="text-sm font-bold px-5 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
            >
              See My Savings
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* 1. Hook — pattern interrupt, stop the scroll */}
        <Hero />

        {/* 2. Old Way — name the villain, destroy the old belief */}
        <OldWay />

        {/* 3. New Way — reveal the mechanism, install a new belief */}
        <HowItWorks />

        {/* 4. Offer — show exactly what delivers the new way */}
        <SavingsBreakdown />

        {/* Bridge into the quiz */}
        <div className="bg-slate-50 pt-16 pb-0">
          <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-4">
              Your numbers are different from the average
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3">
              See exactly what this changes for your household.
            </h2>
            <p className="text-lg text-slate-600">
              The quiz takes 30 seconds. Enter what you actually spend — and see the real math for your home.
            </p>
          </div>
        </div>

        {/* 5. Sale — personalized proof, then straight to close */}
        <Quiz />

        {/* 6. Social proof — "others like you made this decision" */}
        <Testimonials />

        {/* 7. Objection handling */}
        <FAQ />

        {/* 8. Final close — for anyone not yet ready to order online */}
        <CTA />
      </main>

      <footer className="bg-slate-950 text-slate-400 py-10 border-t border-slate-900">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-sm">H</div>
            <span className="font-semibold text-slate-300">Hyperion Elite Systems</span>
          </div>
          <a href="tel:+18005550100" className="text-slate-400 hover:text-slate-200 text-sm transition-colors">(800) 555-0100</a>
          <div className="text-sm">&copy; {new Date().getFullYear()} Hyperion Elite Systems. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
