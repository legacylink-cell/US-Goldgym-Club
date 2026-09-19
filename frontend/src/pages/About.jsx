import { PageHero } from "@/components/common/PageHero";
import { Reveal, SectionHeading } from "@/components/common/Reveal";
import { MagneticButton } from "@/components/common/MagneticButton";
import { IMG, STAFF, BUSINESS } from "@/data/site";
import { Camera, MapPin } from "lucide-react";

const About = () => (
  <div data-testid="about-page">
    <PageHero
      overline="Our story"
      title={<>More than a gym<span className="text-lime">.</span></>}
      subtitle="Two decades of turning nervous first-timers into confidant athletes - and building a community families are proud to be part of."
      image={IMG.facilityFloor}
    />

    {/* SPLIT STORY */}
    <section className="bg-ink py-20 md:py-28">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8 grid lg:grid-cols-2 gap-14 items-center">
        <Reveal>
          <SectionHeading overline="How we started" title={<>Built by coaches,<br />for kids</>} />
          <div className="mt-6 space-y-4 text-white/70 text-lg leading-relaxed">
            <p>
              Our goal is to provide the best professional instruction for your child in a safe and friendly
              environment. Your comfort and satisfaction with our programs and services is our primary concern.
            </p>
            <p>
              We continuously strive to enhance our academy while ensuring the best possible experience for every
              family - from a preschooler's first cartwheel to competitive and cheer athletes chasing their goals.
            </p>
          </div>
          <div className="mt-8">
            <MagneticButton as="link" to="/contact" variant="lime" data-testid="about-trial">Book a Free Trial</MagneticButton>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="grid grid-cols-2 gap-4">
            <img loading="lazy" decoding="async" src={IMG.handstand} alt="Athlete" className="w-full h-72 object-cover" />
            <img loading="lazy" decoding="async" src={IMG.preschoolBeam} alt="Preschool" className="w-full h-72 object-cover mt-8" />
            <img loading="lazy" decoding="async" src={IMG.facilityEquip} alt="Facility" className="w-full h-72 object-cover -mt-4" />
            <img loading="lazy" decoding="async" src={IMG.cheerPose} alt="Cheer" className="w-full h-72 object-cover mt-4" />
          </div>
        </Reveal>
      </div>
    </section>

    {/* STAFF STRIP */}
    <section className="bg-cream text-ink py-20 md:py-28 diagonal-top">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8">
        <SectionHeading light overline="Meet the team" title="The people in the gym every day" className="mb-12 max-w-3xl" />
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {STAFF.map((s, i) => (
            <Reveal key={s.name} delay={i * 0.06}>
              <div className="bg-white border-2 border-ink hard-shadow overflow-hidden h-full" data-testid={`staff-card-${i}`}>
                <div className="h-56 flex flex-col items-center justify-center gap-2 bg-ink/[0.04] border-b-2 border-ink/10">
                  <Camera className="w-7 h-7 text-ink/30" />
                  <span className="text-ink/45 text-[11px] uppercase tracking-[0.2em] font-bold">Photo coming soon</span>
                </div>
                <div className="p-5">
                  <div className="font-display text-2xl uppercase leading-none">{s.name}</div>
                  <div className="text-coral text-xs uppercase tracking-[0.15em] font-bold mt-2">{s.role}</div>
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
              From Roanoke and every surrounding town - parents trust us with their kids
              because we treat every athlete like our own. When your child walks in, they're home.
            </p>
          </div>
          <div className="pointer-events-none absolute right-4 md:right-10 bottom-2 md:bottom-4 opacity-[0.07] font-display text-[6rem] md:text-[10rem] text-lime leading-none select-none">USG</div>
        </div>
      </div>
    </section>
  </div>
);

export default About;
