import { Phone, Gift } from "lucide-react";

/**
 * Dark-frosted glass header — sits over the deep-navy palette that runs the
 * full length of the page.
 */
export function SiteHeader() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 border-b border-white/10 bg-slate-950/50 backdrop-blur-md">
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <a href={import.meta.env.BASE_URL} className="flex items-center">
          <img
            src={`${import.meta.env.BASE_URL}HES_Logo_White.png`}
            alt="Hyperion Elite Systems"
            className="h-12 w-auto"
            draggable={false}
          />
        </a>
        <div className="flex items-center gap-3">
          <a
            href="tel:+16028505380"
            className="flex items-center gap-1.5 text-sm font-medium text-slate-200 hover:text-sky-300 transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">(602) 850-5380</span>
            <span className="sm:hidden">Call</span>
          </a>
          <button
            onClick={() => document.getElementById("quiz")?.scrollIntoView({ behavior: "smooth" })}
            className="hidden md:inline-flex text-sm font-semibold px-4 py-2 rounded-full border border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-colors"
          >
            See How It Works
          </button>
          <button
            onClick={() => document.getElementById("schedule")?.scrollIntoView({ behavior: "smooth" })}
            className="inline-flex items-center gap-1.5 text-sm font-bold px-4 sm:px-5 py-2 rounded-full bg-[#7e671b] text-slate-950 hover:bg-[#e8c652] transition-colors shadow-sm shadow-[#7e671b]/40"
          >
            <Gift className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Free Water Test + $25</span>
            <span className="sm:hidden">$25 Gift</span>
          </button>
        </div>
      </div>
    </header>
  );
}
