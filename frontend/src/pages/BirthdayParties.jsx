import { PageHero } from "@/components/common/PageHero";
import { Reveal, SectionHeading } from "@/components/common/Reveal";
import { BookingDialog } from "@/components/common/BookingDialog";
import { IMG, PARTY_TIERS, PARTY_ADDONS, PARTY_INCLUDED } from "@/data/site";
import { Check, Plus, ShieldCheck, Cake, Clock, Users } from "lucide-react";

const BirthdayParties = () => (
  <div data-testid="birthday-parties-page">
    <PageHero
      overline="Best party in town"
      title={<>Birthday<br />Parties</>}
      subtitle="Trampolines, foam pits, obstacle courses, and zero cleanup for you. We host it, they'll never forget it."
      image={IMG.birthday}
    />

    <section className="bg-ink py-20 md:py-28">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8">
        <SectionHeading overline="Pick your package" title="Two ways to celebrate" className="mb-12" />
        <div className="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {PARTY_TIERS.map((tier, i) => (
            <Reveal key={tier.name} delay={i * 0.1}>
              <div className={`relative p-8 md:p-10 h-full flex flex-col ${tier.featured ? "border-2 border-lime bg-lime/[0.06]" : "border border-white/15 bg-white/[0.03]"}`} data-testid={`party-tier-${tier.name}`}>
                {tier.featured && <div className="absolute -top-3 left-8 bg-lime text-ink text-xs uppercase tracking-wide font-bold px-3 py-1">Most Popular</div>}
                <div className="font-display text-3xl uppercase text-white">{tier.name}</div>
                <div className="flex items-end gap-2 mt-3">
                  <span className="font-display text-6xl text-lime leading-none">{tier.price}</span>
                </div>
                <div className="mt-6 space-y-3 text-white/75 flex-1">
                  <div className="flex items-center gap-3"><Users className="w-5 h-5 text-lime" /> {tier.age} • {tier.capacity}</div>
                  <div className="flex items-center gap-3"><Clock className="w-5 h-5 text-lime" /> {tier.duration}</div>
                  <div className="flex items-center gap-3"><Cake className="w-5 h-5 text-lime" /> Dedicated party host</div>
                  <div className="flex items-center gap-3"><ShieldCheck className="w-5 h-5 text-lime" /> {tier.deposit}</div>
                </div>
                <div className="mt-8">
                  <BookingDialog bookingType="birthday_party" itemName={tier.name} price={tier.price} trigger={
                    <button className={`w-full font-display uppercase text-lg py-4 transition-colors ${tier.featured ? "bg-lime text-ink hover:bg-white" : "bg-white/10 text-white hover:bg-lime hover:text-ink"}`} data-testid={`party-book-${tier.name}`}>Book This Party</button>
                  } />
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Add-ons */}
        <Reveal>
          <div className="mt-8 border border-white/15 p-6 md:p-8 flex flex-col md:flex-row items-center justify-center gap-8">
            <span className="text-white/50 uppercase text-xs tracking-[0.2em] font-bold">Add-ons</span>
            {PARTY_ADDONS.map((a) => (
              <div key={a.label} className="flex items-center gap-3 text-white">
                <div className="w-8 h-8 bg-coral flex items-center justify-center"><Plus className="w-4 h-4" /></div>
                <span className="font-semibold">{a.label} <span className="text-lime">{a.price}</span></span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>

    {/* WHAT'S INCLUDED */}
    <section className="bg-cream text-ink py-20 md:py-28 diagonal-top">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8">
        <SectionHeading light overline="What's included" title="The full experience" className="mb-12" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {PARTY_INCLUDED.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.08}>
              <div className="bg-white border-2 border-ink hard-shadow p-6 h-full">
                <Check className="w-7 h-7 text-coral mb-4" />
                <div className="font-display text-2xl uppercase">{item.title}</div>
                <p className="text-ink/60 text-sm mt-2">{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-10 bg-ink text-white p-8 md:p-10 flex items-start gap-4">
            <ShieldCheck className="w-8 h-8 text-lime shrink-0" />
            <div>
              <h4 className="font-display text-2xl uppercase">Digital waiver, built into checkout</h4>
              <p className="text-white/60 mt-2 max-w-2xl">No printing, no scrambling on party day. Every booking includes a quick digital waiver you sign right in the checkout — signed and on file before you arrive.</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  </div>
);

export default BirthdayParties;
