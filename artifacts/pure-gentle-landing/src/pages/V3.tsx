import { HeroV3 } from "@/components/landing/HeroV3";
import { OldWay } from "@/components/landing/OldWay";
import { HowItWorks } from "@/components/landing/HowItWorksV3";
import { Testimonials } from "@/components/landing/Testimonials";
import { FAQ } from "@/components/landing/FAQV3";
import { CTA } from "@/components/landing/CTA";
import { CascadingWater } from "@/components/landing/CascadingWater";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { PageBackdrop } from "@/components/landing/PageBackdrop";

/**
 * /v3 landing — destination for the tuned ad.
 * Same shell as Home, but:
 *   - HeroV3 (soft-water-first, no $25)
 *   - SavingsBreakdown + Quiz removed
 *   - HowItWorks + FAQ run with hideEconomics (no $160/mo banner, no soap economics)
 * The money/savings story is reserved for the in-home water test.
 */
export default function V3() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0a1633] via-[#0b1f4d] to-[#02050f] text-slate-100 selection:bg-sky-400/40 selection:text-white overflow-x-clip">
      <PageBackdrop />
      <CascadingWater />
      <SiteHeader />

      <main className="relative z-10">
        {/* 1. Lead with the outcome */}
        <HeroV3 />

        {/* 2. Agitate the problem — gently */}
        <OldWay />

        {/* 3. How it works — water tech only, economics held for the demo */}
        <HowItWorks hideEconomics />

        {/* 4. Social proof — real families */}
        <Testimonials />

        {/* 5. Common questions — soap economics held for the demo */}
        <FAQ hideEconomics />

        {/* 6. Book the free water test */}
        <CTA />
      </main>

      <footer className="bg-slate-950 text-slate-400 py-10 border-t border-slate-900">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-sm">H</div>
            <span className="font-semibold text-slate-300">Hyperion Elite Systems</span>
          </div>
          <a href="tel:+14808497274" className="text-slate-400 hover:text-slate-200 text-sm transition-colors">(480) 849-7274</a>
          <div className="text-sm">&copy; {new Date().getFullYear()} Hyperion Elite Systems. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
