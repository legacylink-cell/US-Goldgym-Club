import { PageHero } from "@/components/common/PageHero";
import { Reveal, SectionHeading } from "@/components/common/Reveal";
import { QuoteRequestDialog } from "@/components/common/QuoteRequestDialog";
import { IMG, REC_LEVELS } from "@/data/site";
import { ArrowRight, ArrowUpRight, Clock } from "lucide-react";

const Recreational = () => (
  <div data-testid="recreational-page">
    <PageHero
      overline="Beginner → Advanced"
      title={<>Recreational<br />Classes</>}
      subtitle="A clear, coached progression from first cartwheels to advanced skills — with a dedicated Boys Gymnastics track."
      image={IMG.floorJump}
    />

    <section className="bg-ink py-20 md:py-28">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8">
        <SectionHeading overline="The progression" title="Level up, step by step" className="mb-12" />

        {/* Progression graphic */}
        <div className="grid lg:grid-cols-4 gap-4">
          {REC_LEVELS.map((lvl, i) => (
            <Reveal key={lvl.name} delay={i * 0.08}>
              <div className="relative border border-white/15 bg-white/[0.03] p-6 h-full hover:border-lime transition-colors group" data-testid={`rec-level-${lvl.name}`}>
                <div className="font-display text-6xl text-white/10 leading-none group-hover:text-lime/20 transition-colors">0{i + 1}</div>
                <div className="font-display text-2xl uppercase text-white mt-2">{lvl.name}</div>
                <div className="flex items-center gap-2 text-lime text-xs uppercase tracking-wide font-bold mt-1">
                  <Clock className="w-3 h-3" /> {lvl.length}{lvl.usag && ` • ${lvl.usag}`}
                </div>
                <p className="text-white/60 text-sm mt-4">{lvl.desc}</p>
                {i < REC_LEVELS.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute top-1/2 -right-5 w-6 h-6 text-lime z-10" />
                )}
              </div>
            </Reveal>
          ))}
        </div>

        {/* Boys track */}
        <Reveal>
          <div className="mt-8 relative overflow-hidden border border-white/15 grid md:grid-cols-2">
            <div className="p-8 md:p-12">
              <div className="text-coral text-xs uppercase tracking-[0.2em] font-bold mb-3">Separate track</div>
              <h3 className="font-display text-4xl md:text-5xl uppercase text-white leading-none">Boys Gymnastics</h3>
              <div className="flex items-center gap-2 text-lime text-sm uppercase tracking-wide font-bold mt-3"><Clock className="w-4 h-4" /> 55 min</div>
              <p className="text-white/70 mt-4 max-w-md">A boys-only class built around the men's events — floor, trampoline, vault, and bars. Strength, power, and serious fun.</p>
              <div className="flex flex-wrap gap-2 mt-5">
                {["Floor", "Trampoline", "Vault", "Bars"].map((e) => (
                  <span key={e} className="bg-white/10 text-white text-xs uppercase tracking-wide font-bold px-3 py-1">{e}</span>
                ))}
              </div>
            </div>
            <div className="h-64 md:h-auto relative">
              <img src={IMG.handstand} alt="Boys gymnastics" className="absolute inset-0 w-full h-full object-cover" />
            </div>
          </div>
        </Reveal>

        {/* Pricing CTA */}
        <div className="mt-12 border border-lime/40 bg-lime/[0.05] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-3xl md:text-4xl uppercase text-white">Tuition set by weekly frequency</h3>
            <p className="text-white/60 mt-2 max-w-xl">Rates depend on your class schedule. Request a quote and we'll match your athlete to the right level and price.</p>
          </div>
          <QuoteRequestDialog program="Recreational Classes" trigger={
            <button className="bg-lime text-ink font-display uppercase text-lg px-8 py-4 hover:bg-white transition-colors whitespace-nowrap flex items-center gap-2" data-testid="rec-request-pricing">
              Request Pricing <ArrowUpRight className="w-5 h-5" />
            </button>
          } />
        </div>
      </div>
    </section>
  </div>
);

export default Recreational;
