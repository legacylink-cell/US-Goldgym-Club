import { PageHero } from "@/components/common/PageHero";
import { Reveal, SectionHeading } from "@/components/common/Reveal";
import { BookingDialog } from "@/components/common/BookingDialog";
import { IMG, CAMPS } from "@/data/site";
import { CalendarDays, Users, Tag } from "lucide-react";

const Camps = () => (
  <div data-testid="camps-page">
    <PageHero
      overline="Seasonal camps"
      title={<>Camps<span className="text-lime">.</span></>}
      subtitle="High-energy days of gymnastics, games, and new friends. Book by the day or the week — spots fill fast."
      image={IMG.preschoolGroup}
    />

    <section className="bg-ink py-20 md:py-28">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8">
        <SectionHeading overline="Upcoming camps" title="Grab a spot" className="mb-12" />
        <div className="grid md:grid-cols-2 gap-6">
          {CAMPS.map((camp, i) => (
            <Reveal key={camp.name} delay={i * 0.08}>
              <div className="border border-white/15 bg-white/[0.03] p-7 h-full flex flex-col hover:border-lime transition-colors" data-testid={`camp-card-${i}`}>
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-display text-3xl uppercase text-white leading-none">{camp.name}</h3>
                  <span className="bg-lime text-ink text-xs uppercase tracking-wide font-bold px-3 py-1 whitespace-nowrap">{camp.age}</span>
                </div>
                <div className="mt-4 space-y-2 text-white/70 text-sm">
                  <div className="flex items-center gap-2"><CalendarDays className="w-4 h-4 text-lime" /> {camp.dates}</div>
                  <div className="flex items-center gap-2"><Users className="w-4 h-4 text-lime" /> {camp.age}</div>
                  <div className="flex items-center gap-2"><Tag className="w-4 h-4 text-lime" /> {camp.price}</div>
                </div>
                <p className="text-white/60 mt-4 flex-1">{camp.desc}</p>
                <div className="mt-6">
                  <BookingDialog bookingType="camp" itemName={camp.name} price={camp.price} trigger={
                    <button className="w-full bg-lime text-ink font-display uppercase py-3 hover:bg-white transition-colors" data-testid={`camp-register-${i}`}>Register</button>
                  } />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default Camps;
