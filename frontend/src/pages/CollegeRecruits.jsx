import { PageHero } from "@/components/common/PageHero";
import { Reveal, SectionHeading } from "@/components/common/Reveal";
import { MagneticButton } from "@/components/common/MagneticButton";
import { IMG, RECRUIT_SCHOOLS } from "@/data/site";
import { GraduationCap } from "lucide-react";

const totalAthletes = RECRUIT_SCHOOLS.reduce((n, s) => n + s.athletes.length, 0);

const CollegeRecruits = () => (
  <div data-testid="college-recruits-page">
    <PageHero
      overline="From our gym to the NCAA"
      title={<>College<br />Recruits</>}
      subtitle="Our optional-level athletes don't just compete — they get recruited. Meet the alumni taking their skills to the collegiate stage."
      image={IMG.beamHandstand}
    />

    <section className="bg-ink py-20 md:py-28">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8">
        <SectionHeading
          overline={`${totalAthletes} alumni · ${RECRUIT_SCHOOLS.length} programs`}
          title="Where they landed"
          className="mb-12"
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {RECRUIT_SCHOOLS.map((group, i) => (
            <Reveal key={group.school} delay={(i % 3) * 0.06}>
              <div
                className="h-full border border-white/15 bg-white/[0.02] p-6 hover:border-lime transition-colors"
                data-testid={`recruit-school-${i}`}
              >
                <div className="flex items-start gap-3 pb-4 border-b border-white/10">
                  {group.logo ? (
                    <img src={group.logo} alt={group.school} className="w-12 h-12 object-contain shrink-0" />
                  ) : (
                    <span className="w-12 h-12 shrink-0 border border-lime/40 flex items-center justify-center text-pinklt font-display text-lg">
                      <GraduationCap className="w-5 h-5" />
                    </span>
                  )}
                  <div>
                    <div className="font-display text-2xl uppercase text-white leading-none">{group.short}</div>
                    <div className="text-white/50 text-xs mt-1.5 leading-snug">{group.school}</div>
                  </div>
                </div>
                <ul className="mt-4 space-y-3">
                  {group.athletes.map((a) => (
                    <li key={a.name} data-testid={`recruit-${a.name.toLowerCase().replace(/\s+/g, "-")}`}>
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-white font-semibold">
                          {a.name}
                          {a.year && <span className="text-white/45 font-normal text-sm"> · {a.year}</span>}
                        </span>
                        <span className="text-pinklt text-[10px] uppercase tracking-[0.15em] font-bold shrink-0">
                          {a.sport}
                        </span>
                      </div>
                      {a.note && <div className="text-white/45 text-xs mt-1">{a.note}</div>}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-14 grid lg:grid-cols-2 gap-10 items-center border border-lime/30 bg-lime/[0.04] p-8 md:p-12">
            <div>
              <SectionHeading overline="Our approach" title="We help you get seen" />
              <p className="text-white/70 mt-5 text-lg leading-relaxed">
                Getting recruited takes more than talent. We coach optional-level athletes on skill development,
                competition exposure, recruiting video, and connecting with college programs. If a collegiate
                career is the goal, we build the roadmap with you.
              </p>
              <div className="mt-8">
                <MagneticButton as="link" to="/contact" variant="lime" data-testid="recruits-contact">Talk to a Coach</MagneticButton>
              </div>
            </div>
            <img loading="lazy" decoding="async" src={IMG.heroVault} alt="Athlete" className="w-full h-80 object-cover" />
          </div>
        </Reveal>
      </div>
    </section>
  </div>
);

export default CollegeRecruits;
