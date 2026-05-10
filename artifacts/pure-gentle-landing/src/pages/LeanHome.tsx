import { useEffect, useRef, useState } from "react";
import { Droplets, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { CTA } from "@/components/landing/CTA";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type RetailerKey = "home-depot" | "amazon" | "target";

type Retailer = {
  key: RetailerKey;
  name: string;
  logoSrc: string;
};

const RETAILER_CONFIG: Record<RetailerKey, Retailer> = {
  "home-depot": { key: "home-depot", name: "Home Depot", logoSrc: "/logos/home-depot.svg" },
  "amazon":     { key: "amazon",     name: "Amazon",     logoSrc: "/logos/amazon.svg"     },
  "target":     { key: "target",     name: "Target",     logoSrc: "/logos/target.svg"     },
};

const DEFAULT_RETAILER: RetailerKey = "target";

function resolveRetailer(): Retailer {
  if (typeof window === "undefined") return RETAILER_CONFIG[DEFAULT_RETAILER];
  const param = new URLSearchParams(window.location.search).get("giftcard");
  if (param && param in RETAILER_CONFIG) {
    return RETAILER_CONFIG[param as RetailerKey];
  }
  return RETAILER_CONFIG[DEFAULT_RETAILER];
}

function buildFaqs(retailer: Retailer) {
  return [
    {
      q: "What does the water test involve?",
      a: "A technician comes to your home and tests your water on the spot, usually about 15 minutes. They'll measure hardness, TDS (total dissolved solids), and chlorine, and check for common contaminants. You get the results right there, in plain English, and can ask whatever questions you have.",
    },
    {
      q: "Is the test really free?",
      a: `Yes. No charge, no purchase necessary. We just ask that you and any household decision-makers be home for the full appointment, usually about 30 minutes. The $25 ${retailer.name} gift card comes after the appointment whether you decide to move forward or not.`,
    },
    {
      q: `How does the $25 ${retailer.name} gift card work?`,
      a: `Once your in-home water test is complete, we'll send you a $25 ${retailer.name} gift card by mail. There's no purchase required. Book the test, let us run it, and the card is yours.`,
    },
    {
      q: "What happens after the test?",
      a: "If your water shows hardness or contaminants worth addressing, the technician can walk you through what a Hyperion Elite system would mean for your home: pricing, timing, and how it works. If your water doesn't need it, they'll tell you that too. Either way, you keep the gift card.",
    },
  ];
}

export default function LeanHome() {
  const retailer = resolveRetailer();
  const faqs = buildFaqs(retailer);

  const heroRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const [pastHero, setPastHero] = useState(false);
  const [hasReachedForm, setHasReachedForm] = useState(false);

  useEffect(() => {
    const heroEl = heroRef.current;
    const formEl = formRef.current;
    if (!heroEl || !formEl) return;

    const heroObs = new IntersectionObserver(
      ([entry]) => setPastHero(!entry.isIntersecting),
      { threshold: 0 },
    );
    const formObs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setHasReachedForm(true);
      },
      { threshold: 0.25 },
    );
    heroObs.observe(heroEl);
    formObs.observe(formEl);
    return () => {
      heroObs.disconnect();
      formObs.disconnect();
    };
  }, []);

  const showBanner = pastHero && !hasReachedForm;

  const scrollToForm = () =>
    document.getElementById("book")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen bg-white selection:bg-blue-200 selection:text-blue-900">
      <header className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md border-b border-slate-100 z-50">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
              H
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">Hyperion Elite Systems</span>
          </div>
          <a
            href="tel:+18005550100"
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            (800) 555-0100
          </a>
        </div>
      </header>

      <main>
        <section ref={heroRef} className="relative min-h-[80vh] flex items-center pt-20 pb-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img src="/hero-kitchen.png" alt="" className="w-full h-full object-cover object-center opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/95 via-blue-50/85 to-transparent" />
            <div className="absolute inset-0 bg-white/55 backdrop-blur-[2px]" />
          </div>
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="max-w-3xl">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.05] mb-5 tracking-tight">
                  Do you know what's{" "}
                  <span className="text-blue-600 relative">
                    in your water?
                    <svg
                      className="absolute -bottom-1.5 left-0 w-full h-3 text-blue-300 opacity-70"
                      viewBox="0 0 100 10"
                      preserveAspectRatio="none"
                    >
                      <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="none" />
                    </svg>
                  </span>
                </h1>

                <p className="text-xl md:text-2xl text-slate-700 mb-8 leading-relaxed max-w-2xl font-light">
                  Arizona water is some of the hardest in the country. A free in-home test tells you exactly what's in yours, and we'll send you a $25 {retailer.name} gift card just for letting us take a look.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => document.getElementById("book")?.scrollIntoView({ behavior: "smooth" })}
                    className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 hover:-translate-y-0.5"
                  >
                    <Droplets className="mr-2 w-5 h-5 shrink-0" />
                    <span className="flex flex-col items-start leading-tight text-left">
                      <span className="text-lg font-bold">Book My Free Water Test</span>
                      <span className="text-xs font-medium opacity-90">+ $25 {retailer.name} gift card, no purchase necessary</span>
                    </span>
                  </button>
                  <a
                    href="tel:+18005550100"
                    className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl border-2 border-slate-300 text-slate-700 hover:border-blue-400 hover:text-blue-700 transition-all"
                  >
                    <Phone className="mr-2 w-4 h-4" />
                    (800) 555-0100
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white border-t border-slate-100">
          <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-lg md:text-xl text-slate-700 leading-relaxed"
            >
              Hyperion Elite Systems are designed specifically for Arizona's water, built for the hardness levels and conditions found across the Phoenix valley and the broader Southwest. If your test shows you'd benefit from a system, we'll walk you through what that would look like for your home. If not, you keep the gift card and we move on.
            </motion.p>
          </div>
        </section>

        <div id="book" ref={formRef}>
          <CTA />
        </div>

        <section className="py-20 bg-slate-50 border-t border-slate-100">
          <div className="container mx-auto px-4 md:px-6 max-w-3xl">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3">
                Common questions about the test.
              </h2>
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
      </main>

      <footer className="bg-slate-950 text-slate-400 py-10 border-t border-slate-900">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-sm">H</div>
            <span className="font-semibold text-slate-300">Hyperion Elite Systems</span>
          </div>
          <a href="tel:+18005550100" className="text-slate-400 hover:text-slate-200 text-sm transition-colors">(800) 555-0100</a>
          <div className="text-sm">&copy; {new Date().getFullYear()} Hyperion Elite Systems. All rights reserved.</div>
        </div>
      </footer>

      <div
        aria-hidden={!showBanner}
        className={`fixed bottom-0 left-0 right-0 z-40 bg-blue-600 text-white shadow-2xl border-t border-blue-700 transition-transform duration-300 ${
          showBanner ? "translate-y-0" : "translate-y-full pointer-events-none"
        }`}
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="text-sm md:text-base leading-tight min-w-0">
            <div className="font-bold">Schedule Your Free Water Test</div>
            <div className="text-xs opacity-90 truncate">+ $25 {retailer.name} gift card, no purchase necessary</div>
          </div>
          <button
            onClick={scrollToForm}
            className="shrink-0 bg-white text-blue-700 font-bold px-4 py-2 md:px-5 md:py-2.5 rounded-lg text-sm hover:bg-blue-50 transition-colors"
          >
            Schedule
          </button>
        </div>
      </div>
    </div>
  );
}
