import { Link } from "react-router-dom";
import { ArrowUpRight, Layers, Users } from "lucide-react";

/** Consistent "family friendly pricing" panel used on every program page. */
export const PricingDiscounts = ({ program, note }) => (
  <div className="mt-12 border border-lime/40 bg-lime/[0.05] p-8 md:p-12" data-testid="pricing-discounts">
    <div className="text-pinklt text-xs uppercase tracking-[0.25em] font-bold mb-2">Family friendly pricing</div>
    <h3 className="font-display text-3xl md:text-4xl uppercase text-white leading-none">More classes, more savings</h3>
    <p className="text-white/60 mt-3 max-w-2xl">
      {note || "We want your athlete in the gym as often as they love it - and we don't want a second child to be the reason you hold back."}
    </p>

    <div className="grid md:grid-cols-2 gap-4 mt-8">
      <div className="border border-white/15 bg-ink/40 p-6" data-testid="discount-multi-class">
        <div className="w-11 h-11 bg-lime text-ink flex items-center justify-center mb-4"><Layers className="w-5 h-5" /></div>
        <div className="font-display text-2xl uppercase text-white leading-none">Multi-class discount</div>
        <p className="text-white/60 mt-3">
          Add a second class each week - gymnastics, tumble, or cheer - and every additional class comes at a reduced rate.
        </p>
      </div>
      <div className="border border-white/15 bg-ink/40 p-6" data-testid="discount-sibling">
        <div className="w-11 h-11 bg-coral text-white flex items-center justify-center mb-4"><Users className="w-5 h-5" /></div>
        <div className="font-display text-2xl uppercase text-white leading-none">Sibling discount</div>
        <p className="text-white/60 mt-3">
          Enrolling brothers and sisters together? Every additional sibling in the gym gets a discount on tuition.
        </p>
      </div>
    </div>

    <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
      <Link
        to={`/contact?topic=Class%20Enrollment&program=${encodeURIComponent(program)}`}
        className="bg-lime text-ink font-display uppercase text-base md:text-lg px-6 py-3 md:px-8 md:py-4 hover:bg-white transition-colors inline-flex items-center justify-center gap-2"
        data-testid="pricing-discounts-cta"
      >
        Ask about discounts <ArrowUpRight className="w-5 h-5" />
      </Link>
      <span className="text-white/50 text-sm">Tell us your athlete's age and schedule and we'll put together your exact rate.</span>
    </div>
  </div>
);

export default PricingDiscounts;
