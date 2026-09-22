import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import { PageHero } from "@/components/common/PageHero";
import { ClassSchedule } from "@/components/common/ClassSchedule";
import { IMG, EVENT_CATEGORIES, BUSINESS } from "@/data/site";
import { ChevronLeft, ChevronRight, Clock, MapPin, Phone } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const catColor = (c) => EVENT_CATEGORIES[c]?.color || "#C77DFF";

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [view, setView] = useState(() => (typeof window !== "undefined" && window.innerWidth < 768 ? "list" : "month"));
  const [cursor, setCursor] = useState(dayjs());
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    api.get("/gcal/events").then(({ data }) => setEvents(data)).catch(() => setError(true));
  }, []);

  const filtered = useMemo(
    () => (filter === "all" ? events : events.filter((e) => e.category === filter)),
    [events, filter]
  );

  const byDate = useMemo(() => {
    const map = {};
    filtered.forEach((e) => {
      (map[e.date] = map[e.date] || []).push(e);
    });
    return map;
  }, [filtered]);

  const monthDays = useMemo(() => {
    const start = cursor.startOf("month").startOf("week");
    const end = cursor.endOf("month").endOf("week");
    const days = [];
    let d = start;
    while (d.isBefore(end) || d.isSame(end, "day")) {
      days.push(d);
      d = d.add(1, "day");
    }
    return days;
  }, [cursor]);

  const weekDays = useMemo(() => {
    const start = cursor.startOf("week");
    return Array.from({ length: 7 }, (_, i) => start.add(i, "day"));
  }, [cursor]);

  const upcoming = useMemo(() => {
    const today = dayjs().format("YYYY-MM-DD");
    return filtered.filter((e) => e.date >= today).slice(0, 40);
  }, [filtered]);

  const step = (dir) => setCursor(cursor.add(dir, view === "week" ? "week" : "month"));

  return (
    <div data-testid="calendar-page">
      <PageHero
        overline="Live schedule"
        title={<>Calendar<span className="text-lime">.</span></>}
        subtitle="Everything happening at the gym - clinics, open gyms, camps, and special events, straight from our own calendar."
        image={IMG.facilityEquip}
        height="min-h-[45vh]"
      />

      <section className="bg-ink py-12 md:py-20">
        <div className="max-w-[1400px] mx-auto px-5 md:px-8">
          {/* Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-6">
            <div className="flex items-center gap-4">
              <div className="flex border border-white/15 shrink-0">
                <button onClick={() => step(-1)} className="p-3 text-white hover:bg-lime hover:text-ink transition-colors" aria-label="Previous" data-testid="cal-prev"><ChevronLeft className="w-5 h-5" /></button>
                <button onClick={() => step(1)} className="p-3 text-white hover:bg-lime hover:text-ink transition-colors border-l border-white/15" aria-label="Next" data-testid="cal-next"><ChevronRight className="w-5 h-5" /></button>
              </div>
              <div className="font-display text-2xl md:text-3xl uppercase text-white leading-none" data-testid="cal-title">
                {view === "week"
                  ? `${cursor.startOf("week").format("MMM D")} – ${cursor.endOf("week").format("MMM D")}`
                  : view === "list"
                  ? "Upcoming events"
                  : cursor.format("MMMM YYYY")}
              </div>
            </div>

            <div className="flex border border-white/15 self-start">
              {["month", "week", "list"].map((v) => (
                <button key={v} onClick={() => setView(v)} className={`px-4 py-2 uppercase text-xs font-bold tracking-wide transition-colors ${view === v ? "bg-lime text-ink" : "text-white hover:bg-white/10"}`} data-testid={`cal-view-${v}`}>{v}</button>
              ))}
            </div>
          </div>

          {/* Category key */}
          <div className="flex flex-wrap gap-2 mb-7" data-testid="cal-legend">
            <button onClick={() => setFilter("all")} className={`px-3 py-1.5 text-xs uppercase font-bold tracking-wide border ${filter === "all" ? "bg-white text-ink border-white" : "text-white/70 border-white/20 hover:border-white"}`} data-testid="cal-filter-all">All</button>
            {Object.entries(EVENT_CATEGORIES).map(([key, cat]) => (
              <button key={key} onClick={() => setFilter(key)} className={`px-3 py-1.5 text-xs uppercase font-bold tracking-wide border flex items-center gap-2 ${filter === key ? "text-ink border-transparent" : "text-white/70 border-white/20 hover:border-white"}`} style={filter === key ? { background: cat.color } : {}} data-testid={`cal-filter-${key}`}>
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: cat.color }} /> {cat.label}
              </button>
            ))}
          </div>

          {error && (
            <div className="border border-white/15 bg-white/[0.03] p-8 text-center text-white/60" data-testid="cal-error">
              Our calendar is taking a breather. Call {BUSINESS.phone} and we'll walk you through the schedule.
            </div>
          )}

          {/* MONTH VIEW */}
          {!error && view === "month" && (
            <div className="overflow-x-auto -mx-5 px-5 md:mx-0 md:px-0">
              <div className="border border-white/15 min-w-[680px]" data-testid="cal-month-grid">
                <div className="grid grid-cols-7 border-b border-white/15">
                  {WEEKDAYS.map((d) => (
                    <div key={d} className="p-3 text-center text-white/50 text-xs uppercase tracking-wide font-bold">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7">
                  {monthDays.map((d) => {
                    const key = d.format("YYYY-MM-DD");
                    const dayEvents = byDate[key] || [];
                    const inMonth = d.month() === cursor.month();
                    return (
                      <div key={key} className={`min-h-[96px] md:min-h-[116px] border-b border-r border-white/10 p-2 ${inMonth ? "" : "bg-white/[0.015]"}`}>
                        <div className={`text-xs mb-1.5 ${d.isSame(dayjs(), "day") ? "text-lime font-bold" : inMonth ? "text-white/70" : "text-white/25"}`}>{d.date()}</div>
                        <div className="space-y-1">
                          {dayEvents.map((e) => (
                            <button key={e.id} onClick={() => setSelected(e)} className="w-full text-left px-1.5 py-1 text-[10px] font-bold uppercase truncate text-ink hover:opacity-80" style={{ background: catColor(e.category) }} data-testid={`cal-event-${e.id}`}>
                              {e.title}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* WEEK VIEW */}
          {!error && view === "week" && (
            <div className="grid grid-cols-1 md:grid-cols-7 gap-3" data-testid="cal-week-grid">
              {weekDays.map((d) => {
                const key = d.format("YYYY-MM-DD");
                const dayEvents = byDate[key] || [];
                return (
                  <div key={key} className="border border-white/15 p-3 min-h-[120px] md:min-h-[150px]">
                    <div className={`text-xs uppercase tracking-wide font-bold mb-3 ${d.isSame(dayjs(), "day") ? "text-lime" : "text-white/60"}`}>{d.format("ddd D")}</div>
                    <div className="space-y-2">
                      {dayEvents.map((e) => (
                        <button key={e.id} onClick={() => setSelected(e)} className="w-full text-left p-2 text-xs text-ink font-bold uppercase" style={{ background: catColor(e.category) }} data-testid={`cal-event-${e.id}`}>
                          <span className="block truncate">{e.title}</span>
                          <span className="block font-normal normal-case opacity-80">{e.time}</span>
                        </button>
                      ))}
                      {dayEvents.length === 0 && <div className="text-white/20 text-xs">-</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* LIST VIEW */}
          {!error && view === "list" && (
            <div className="space-y-3" data-testid="cal-list">
              {upcoming.length === 0 && <div className="text-white/50 border border-white/15 p-8 text-center">No upcoming events for this filter.</div>}
              {upcoming.map((e) => (
                <button key={e.id} onClick={() => setSelected(e)} className="w-full text-left border border-white/15 bg-white/[0.03] p-4 md:p-5 flex items-center gap-4 hover:border-lime transition-colors" data-testid={`cal-event-${e.id}`}>
                  <div className="w-1.5 h-12 shrink-0" style={{ background: catColor(e.category) }} />
                  <div className="w-20 md:w-40 shrink-0">
                    <div className="font-display text-lg md:text-xl uppercase text-white leading-none">{dayjs(e.date).format("MMM D")}</div>
                    <div className="text-white/50 text-xs mt-1">{dayjs(e.date).format("ddd")}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-xl md:text-2xl uppercase text-white leading-tight truncate">{e.title}</div>
                    <div className="text-white/60 text-sm">{e.time}</div>
                  </div>
                  <div className="hidden md:block text-xs uppercase font-bold tracking-wide" style={{ color: catColor(e.category) }}>
                    {EVENT_CATEGORIES[e.category]?.label}
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-2 text-white/50 text-sm">
            <span>Dates and times are subject to change - call the front desk to confirm.</span>
            <a href={`tel:${BUSINESS.phone.replace(/[^\d]/g, "")}`} className="inline-flex items-center gap-2 text-pinklt font-bold hover:text-white transition-colors" data-testid="calendar-call-link">
              <Phone className="w-4 h-4" /> {BUSINESS.phone}
            </a>
          </div>

          <div className="mt-16 pt-12 border-t border-white/10">
            <ClassSchedule />
          </div>
        </div>
      </section>

      {/* EVENT DETAIL DIALOG */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="bg-ink border border-white/15 text-white rounded-none max-w-lg" data-testid="cal-event-dialog">
          {selected && (
            <>
              <DialogHeader>
                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wide font-bold mb-1" style={{ color: catColor(selected.category) }}>
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: catColor(selected.category) }} />
                  {EVENT_CATEGORIES[selected.category]?.label}
                </div>
                <DialogTitle className="font-display text-3xl md:text-4xl uppercase text-white text-left">{selected.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 text-white/75 mt-2">
                <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-lime" /> {dayjs(selected.date).format("dddd, MMMM D")} • {selected.time}</div>
                {selected.location && <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-lime" /> {selected.location}</div>}
                {selected.description && <p className="text-white/60 pt-1 whitespace-pre-line">{selected.description}</p>}
              </div>
              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <Link to={`/contact?topic=Event%20Sign%20Up&event=${encodeURIComponent(selected.title)}`} className="flex-1 bg-lime text-ink font-display uppercase py-3 text-center hover:bg-white transition-colors" data-testid="cal-signup">
                  Sign up / Ask a question
                </Link>
                <a href={`tel:${BUSINESS.phone.replace(/[^\d]/g, "")}`} className="flex-1 border border-lime text-lime font-display uppercase py-3 text-center hover:bg-lime hover:text-ink transition-colors" data-testid="cal-call">
                  Call the gym
                </a>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarPage;
