import { PageHero } from "@/components/common/PageHero";
import { Reveal, SectionHeading } from "@/components/common/Reveal";
import { QuoteRequestDialog } from "@/components/common/QuoteRequestDialog";
import { BookingDialog } from "@/components/common/BookingDialog";
import { IMG, PRESCHOOL_TIERS, PRESCHOOL_EXTRAS } from "@/data/site";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { Clock, ArrowUpRight } from "lucide-react";

const Preschool = () => (
  <div data-testid="preschool-page">
    <PageHero
      overline="Ages walking – 5 yrs"
      title={<>Preschool<span className="text-lime">.</span></>}
      subtitle="Where big adventures start small. Structured, playful classes that build coordination, confidence, and a lifelong love of movement."
      image={IMG.preschoolBeam}
    />

    <section className="bg-ink py-20 md:py-28">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8">
        <SectionHeading overline="Choose an age tier" title="Classes by age & stage" className="mb-4" />
        <p className="text-white/60 max-w-2xl mb-12">Every tier is designed for the developmental stage of your child. Tap any class to see length and focus.</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRESCHOOL_TIERS.map((tier, i) => (
            <Reveal key={tier.name} delay={i * 0.06}>
              <div className="border border-white/15 bg-white/[0.03] overflow-hidden h-full group hover:border-lime transition-colors" data-testid={`preschool-tier-${tier.name}`}>
                <div className="h-44 overflow-hidden relative">
                  <img src={IMG[tier.img]} alt={tier.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute top-3 left-3 bg-lime text-ink text-[10px] uppercase tracking-wide font-bold px-2 py-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {tier.length}
                  </div>
                </div>
                <Accordion type="single" collapsible>
                  <AccordionItem value="x" className="border-0">
                    <AccordionTrigger className="px-5 py-4 hover:no-underline">
                      <div className="text-left">
                        <div className="font-display text-2xl uppercase text-white">{tier.name}</div>
                        <div className="text-lime text-xs uppercase tracking-wide">{tier.age}</div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-5 pb-5 text-white/70">{tier.focus}</AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Pricing CTA */}
        <div className="mt-12 border border-lime/40 bg-lime/[0.05] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-3xl md:text-4xl uppercase text-white">Tuition varies by weekly frequency</h3>
            <p className="text-white/60 mt-2 max-w-xl">Preschool pricing depends on how many days per week your child attends. Request a personalized quote and we'll get right back to you.</p>
          </div>
          <QuoteRequestDialog program="Preschool" trigger={
            <button className="bg-lime text-ink font-display uppercase text-lg px-8 py-4 hover:bg-white transition-colors whitespace-nowrap flex items-center gap-2" data-testid="preschool-request-pricing">
              Request Class Pricing <ArrowUpRight className="w-5 h-5" />
            </button>
          } />
        </div>
      </div>
    </section>

    {/* EXTRAS */}
    <section className="bg-cream text-ink py-20 md:py-28 diagonal-top">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8">
        <SectionHeading light overline="Bookable extras" title="More ways to play & learn" className="mb-12" />
        <div className="grid md:grid-cols-2 gap-6">
          {PRESCHOOL_EXTRAS.map((ex, i) => (
            <Reveal key={ex.name} delay={i * 0.08}>
              <div className="bg-white border-2 border-ink hard-shadow p-8 h-full flex flex-col">
                <div className="font-display text-3xl uppercase">{ex.name}</div>
                <div className="text-coral font-bold uppercase text-sm tracking-wide mt-1">{ex.price}</div>
                <p className="text-ink/70 mt-4 flex-1">{ex.desc}</p>
                <div className="mt-6">
                  <BookingDialog bookingType="event" itemName={ex.name} price={ex.price} trigger={
                    <button className="bg-ink text-white font-display uppercase px-6 py-3 hover:bg-lime hover:text-ink transition-colors" data-testid={`preschool-book-${ex.name}`}>Book Now</button>
                  } />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default Preschool;
