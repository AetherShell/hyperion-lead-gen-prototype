import { Star } from "lucide-react";

export function Testimonials() {
  const reviews = [
    {
      name: "Sarah Jenkins",
      location: "Austin, TX",
      savings: "$145/month",
      text: "I was skeptical about the soap program, but the products are actually incredible. We haven't bought laundry detergent or body wash in three years. Plus, my daughter's eczema completely cleared up after a month of soft water. The math made it a no-brainer."
    },
    {
      name: "Michael & Elena Torres",
      location: "Phoenix, AZ",
      savings: "$180/month",
      text: "We used to buy three cases of bottled water a week and easily spent $150 on cleaning supplies for our family of six. The RO system water tastes better than bottled, and the refiner makes the showers feel amazing. It literally pays for itself."
    },
    {
      name: "David Chen",
      location: "Denver, CO",
      savings: "$110/month",
      text: "As an engineer, I crunched all the numbers before signing. The fact that the monthly payment just replaces money we were already spending at the grocery store made it an easy decision. Installation was quick, clean, and professional."
    }
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Real Families, Real Savings</h2>
          <p className="text-lg text-slate-600">Join thousands of homeowners who stopped paying for hard water.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {reviews.map((review, idx) => (
            <div key={idx} className="bg-white p-8 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 flex flex-col">
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-slate-700 mb-8 flex-grow leading-relaxed">"{review.text}"</p>
              <div className="pt-6 border-t border-slate-100 flex justify-between items-end">
                <div>
                  <div className="font-semibold text-slate-900">{review.name}</div>
                  <div className="text-sm text-slate-500">{review.location}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-green-600 font-bold uppercase tracking-wide">Saving</div>
                  <div className="font-bold text-slate-900">{review.savings}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
