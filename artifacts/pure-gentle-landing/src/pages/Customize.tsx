import { ValueBuild } from "@/components/customize/ValueBuild";
import { SystemConfigurator } from "@/components/customize/SystemConfigurator";
import { CascadingWater } from "@/components/landing/CascadingWater";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { PageBackdrop } from "@/components/landing/PageBackdrop";

/**
 * Self-gen express path. High-intent visitors who already know they want a
 * system: value-build the components, build their system, see the gated price,
 * book a call. Leads route as lead_type "selfgen" (see SystemConfigurator) so
 * they stay separate from the $50 trial bucket.
 */
export default function Customize() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0a1633] via-[#0b1f4d] to-[#02050f] text-slate-100 selection:bg-sky-400/40 selection:text-white overflow-x-clip">
      <PageBackdrop />
      <CascadingWater />
      <SiteHeader />

      <main className="relative z-10 pt-24">
        {/* 1. Intent-affirming intro */}
        <section className="pt-8 pb-4">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
              Build the system your home needs.
            </h1>
            <p className="text-lg text-slate-200 max-w-2xl mx-auto">
              You already know your water needs work. Pick the pieces, see your price, and book a call to lock it in.
            </p>
          </div>
        </section>

        {/* 2. Value-build — what each component does (before any price) */}
        <ValueBuild />

        {/* 3. Configurator — build, gated price reveal, book */}
        <SystemConfigurator />
      </main>

      <footer className="bg-slate-950 text-slate-400 py-10 border-t border-slate-900">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-sm">H</div>
            <span className="font-semibold text-slate-300">Hyperion Elite Systems</span>
          </div>
          <a href="tel:+16238505380" className="text-slate-400 hover:text-slate-200 text-sm transition-colors">(623) 850-5380</a>
          <div className="text-sm">&copy; {new Date().getFullYear()} Hyperion Elite Systems. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
