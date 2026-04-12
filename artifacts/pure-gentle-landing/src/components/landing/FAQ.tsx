import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Is this a regular water softener?",
    a: "It includes a water softener, but that's only one part of the system. You also get a reverse osmosis drinking water system and a 5-year supply of household cleaning products through the Pure & Gentle program. A standalone softener doesn't come with either of those — and those are what make the cost math work.",
  },
  {
    q: "How does the soap program work?",
    a: "Soft water requires significantly less soap to lather and clean effectively. Because your household uses less product overall, our partner Pure and Gentle can provide a full 5-year supply of laundry detergent, dish soap, shampoo, conditioner, household cleaners, and personal care products — all included with the system. They ship directly to your door.",
  },
  {
    q: "What happens after the 5 years?",
    a: "After about 60 months, the system is fully paid off and you own it. Your monthly payment goes to $0. Your only ongoing cost is around $50/year for annual maintenance. Because your water is still soft, you'll continue using far less soap than a typical household — so the savings continue on their own.",
  },
  {
    q: "What does the RO system filter out?",
    a: "The reverse osmosis system removes up to 99% of common contaminants — including chlorine, lead, fluoride, nitrates, heavy metals, microplastics, and PFAS (sometimes called forever chemicals). Most families find the water tastes noticeably better than what they were buying in bottles.",
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
    q: "What if I change my mind after ordering?",
    a: "You have 3 business days from signing to cancel with no penalty and no questions asked. After installation, any issues with the system or the products are handled under warranty.",
  },
  {
    q: "Is there a warranty?",
    a: "Yes. The system comes with a 1-year warranty covering parts and labor from the installation date. The soap supply is delivered within 30 days of installation. We stand behind the product because the vast majority of families see exactly the results we describe.",
  },
];

export function FAQ() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">

        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Common questions.
          </h2>
          <p className="text-lg text-slate-600">
            Straightforward answers to the things people ask most.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-slate-200">
              <AccordionTrigger className="text-left text-base font-semibold text-slate-800 hover:text-blue-600 hover:no-underline py-5">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 text-base leading-relaxed pb-5">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

      </div>
    </section>
  );
}
