import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import api from "@/lib/api";
import { PageHero } from "@/components/common/PageHero";
import { BookingDialog } from "@/components/common/BookingDialog";
import { QuoteRequestDialog } from "@/components/common/QuoteRequestDialog";
import { IMG, EVENT_CATEGORIES } from "@/data/site";
import { ChevronLeft, ChevronRight, Clock, Tag, Users } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

const isRequestOnly = (price) => /request|contact|see calendar/i.test(price || "");

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [view, setView] = useState("month");
  const [cursor, setCursor] = useState(dayjs());
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get("/events").then(({ data }) => setEvents(data));
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

  return (
    <div data-testid="calendar-page">
      <PageHero
        overline="Live schedule"
        title={<>Calendar<span className="text-lime">.</span></>}
        subtitle="Everything happening at the gym — clinics, open gyms, camps, and special events. Click any event to see details and register."
        image={IMG.facilityEquip}
        height="min-h-[45vh]"
      />

      <section className="bg-ink py-14 md:py-20">
        <div className="max-w-[1400px] mx-auto px-5 md:px-8">
          {/* Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-8">
            <div className="flex items-center gap-4">
              <div className="flex border border-white/15">
                <button onClick={() => setCursor(cursor.subtract(1, view === "week" ? "week" : "month"))} className="p-3 text-white hover:bg-lime hover:text-ink transition-colors" data-testid="cal-prev"><ChevronLeft className="w-5 h-5" /></button>
                <button onClick={() => setCursor(cursor.add(1, view === "week" ? "week" : "month"))} className="p-3 text-white hover:bg-lime hover:text-ink transition-colors border-l border-white/15" data-testid="cal-next"><ChevronRight className="w-5 h-5" /></button>
              </div>
              <div className="font-display text-3xl uppercase text-white" data-testid="cal-title">
                {view === "week" ? `${cursor.startOf("week").format("MMM D")} – ${cursor.endOf("week").format("MMM D")}` : cursor.format("MMMM YYYY")}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex border border-white/15">
                {["month", "week", "list"].map((v) => (
                  <button key={v} onClick={() => setView(v)} className={`px-4 py-2 uppercase text-xs font-bold tracking-wide transition-colors ${view === v ? "bg-lime text-ink" : "text-white hover:bg-white/10"}`} data-testid={`cal-view-${v}`}>{v}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Filter legend */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button onClick={() => setFilter("all")} className={`px-3 py-1.5 text-xs uppercase font-bold tracking-wide border ${filter === "all" ? "bg-white text-ink border-white" : "text-white/70 border-white/20 hover:border-white"}`} data-testid="cal-filter-all">All</button>
            {Object.entries(EVENT_CATEGORIES).map(([key, cat]) => (
              <button key={key} onClick={() => setFilter(key)} className={`px-3 py-1.5 text-xs uppercase font-bold tracking-wide border flex items-center gap-2 ${filter === key ? "text-ink border-transparent" : "text-white/70 border-white/20 hover:border-white"}`} style={filter === key ? { background: cat.color } : {}} data-testid={`cal-filter-${key}`}>
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: cat.color }} /> {cat.label}
              </button>
            ))}
          </div>

          {/* MONTH VIEW */}
          {view === "month" && (
            <div className="border border-white/15" data-testid="cal-month-grid">
              <div className="grid grid-cols-7 border-b border-white/15">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                  <div key={d} className="p-3 text-center text-white/50 text-xs uppercase tracking-wide font-bold">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {monthDays.map((d) => {
                  const key = d.format("YYYY-MM-DD");
                  const dayEvents = byDate[key] || [];
                  const inMonth = d.month() === cursor.month();
                  return (
                    <div key={key} className={`min-h-[92px] md:min-h-[110px] border-b border-r border-white/10 p-2 ${inMonth ? "" : "bg-white/[0.015]"}`}>
                      <div className={`text-xs mb-1 ${d.isSame(dayjs(), "day") ? "text-lime font-bold" : inMonth ? "text-white/70" : "text-white/25"}`}>{d.date()}</div>
                      <div className="space-y-1">
                        {dayEvents.map((e) => (
                          <button key={e.id} onClick={() => setSelected(e)} className="w-full text-left px-1.5 py-1 text-[10px] font-bold uppercase truncate text-ink hover:opacity-80" style={{ background: EVENT_CATEGORIES[e.category]?.color || "#fff" }} data-testid={`cal-event-${e.id}`}>
                            {e.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* WEEK VIEW */}
          {view === "week" && (
            <div className="grid grid-cols-1 md:grid-cols-7 gap-3" data-testid="cal-week-grid">
              {weekDays.map((d) => {
                const key = d.format("YYYY-MM-DD");
                const dayEvents = byDate[key] || [];
                return (
                  <div key={key} className="border border-white/15 p-3 min-h-[140px]">
                    <div className={`text-xs uppercase tracking-wide font-bold mb-3 ${d.isSame(dayjs(), "day") ? "text-lime" : "text-white/60"}`}>{d.format("ddd D")}</div>
                    <div className="space-y-2">
                      {dayEvents.map((e) => (
                        <button key={e.id} onClick={() => setSelected(e)} className="w-full text-left p-2 text-xs text-ink font-bold uppercase" style={{ background: EVENT_CATEGORIES[e.category]?.color }} data-testid={`cal-event-${e.id}`}>{e.title}</button>
                      ))}
                      {dayEvents.length === 0 && <div className="text-white/20 text-xs">—</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* LIST VIEW */}
          {view === "list" && (
            <div className="space-y-3" data-testid="cal-list">
              {filtered.length === 0 && <div className="text-white/50 border border-white/15 p-8 text-center">No events for this filter.</div>}
              {filtered.map((e) => (
                <button key={e.id} onClick={() => setSelected(e)} className="w-full text-left border border-white/15 bg-white/[0.03] p-5 flex flex-col md:flex-row md:items-center gap-4 hover:border-lime transition-colors" data-testid={`cal-event-${e.id}`}>
                  <div className="w-1.5 h-12 shrink-0" style={{ background: EVENT_CATEGORIES[e.category]?.color }} />
                  <div className="md:w-40 shrink-0">
                    <div className="font-display text-xl uppercase text-white">{dayjs(e.date).format("MMM D")}</div>
                    <div className="text-white/50 text-xs">{dayjs(e.date).format("dddd")}</div>
                  </div>
                  <div className="flex-1">
                    <div className="font-display text-2xl uppercase text-white">{e.title}</div>
                    <div className="text-white/60 text-sm">{e.time} • {e.age}</div>
                  </div>
                  <div className="text-lime font-bold uppercase text-sm">{e.price}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* EVENT DETAIL DIALOG */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="bg-ink border border-white/15 text-white rounded-none max-w-lg" data-testid="cal-event-dialog">
          {selected && (
            <>
              <DialogHeader>
                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wide font-bold mb-1" style={{ color: EVENT_CATEGORIES[selected.category]?.color }}>
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: EVENT_CATEGORIES[selected.category]?.color }} />
                  {EVENT_CATEGORIES[selected.category]?.label}
                </div>
                <DialogTitle className="font-display text-4xl uppercase text-white">{selected.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 text-white/75 mt-2">
                <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-lime" /> {dayjs(selected.date).format("dddd, MMMM D")} • {selected.time}</div>
                <div className="flex items-center gap-2"><Users className="w-4 h-4 text-lime" /> {selected.age}</div>
                <div className="flex items-center gap-2"><Tag className="w-4 h-4 text-lime" /> {selected.price}</div>
                <p className="text-white/60 pt-2">{selected.description}</p>
              </div>
              <div className="mt-4">
                {isRequestOnly(selected.price) ? (
                  <QuoteRequestDialog program={selected.title} trigger={
                    <button className="w-full border border-lime text-lime font-display uppercase py-3 hover:bg-lime hover:text-ink transition-colors" data-testid="cal-inquire">Inquire / Sign Up Info</button>
                  } />
                ) : (
                  <BookingDialog bookingType="event" itemName={selected.title} price={selected.price} trigger={
                    <button className="w-full bg-lime text-ink font-display uppercase py-3 hover:bg-white transition-colors" data-testid="cal-register">Register</button>
                  } />
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarPage;
