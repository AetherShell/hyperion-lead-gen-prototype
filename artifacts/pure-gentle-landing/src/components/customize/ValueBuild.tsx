import { Filter, Droplets, Sparkles, FlaskConical } from "lucide-react";

/**
 * VALUE-BUILD SECTION — DRAFT COPY. James to correct product specifics and
 * policy-sensitive claims before this goes live.
 *
 * AD-POLICY FLAGS (Meta rejects water-treatment ads making these claims):
 *  - Do NOT claim treatment of / protection from any disease or health condition.
 *  - Avoid absolute removal claims ("removes all X", "eliminates"); use "reduces"
 *    and only for contaminants Hyperion can substantiate for these specific units.
 *  - The fluoride/arsenic line on Activated Alumina is the highest-risk claim.
 *    James: confirm Hyperion's substantiated reduction language before shipping.
 *  - "Bottled-quality" is a taste/convenience framing, not a health claim — safer,
 *    but confirm it matches how Hyperion positions RO.
 */

interface Item {
  icon: typeof Filter;
  name: string;
  what: string;
  why: string;
}

const ITEMS: Item[] = [
  {
    icon: Filter,
    name: "Whole-Home Refiner",
    what: "Treats every drop of water entering your home, not just one tap.",
    why: "Softer water on your skin and hair, fewer spots on glassware and fixtures, and less hard-water buildup wearing on your appliances and plumbing over time.",
  },
  {
    icon: Droplets,
    name: "Reverse Osmosis Drinking Water",
    what: "A dedicated drinking-water system, usually at the kitchen sink.",
    why: "Clean, great-tasting water on tap for drinking and cooking — so you can stop buying and hauling bottled water.",
  },
  {
    icon: Sparkles,
    name: "Alkaline Remineralization",
    what: "An add-on to the RO system. Adds beneficial minerals back into the water and raises its pH.",
    why: "Some people prefer the taste and feel of remineralized water over very pure RO water. Pairs only with RO.",
  },
  {
    icon: FlaskConical,
    name: "Activated Alumina",
    what: "A specialty stage targeting specific contaminants.",
    why: "Used when a water test shows particular contaminants worth addressing for your area. [James: confirm substantiated language.]",
  },
];

export function ValueBuild() {
  return (
    <section id="value-build" className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl relative z-10">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
            What goes into your system.
          </h2>
          <p className="text-lg text-slate-100">
            Each piece solves a different problem. Here's what each one does, so you can build the system that fits your home.
          </p>
        </div>

        <div className="space-y-4">
          {ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.name} className="bg-slate-950/60 backdrop-blur-md rounded-2xl border border-white/10 p-6 flex gap-5">
                <div className="w-12 h-12 rounded-xl bg-slate-800/80 flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 text-sky-300" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{item.name}</h3>
                  <p className="text-slate-300 text-sm mb-2">{item.what}</p>
                  <p className="text-slate-400 text-sm">{item.why}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
