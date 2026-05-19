import { Hero } from "@/components/landing/Hero";
import { OldWay } from "@/components/landing/OldWay";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { SavingsBreakdown } from "@/components/landing/SavingsBreakdown";
import { Quiz } from "@/components/landing/Quiz";
import { Testimonials } from "@/components/landing/Testimonials";
import { FAQ } from "@/components/landing/FAQ";
import { CTA } from "@/components/landing/CTA";
import { CascadingWater } from "@/components/landing/CascadingWater";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { PageBackdrop } from "@/components/landing/PageBackdrop";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0a1633] via-[#0b1f4d] to-[#02050f] text-slate-100 selection:bg-sky-400/40 selection:text-white overflow-x-clip">
      <PageBackdrop />
      <CascadingWater />
      <SiteHeader />

      <main className="relative z-10">
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
          <a href="tel:+16028505380" className="text-slate-400 hover:text-slate-200 text-sm transition-colors">(602) 850-5380</a>
          <div className="text-sm">&copy; {new Date().getFullYear()} Hyperion Elite Systems. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
