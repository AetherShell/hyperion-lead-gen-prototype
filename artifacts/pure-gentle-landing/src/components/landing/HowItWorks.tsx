import { motion } from "framer-motion";
import { Filter, Droplets, PackageCheck } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: <Filter className="w-10 h-10 text-blue-600" />,
      title: "1. Water Refiner",
      description: "We install a whole-home refiner that softens your water, removing harsh minerals that damage your pipes, skin, and appliances."
    },
    {
      icon: <Droplets className="w-10 h-10 text-cyan-500" />,
      title: "2. Reverse Osmosis",
      description: "A premium under-sink RO system purifies your drinking water, eliminating the need to ever buy bottled water again."
    },
    {
      icon: <PackageCheck className="w-10 h-10 text-green-500" />,
      title: "3. The Soap Program",
      description: "Because soft water requires 80% less soap, we supply 5 years of premium, eco-friendly cleaning products for free."
    }
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">A Complete Home Solution</h2>
          <p className="text-lg text-slate-600">It's not just a water softener. It's a comprehensive system designed to upgrade your home and eliminate hidden expenses.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative max-w-5xl mx-auto">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-slate-100 z-0">
            <div className="h-full bg-blue-100 w-full" />
          </div>

          {steps.map((step, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
              className="relative z-10 flex flex-col items-center text-center"
            >
              <div className="w-24 h-24 rounded-2xl bg-white border border-slate-100 shadow-xl shadow-slate-200/50 flex items-center justify-center mb-6 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent rounded-2xl" />
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
              <p className="text-slate-600 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
