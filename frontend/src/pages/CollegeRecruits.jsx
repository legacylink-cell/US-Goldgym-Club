import { PageHero } from "@/components/common/PageHero";
import { Reveal, SectionHeading } from "@/components/common/Reveal";
import { MagneticButton } from "@/components/common/MagneticButton";
import { IMG, RECRUITS } from "@/data/site";
import { GraduationCap, Trophy } from "lucide-react";

const CollegeRecruits = () => (
  <div data-testid="recruits-page">
    <PageHero
      overline="From our gym to the NCAA"
      title={<>College<br />Recruits</>}
      subtitle="Our optional-level athletes don't just compete — they get recruited. Meet the alumni taking their skills to the collegiate stage."
      image={IMG.beamHandstand}
    />

    <section className="bg-ink py-20 md:py-28">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8">
        <SectionHeading overline="Alumni showcase" title="Where they landed" className="mb-12" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {RECRUITS.map((r, i) => (
            <Reveal key={r.name} delay={i * 0.06}>
              <div className="border border-white/15 overflow-hidden group hover:border-lime transition-colors" data-testid={`recruit-card-${i}`}>
                <div className="h-64 overflow-hidden relative">
                  <img src={IMG[r.img]} alt={r.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink to-transparent" />
                  <div className="absolute top-3 right-3 bg-coral text-white text-[10px] uppercase tracking-wide font-bold px-2 py-1 flex items-center gap-1">
                    <Trophy className="w-3 h-3" /> {r.level}
                  </div>
                </div>
                <div className="p-6">
                  <div className="font-display text-3xl uppercase text-white leading-none">{r.name}</div>
                  <div className="flex items-center gap-2 text-lime mt-3">
                    <GraduationCap className="w-5 h-5" />
                    <span className="font-semibold">{r.college}</span>
                  </div>
                </div>
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
            <img src={IMG.floorJump} alt="Athlete" className="w-full h-80 object-cover" />
          </div>
        </Reveal>
      </div>
    </section>
  </div>
);

export default CollegeRecruits;
