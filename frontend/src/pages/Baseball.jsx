import { PageHero } from "@/components/common/PageHero";
import { Reveal, SectionHeading } from "@/components/common/Reveal";
import { QuoteRequestDialog } from "@/components/common/QuoteRequestDialog";
import { MagneticButton } from "@/components/common/MagneticButton";
import { BASEBALL } from "@/data/site";
import { Target, Zap, User } from "lucide-react";

const ICONS = [Target, Zap, User];

const Baseball = () => (
  <div data-testid="baseball-page">
    <PageHero
      overline="Athletic development"
      title={<>Baseball<span className="text-lime">.</span></>}
      subtitle={BASEBALL.tagline}
      image={BASEBALL.hero}
    />

    <section className="bg-ink py-20 md:py-28">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8">
        <Reveal>
          <SectionHeading overline="The program" title="Train like an athlete" className="mb-6" />
          <p className="text-white/70 text-lg leading-relaxed max-w-3xl">{BASEBALL.intro}</p>
        </Reveal>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {BASEBALL.tracks.map((t, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <Reveal key={t.name} delay={i * 0.08}>
                <div className="border border-white/15 bg-white/[0.03] p-7 h-full hover:border-lime transition-colors" data-testid={`baseball-track-${i}`}>
                  <Icon className="w-7 h-7 text-lime mb-4" />
                  <h3 className="font-display text-2xl uppercase text-white leading-tight">{t.name}</h3>
                  <span className="inline-block mt-2 bg-lime text-ink text-xs uppercase tracking-wide font-bold px-3 py-1">{t.meta}</span>
                  <p className="text-white/60 mt-4 text-sm leading-relaxed">{t.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-14 flex flex-col sm:flex-row gap-4">
            <QuoteRequestDialog
              program="Baseball"
              trigger={
                <MagneticButton variant="lime" className="px-8 py-4" data-testid="baseball-request-btn">Request Pricing</MagneticButton>
              }
            />
            <MagneticButton as="link" to="/contact" variant="outline" className="px-8 py-4" data-testid="baseball-trial-btn">
              Book a Free Trial
            </MagneticButton>
          </div>
        </Reveal>
      </div>
    </section>
  </div>
);

export default Baseball;
