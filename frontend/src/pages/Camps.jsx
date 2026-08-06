import { PageHero } from "@/components/common/PageHero";
import { Reveal, SectionHeading } from "@/components/common/Reveal";
import { MagneticButton } from "@/components/common/MagneticButton";
import { IMG, CAMP_SESSIONS, LITTLE_DOG_DAYS, CAMP_INFO, PDFS } from "@/data/site";
import { CalendarDays, Users, Clock, Info, FileText, Download } from "lucide-react";

const Camps = () => (
  <div data-testid="camps-page">
    <PageHero
      overline="Summer 2026"
      title={<>Summer<br />Camps<span className="text-lime">.</span></>}
      subtitle="Nine weeks of themed, high-energy fun — gymnastics, games, crafts, and new friends. Book by the day or the week."
      image={IMG.preschoolGroup}
    />

    <section className="bg-ink py-20 md:py-28">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8">
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          <InfoCard icon={Users} label="Ages" value={CAMP_INFO.ages} />
          <InfoCard icon={Clock} label="Drop-off / Pick-up" value={CAMP_INFO.hours} />
          <InfoCard icon={Info} label="Good to know" value={CAMP_INFO.note} />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <MagneticButton as="a" href={PDFS.campRegistration} variant="lime" className="px-7 py-4" data-testid="camp-registration-btn">
            <Download className="w-5 h-5" /> Registration Form
          </MagneticButton>
          <MagneticButton as="a" href={PDFS.campPolicies} variant="outline" className="px-7 py-4" data-testid="camp-policies-btn">
            <FileText className="w-5 h-5" /> Camp Policies
          </MagneticButton>
        </div>

        <SectionHeading overline="Summer Fun Camp" title="Weekly themes" className="mb-10" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CAMP_SESSIONS.map((c, i) => (
            <Reveal key={c.name} delay={(i % 3) * 0.06}>
              <div className="border border-white/15 bg-white/[0.03] p-6 h-full hover:border-lime transition-colors" data-testid={`camp-week-${i}`}>
                <div className="text-lime text-xs uppercase tracking-[0.2em] font-bold mb-2">Week {i + 1}</div>
                <h3 className="font-display text-2xl uppercase text-white leading-tight">{c.name}</h3>
                <div className="flex items-center gap-2 text-white/60 text-sm mt-3">
                  <CalendarDays className="w-4 h-4 text-lime" /> {c.dates}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-[#1E0838] py-20 md:py-28 border-t border-white/10">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5">
            <SectionHeading overline="For our youngest" title={<>Little Dog<br />Days Camp<span className="text-lime">.</span></>} className="mb-5" />
            <p className="text-white/70 leading-relaxed">{LITTLE_DOG_DAYS.desc}</p>
            <div className="mt-5 inline-block bg-lime text-ink font-display uppercase text-lg px-4 py-2" data-testid="little-dog-price">
              {LITTLE_DOG_DAYS.price}
            </div>
            <div className="mt-8">
              <MagneticButton as="a" href={PDFS.littleDogDays} variant="lime" className="px-7 py-4" data-testid="little-dog-signup-btn">
                <Download className="w-5 h-5" /> Sign-Up Form
              </MagneticButton>
            </div>
          </div>
          <div className="lg:col-span-7 grid sm:grid-cols-3 gap-5">
            {LITTLE_DOG_DAYS.sessions.map((s, i) => (
              <Reveal key={s.name} delay={i * 0.08}>
                <div className="border border-white/15 bg-white/[0.03] p-6 h-full hover:border-lime transition-colors" data-testid={`little-dog-session-${i}`}>
                  <h3 className="font-display text-xl uppercase text-white leading-tight">{s.name}</h3>
                  <div className="flex items-center gap-2 text-white/60 text-sm mt-3">
                    <CalendarDays className="w-4 h-4 text-lime" /> {s.dates}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  </div>
);

const InfoCard = ({ icon: Icon, label, value }) => (
  <div className="border border-white/15 bg-white/[0.03] p-6" data-testid={`camp-info-${label.toLowerCase().replace(/[^a-z]+/g, "-")}`}>
    <Icon className="w-6 h-6 text-lime mb-3" />
    <div className="text-white/50 text-xs uppercase tracking-wide mb-1">{label}</div>
    <div className="text-white/80 text-sm leading-relaxed">{value}</div>
  </div>
);

export default Camps;
