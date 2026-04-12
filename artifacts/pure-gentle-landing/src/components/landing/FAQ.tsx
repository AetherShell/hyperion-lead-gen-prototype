import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQ() {
  const faqs = [
    {
      q: "How does the soap program actually work?",
      a: "Because soft water doesn't contain hard minerals, soaps lather up to 80% better. When you get our system, we provide you with a 5-year supply of high-quality, eco-friendly household cleaners, laundry detergents, and personal care items upfront. You stop buying these at the store, and that savings covers your system payment."
    },
    {
      q: "What happens after the 5 years?",
      a: "After about 5 years, your system is completely paid off. You have no more monthly payments for the equipment. Your only cost is a minor annual maintenance (around $50/year). You continue to save money every single month because you still need significantly less soap and no bottled water."
    },
    {
      q: "Is the installation disruptive?",
      a: "Not at all. Our certified professionals typically complete the installation in 3-4 hours. We handle everything cleanly and efficiently, usually tying into your main water line in the garage or side of the house, and installing the RO unit neatly under your kitchen sink."
    },
    {
      q: "What exactly does the Reverse Osmosis (RO) system filter?",
      a: "Our RO system removes up to 99% of contaminants including chlorine, lead, fluoride, heavy metals, microplastics, and forever chemicals (PFAS). It provides drinking water that is cleaner and tastes better than typical bottled water."
    },
    {
      q: "Is there a warranty?",
      a: "Yes. We stand by our products with an industry-leading lifetime warranty on the tank and resin, plus comprehensive coverage on all moving parts. We build these systems to last decades, not just a few years."
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Common Questions</h2>
          <p className="text-lg text-slate-600">Everything you need to know about upgrading your home's water.</p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, idx) => (
            <AccordionItem key={idx} value={`item-${idx}`} className="border-slate-200">
              <AccordionTrigger className="text-left text-lg font-semibold text-slate-800 hover:text-blue-600 hover:no-underline py-6">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 text-base leading-relaxed pb-6">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
