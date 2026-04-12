import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Isn't this just a regular water softener? I've heard those don't make that big a difference.",
    a: "This is not a regular water softener. A standard softener only addresses water hardness — it doesn't include a reverse osmosis drinking system, and it certainly doesn't come with a 5-year soap supply. The difference the Pure & Gentle program makes is where the real financial shift happens. You eliminate the entire soap and cleaning category from your monthly budget. That's what makes the math work.",
  },
  {
    q: "How does the soap program actually work?",
    a: "Soft water requires 80% less soap to lather and clean effectively. Because your household needs dramatically less product, our partner Pure and Gentle can supply five full years of premium household cleaners, laundry detergent, dish soap, shampoo, conditioner, and personal care products — all included with your system. They ship directly to your door. You stop buying these at the store.",
  },
  {
    q: "What happens after the 5 years?",
    a: "After about 60 months, the system is completely paid off and you own it outright. Your $160/month payment drops to $0. Your only ongoing cost is $50/year for annual maintenance. Because your water is still soft, you still need 80% less soap than the average household — so you continue saving roughly $120/month, every month, for as long as you own the home.",
  },
  {
    q: "Why haven't I heard of this before?",
    a: "The water treatment industry isn't known for aggressive marketing, and soap companies have no incentive to tell you that your water is making their product perform worse. Most homeowners discover this through a neighbor's referral or an in-home demonstration. Word of mouth is how most of our installations happen — which is also why we can invest in a system that includes $7,200 worth of soap products instead of spending that on advertising.",
  },
  {
    q: "Is the installation disruptive?",
    a: "Not at all. Our certified installers typically finish in 3–4 hours. We tie into your main water line — usually in the garage or utility area — and install the RO unit under your kitchen sink. We handle everything cleanly, test all connections, demo the system with you, and leave your home exactly as we found it.",
  },
  {
    q: "What does the RO system actually filter out?",
    a: "Our reverse osmosis system removes up to 99% of contaminants — chlorine, lead, fluoride, nitrates, heavy metals, microplastics, and PFAS (forever chemicals). The water tastes noticeably cleaner than municipal tap, and in blind taste tests, most families prefer it over the bottled water they were buying.",
  },
  {
    q: "What if I decide it's not for me after I order?",
    a: "You have 3 business days from signing to cancel without penalty — no questions asked, no fees. After installation, if you experience any issue with the system or the products, our team handles it under warranty. We stand behind the product because we know the math works for the overwhelming majority of homeowners.",
  },
];

export function FAQ() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">

        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Still skeptical? Good.
          </h2>
          <p className="text-lg text-slate-600">
            Every common objection — answered honestly.
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
