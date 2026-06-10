import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "What does the in-home water test involve?",
    a: "A water specialist comes to your home and tests your water on the spot, usually 30 to 45 minutes. There is no charge and no obligation. You get accurate data about your specific water so you can make an informed decision.",
  },
  {
    q: "Is there any obligation to buy?",
    a: "None. The water test is genuinely free and you are never obligated to buy anything. The water specialist tests your water, answers your questions, and you decide what to do with the results - the $25 gift card is yours either way.",
  },
  {
    q: "Do I need to own my home?",
    a: "Homeowners can move forward right away. If you rent, you will need written approval from your landlord before installation. Our team can help with that conversation if needed.",
  },
];

export function FAQ() {
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
          {faqs.map((faq, i) => (
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
