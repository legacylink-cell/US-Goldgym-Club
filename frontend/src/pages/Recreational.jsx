import { Link } from "react-router-dom";
import { PageHero } from "@/components/common/PageHero";
import { Reveal, SectionHeading } from "@/components/common/Reveal";
import { IMG, REC_LEVELS, TUMBLE_CLASSES } from "@/data/site";
import { ArrowRight, ArrowUpRight, Clock, Layers, Users } from "lucide-react";

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
              <img loading="lazy" decoding="async" src={IMG.handstand} alt="Boys gymnastics" className="absolute inset-0 w-full h-full object-cover" />
            </div>
          </div>
        </Reveal>

        {/* Tumble classes */}
        <Reveal>
          <div className="mt-8 border border-white/15 bg-white/[0.03] p-8 md:p-10" data-testid="tumble-section">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-6">
              <div>
                <div className="text-lime text-xs uppercase tracking-[0.2em] font-bold mb-2">Also offered</div>
                <h3 className="font-display text-3xl md:text-4xl uppercase text-white leading-none">Tumble Classes</h3>
              </div>
              <p className="text-white/60 max-w-md md:text-right">
                Tumble classes let students of different skill levels train alongside their peers — perfect for gymnastics and cheer athletes building standing and running tumbling.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {TUMBLE_CLASSES.map((t) => (
                <div key={t.name} className="border border-white/10 p-5 flex items-center justify-between hover:border-lime transition-colors" data-testid={`tumble-${t.name}`}>
                  <span className="font-display text-2xl uppercase text-white">{t.name}</span>
                  <span className="text-lime text-xs uppercase tracking-wide font-bold">{t.level}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Discounts */}
        <div className="mt-12 border border-lime/40 bg-lime/[0.05] p-8 md:p-12" data-testid="rec-discounts">
          <div className="text-pinklt text-xs uppercase tracking-[0.25em] font-bold mb-2">Family friendly pricing</div>
          <h3 className="font-display text-3xl md:text-4xl uppercase text-white leading-none">More classes, more savings</h3>
          <p className="text-white/60 mt-3 max-w-2xl">
            We want your athlete in the gym as often as they love it — and we don't want a second child to be the reason you hold back.
          </p>

          <div className="grid md:grid-cols-2 gap-4 mt-8">
            <div className="border border-white/15 bg-ink/40 p-6" data-testid="discount-multi-class">
              <div className="w-11 h-11 bg-lime text-ink flex items-center justify-center mb-4"><Layers className="w-5 h-5" /></div>
              <div className="font-display text-2xl uppercase text-white leading-none">Multi-class discount</div>
              <p className="text-white/60 mt-3">
                Add a second class each week — gymnastics, tumble, or cheer — and every additional class comes at a reduced rate.
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
              to="/contact?topic=Class%20Enrollment&program=Recreational%20Classes"
              className="bg-lime text-ink font-display uppercase text-lg px-8 py-4 hover:bg-white transition-colors inline-flex items-center justify-center gap-2"
              data-testid="rec-request-pricing"
            >
              Ask about discounts <ArrowUpRight className="w-5 h-5" />
            </Link>
            <span className="text-white/50 text-sm">Tell us your athlete's age and schedule and we'll put together your exact rate.</span>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default Recreational;
