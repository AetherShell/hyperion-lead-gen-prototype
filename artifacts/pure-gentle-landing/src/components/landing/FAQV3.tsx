import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs: { q: string; a: string; economics?: boolean }[] = [
  {
    q: "How is a water refiner different from a water softener?",
    a: "A water softener removes calcium and magnesium — the hard water minerals — which helps with soap performance and scale buildup. A water refiner does all of that, plus it filters out the chlorine that comes through the municipal supply. In most of the U.S., a softener is fine. In the Southwest, where the water is unusually hard and chlorine comes through on top of that, a refiner is what's needed to get the cleanest water throughout your home. That's why the Hyperion Elite system uses a refiner, not just a softener — and it's also why the system costs more than a basic softener, which typically runs about a quarter of the price.",
  },
  {
    q: "How does the soap program work?",
    a: "Refined, soft water requires significantly less soap to lather and clean effectively. Because your household uses less product overall, our partner Pure and Gentle can provide a full 5-year supply of laundry detergent, dish soap, shampoo, conditioner, household cleaners, and personal care products — all included with the system. They ship directly to your door.",
    economics: true,
  },
  {
    q: "What does the in-home water test involve?",
    a: "A technician comes to your home and tests your water on the spot — usually takes 30–45 minutes. They'll measure hardness, TDS (total dissolved solids), and chlorine. You get the results right there. There's no charge and no obligation. It just gives you accurate data about your specific water so you can make an informed decision.",
  },
  {
    q: "What happens after the 5 years of soap?",
    a: "It's about $50/year to keep all the household soaps coming after that — laundry detergent, dish soap, shampoo, conditioner, hand soap, and household cleaners, for the whole family. The 5-year supply included with your system has over $9,800 in retail value. Refined, soft water lets Pure & Gentle ship concentrated products instead of bottles full of water weight, and we partnered with them to pass those savings on — so every family can get good water and save money at the same time.",
    economics: true,
  },
  {
    q: "What does the RO system filter out?",
    a: "The reverse osmosis system gives you purified drinking and cooking water through a separate tap at the kitchen sink. It reduces total dissolved solids to near zero — a deeper level of filtration than the whole-home refiner. The water tastes clean and pure, which is why most families stop buying bottled water within the first week.",
  },
  {
    q: "How long does installation take?",
    a: "Typically 3–4 hours. Our installers handle everything — tying into your main water line (usually in the garage or utility area), setting up the RO unit under the kitchen sink, testing all connections, and walking you through how it works. We clean up after ourselves.",
  },
  {
    q: "Do I need to own my home?",
    a: "Homeowners can move forward right away. If you rent, you'll need written approval from your landlord before installation. Our team can help you with that conversation if needed.",
  },
  {
    q: "Is there a warranty?",
    a: "Yes. The system has a lifetime warranty: if anything ever breaks, we fix it; if it can't be fixed, we replace it with a new system. We believe something that protects you and your home should last a lifetime. The soap supply is delivered within 30 days of installation.",
  },
];

export function FAQ({ hideEconomics = false }: { hideEconomics?: boolean }) {
  // /v3 holds the soap economics for the in-home test.
  const visibleFaqs = hideEconomics ? faqs.filter((f) => !f.economics) : faqs;

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl relative z-10">

        <div className="text-center mb-12 max-w-3xl mx-auto">
          <div className="bg-slate-950/60 backdrop-blur-md rounded-2xl border border-white/10 p-7 md:p-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">
              Common questions.
            </h2>
            <p className="text-lg text-slate-100">
              Straightforward answers to the things people ask most.
            </p>
          </div>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {visibleFaqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-white/10">
              <AccordionTrigger className="text-left text-base font-semibold text-white hover:text-sky-300 hover:no-underline py-5">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-slate-300 text-base leading-relaxed pb-5">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

      </div>
    </section>
  );
}
