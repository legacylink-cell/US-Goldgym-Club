import { Link } from "react-router-dom";
import { PageHero } from "@/components/common/PageHero";
import { Reveal, SectionHeading } from "@/components/common/Reveal";
import { QuoteRequestDialog } from "@/components/common/QuoteRequestDialog";
import { BookingDialog } from "@/components/common/BookingDialog";
import { IMG, SPECIAL_EVENTS } from "@/data/site";
import { ArrowUpRight, CalendarDays } from "lucide-react";

const isRequestOnly = (price) => /request|contact/i.test(price);

const SpecialEvents = () => (
  <div data-testid="special-events-page">
    <PageHero
      overline="Open gym, clinics & more"
      title={<>Special<br />Events</>}
      subtitle="Open gyms, skill clinics, parents' nights out, and troop events. There's always something happening at US Gold."
      image={IMG.facilityFloor}
    />

    <section className="bg-ink py-20 md:py-28">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <SectionHeading overline="What's on" title="Event catalog" />
          <Link to="/calendar" className="inline-flex items-center gap-2 text-lime uppercase tracking-wide font-bold text-sm hover:text-white" data-testid="events-to-calendar">
            <CalendarDays className="w-4 h-4" /> See full calendar
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SPECIAL_EVENTS.map((ev, i) => (
            <Reveal key={ev.name} delay={i * 0.06}>
              <div className="border border-white/15 bg-white/[0.03] p-7 h-full flex flex-col hover:border-lime transition-colors" data-testid={`special-event-${i}`}>
                <div className="text-lime text-xs uppercase tracking-[0.2em] font-bold">{ev.meta}</div>
                <h3 className="font-display text-3xl uppercase text-white leading-none mt-2">{ev.name}</h3>
                <div className="text-coral font-bold uppercase text-sm tracking-wide mt-2">{ev.price}</div>
                <p className="text-white/60 mt-4 flex-1">{ev.desc}</p>
                <div className="mt-6">
                  {isRequestOnly(ev.price) ? (
                    <QuoteRequestDialog program={ev.name} trigger={
                      <button className="w-full border border-lime text-lime font-display uppercase py-3 hover:bg-lime hover:text-ink transition-colors flex items-center justify-center gap-2" data-testid={`event-inquire-${i}`}>
                        Inquire <ArrowUpRight className="w-4 h-4" />
                      </button>
                    } />
                  ) : (
                    <BookingDialog bookingType="event" itemName={ev.name} price={ev.price} trigger={
                      <button className="w-full bg-lime text-ink font-display uppercase py-3 hover:bg-white transition-colors" data-testid={`event-signup-${i}`}>Sign Up</button>
                    } />
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default SpecialEvents;
