import { PageHero } from "@/components/common/PageHero";
import { Reveal, SectionHeading } from "@/components/common/Reveal";
import { MagneticButton } from "@/components/common/MagneticButton";
import { IMG, STAFF, BUSINESS } from "@/data/site";
import { BadgeCheck, MapPin } from "lucide-react";

const About = () => (
  <div data-testid="about-page">
    <PageHero
      overline="Our story"
      title={<>More than a gym<span className="text-lime">.</span></>}
      subtitle="Two decades of turning nervous first-timers into confident athletes — and building a community families are proud to be part of."
      image={IMG.facilityFloor}
    />

    {/* SPLIT STORY */}
    <section className="bg-ink py-20 md:py-28">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8 grid lg:grid-cols-2 gap-14 items-center">
        <Reveal>
          <SectionHeading overline="How we started" title={<>Built by coaches,<br />for kids</>} />
          <div className="mt-6 space-y-4 text-white/70 text-lg leading-relaxed">
            <p>
              US Gold began with a simple belief: every child deserves a place to move, fall, get back up,
              and discover what they're capable of. What started as a handful of preschool classes has grown
              into a full academy serving recreational, competitive, and cheer athletes.
            </p>
            <p>
              Our coaches are former competitors and lifelong educators. They know that the beam and the bars
              teach far more than skills — they teach grit, focus, and belief in yourself.
            </p>
          </div>
          <div className="mt-8">
            <MagneticButton as="link" to="/contact" variant="lime" data-testid="about-trial">Book a Free Trial</MagneticButton>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="grid grid-cols-2 gap-4">
            <img src={IMG.handstand} alt="Athlete" className="w-full h-72 object-cover" />
            <img src={IMG.preschoolBeam} alt="Preschool" className="w-full h-72 object-cover mt-8" />
            <img src={IMG.facilityEquip} alt="Facility" className="w-full h-72 object-cover -mt-4" />
            <img src={IMG.cheerPose} alt="Cheer" className="w-full h-72 object-cover mt-4" />
          </div>
        </Reveal>
      </div>
    </section>

    {/* STAFF STRIP */}
    <section className="bg-cream text-ink py-20 md:py-28 diagonal-top">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8">
        <SectionHeading light overline="Meet the team" title="Certified & obsessed with your kid's progress" className="mb-12 max-w-3xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STAFF.map((s, i) => (
            <Reveal key={s.name} delay={i * 0.08}>
              <div className="bg-white border-2 border-ink hard-shadow overflow-hidden group">
                <div className="h-56 overflow-hidden">
                  <img src={IMG[s.img]} alt={s.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-5">
                  <div className="font-display text-2xl uppercase">{s.name}</div>
                  <div className="text-ink/60 text-sm mb-3">{s.role}</div>
                  <div className="flex flex-wrap gap-2">
                    {s.certs.map((c) => (
                      <span key={c} className="inline-flex items-center gap-1 bg-ink text-lime text-[10px] uppercase tracking-wide font-bold px-2 py-1">
                        <BadgeCheck className="w-3 h-3" /> {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

    {/* COMMUNITY ROOTS */}
    <section className="bg-ink py-20 md:py-28">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8">
        <div className="relative border border-lime/30 bg-lime/[0.04] p-8 md:p-14 overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-2 text-lime text-xs uppercase tracking-[0.2em] font-bold mb-4">
              <MapPin className="w-4 h-4" /> Rooted in the community
            </div>
            <h3 className="font-display text-4xl md:text-5xl uppercase text-white leading-none">
              Families come from every surrounding town
            </h3>
            <p className="mt-5 text-white/70 text-lg leading-relaxed">
              From Roanoke to Keller, Trophy Club, Fort Worth, and beyond — parents trust us with their kids
              because we treat every athlete like our own. When your child walks in, they're home.
            </p>
          </div>
          <div className="absolute -right-10 -bottom-10 opacity-10 font-display text-[12rem] text-lime leading-none select-none">USG</div>
        </div>
      </div>
    </section>
  </div>
);

export default About;
