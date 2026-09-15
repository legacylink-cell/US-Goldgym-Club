import { PageHero } from "@/components/common/PageHero";
import { IMG, GOOGLE_CALENDAR, BUSINESS } from "@/data/site";
import { Phone } from "lucide-react";

const CalendarPage = () => (
  <div data-testid="calendar-page">
    <PageHero
      overline="Live schedule"
      title={<>Calendar<span className="text-lime">.</span></>}
      subtitle="Everything happening at the gym — clinics, open gyms, camps, and special events, straight from our own calendar."
      image={IMG.facilityEquip}
      height="min-h-[45vh]"
    />

    <section className="bg-ink py-14 md:py-20" data-testid="gcal-section">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8">
        <div className="border border-white/15 bg-ink p-2 md:p-3">
          <div
            className="relative"
            style={{ filter: "invert(0.92) hue-rotate(180deg)" }}
            data-testid="gcal-theme-wrap"
          >
            <iframe
              title="U.S. Gold Gymnastics & Cheer Academy Calendar"
              src={GOOGLE_CALENDAR.embedUrlAgenda}
              className="w-full h-[560px] border-0 md:hidden"
              loading="lazy"
              data-testid="gcal-iframe-mobile"
            />
            <iframe
              title="U.S. Gold Gymnastics & Cheer Academy Calendar"
              src={GOOGLE_CALENDAR.embedUrl}
              className="w-full h-[680px] border-0 hidden md:block"
              loading="lazy"
              scrolling="no"
              data-testid="gcal-iframe"
            />
            {/* covers Google's "Add to Google Calendar" link in the embed footer */}
            <div className="absolute left-0 bottom-0 h-[24px] w-[75%] md:w-[60%] bg-[#edf2f6]" data-testid="gcal-link-mask" />
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3 text-white/60 text-sm">
          <span>Dates and times are subject to change — call the front desk to confirm.</span>
          <a
            href={`tel:${BUSINESS.phone.replace(/[^\d]/g, "")}`}
            className="inline-flex items-center gap-2 text-pinklt font-bold hover:text-white transition-colors"
            data-testid="calendar-call-link"
          >
            <Phone className="w-4 h-4" /> {BUSINESS.phone}
          </a>
        </div>
      </div>
    </section>
  </div>
);

export default CalendarPage;
