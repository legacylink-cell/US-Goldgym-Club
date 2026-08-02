import { PageHero } from "@/components/common/PageHero";
import { Reveal, SectionHeading } from "@/components/common/Reveal";
import { MagneticButton } from "@/components/common/MagneticButton";
import { IMG, CAREERS, BUSINESS } from "@/data/site";
import { Briefcase, Mail, ArrowRight } from "lucide-react";

const Careers = () => (
  <div data-testid="careers-page">
    <PageHero
      overline="Join our team"
      title={<>Careers<span className="text-lime">.</span></>}
      subtitle="Employment opportunities at U.S. Gold Gymnastics & Cheer Academy."
      image={IMG.coach}
    />

    <section className="bg-ink py-20 md:py-28">
      <div className="max-w-[1100px] mx-auto px-5 md:px-8">
        <Reveal>
          <SectionHeading overline="Employment Opportunities" title="Work with kids you'll love" className="mb-6" />
          <p className="text-white/70 text-lg leading-relaxed max-w-3xl">{CAREERS.intro}</p>
        </Reveal>

        <div className="mt-12 grid md:grid-cols-2 gap-5">
          {CAREERS.positions.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <div className="border border-white/15 bg-white/[0.03] p-7 h-full hover:border-lime transition-colors" data-testid={`career-card-${i}`}>
                <Briefcase className="w-6 h-6 text-lime mb-4" />
                <h3 className="font-display text-2xl uppercase text-white leading-tight">{p.title}</h3>
                <p className="text-white/60 mt-3 text-sm">{p.note}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-14 border border-lime/40 bg-lime/[0.06] p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="text-lime text-xs uppercase tracking-[0.25em] font-bold mb-2">How to apply</div>
              <p className="text-white text-lg md:text-xl font-semibold max-w-xl">
                To request an application, email us at{" "}
                <a href={`mailto:${BUSINESS.email}`} className="text-lime underline decoration-lime/40 hover:decoration-lime" data-testid="careers-email">
                  {BUSINESS.email}
                </a>
                .
              </p>
            </div>
            <MagneticButton as="a" href={`mailto:${BUSINESS.email}?subject=Employment%20Application%20Request`} variant="lime" className="px-7 py-4 shrink-0" data-testid="careers-apply-btn">
              <Mail className="w-5 h-5" /> Request Application
            </MagneticButton>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-8 text-center">
            <a href="/contact" className="inline-flex items-center gap-2 text-white/60 hover:text-lime text-sm uppercase tracking-wide font-semibold" data-testid="careers-contact-link">
              Questions? Get in touch <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  </div>
);

export default Careers;
