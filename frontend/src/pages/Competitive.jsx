import { PageHero } from "@/components/common/PageHero";
import { Reveal, SectionHeading } from "@/components/common/Reveal";
import { MagneticButton } from "@/components/common/MagneticButton";
import { IMG, COMPETITIVE_PATH } from "@/data/site";
import { Trophy, ChevronRight } from "lucide-react";

const Competitive = () => (
  <div data-testid="competitive-page">
    <PageHero
      overline="USAG Levels 3 – 10"
      title={<>Competitive<br />Gymnastics</>}
      subtitle="A true pathway to elite competition. From invite-only pre-team to college recruiting, we develop athletes for the long game."
      image={IMG.beamHandstand}
    />

    <section className="bg-ink py-20 md:py-28">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8">
        <SectionHeading overline="The pathway" title="Climb the ladder" className="mb-12" />

        <div className="relative">
          {COMPETITIVE_PATH.map((step, i) => (
            <Reveal key={step.name} delay={i * 0.1}>
              <div className="relative flex gap-6 pb-10 last:pb-0" data-testid={`comp-step-${i}`}>
                <div className="flex flex-col items-center">
                  <div className={`w-14 h-14 flex items-center justify-center font-display text-2xl shrink-0 ${i === COMPETITIVE_PATH.length - 1 ? "bg-coral text-white" : "bg-lime text-ink"}`}>
                    {i === COMPETITIVE_PATH.length - 1 ? <Trophy className="w-6 h-6" /> : i + 1}
                  </div>
                  {i < COMPETITIVE_PATH.length - 1 && <div className="w-0.5 flex-1 bg-gradient-to-b from-lime to-white/10 mt-2" />}
                </div>
                <div className="flex-1 border border-white/15 bg-white/[0.03] p-6 md:p-8 -mt-1 hover:border-lime transition-colors">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-display text-3xl uppercase text-white">{step.name}</h3>
                    <ChevronRight className="w-5 h-5 text-lime" />
                    <span className="text-lime text-xs uppercase tracking-wide font-bold">{step.detail}</span>
                  </div>
                  <p className="text-white/70 mt-3 max-w-2xl">{step.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-8 border border-lime/40 bg-lime/[0.05] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-3xl md:text-4xl uppercase text-white">Team fees are by invitation</h3>
            <p className="text-white/60 mt-2 max-w-xl">Competitive team placement is by evaluation and invite. Fees are custom to each level and season — reach out to learn more or schedule an assessment.</p>
          </div>
          <MagneticButton as="link" to="/contact" variant="lime" data-testid="comp-contact">Inquire About Team</MagneticButton>
        </div>
      </div>
    </section>
  </div>
);

export default Competitive;
