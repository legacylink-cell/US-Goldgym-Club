import { useMemo, useState } from "react";
import { Clock, Phone, FileDown } from "lucide-react";
import { FALL_SCHEDULE, BUSINESS, PDFS } from "@/data/site";

const CATEGORIES = [
  { key: "all", label: "All classes", dot: "bg-white", text: "text-white", border: "border-white/40" },
  { key: "preschool", label: "Preschool", dot: "bg-lime", text: "text-lime", border: "border-lime" },
  { key: "recreational", label: "Recreational", dot: "bg-purple-400", text: "text-purple-300", border: "border-purple-400" },
  { key: "cheer_tumble", label: "Cheer Tumble", dot: "bg-coral", text: "text-coral", border: "border-coral" },
  { key: "boys", label: "Boys", dot: "bg-sky-400", text: "text-sky-300", border: "border-sky-400" },
];

const categoryOf = (name) => {
  if (name.startsWith("Cheer")) return "cheer_tumble";
  if (name.startsWith("Boys")) return "boys";
  if (name.startsWith("Gym")) return "preschool";
  return "recreational";
};

// Length and price are published per class type in the PDF footnotes.
const detailOf = (name) =>
  name === "Advanced" ? { length: "85 min", price: "$120/mo" } : { length: "55 min", price: "$90/mo" };

const ClassPill = ({ cls, morning }) => {
  const cat = CATEGORIES.find((c) => c.key === categoryOf(cls.name));
  const { length, price } = detailOf(cls.name);
  return (
    <div
      className={`border-l-2 ${cat.border} bg-white/[0.04] hover:bg-white/[0.07] transition-colors px-3 py-2.5`}
      data-testid={`schedule-class-${cls.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
    >
      <div className="flex items-baseline gap-2">
        <span className="font-display text-lg text-white leading-none tabular-nums">{cls.time}</span>
        <span className="text-white/35 text-[10px] uppercase font-bold">{morning ? "am" : "pm"}</span>
      </div>
      <div className={`text-sm font-bold mt-1 leading-tight ${cat.text}`}>{cls.name}</div>
      <div className="text-white/40 text-[11px] uppercase tracking-wide font-bold mt-1">
        {length} &middot; {price}
      </div>
      {cls.note && <div className="text-pinklt text-[11px] mt-1">{cls.note}</div>}
    </div>
  );
};

export const WeeklySchedule = () => {
  const [cat, setCat] = useState("all");
  const [activeDay, setActiveDay] = useState(FALL_SCHEDULE.days[0].day);

  const days = useMemo(
    () =>
      FALL_SCHEDULE.days.map((d) => ({
        ...d,
        shown: cat === "all" ? d.classes : d.classes.filter((c) => categoryOf(c.name) === cat),
      })),
    [cat]
  );

  const total = days.reduce((sum, d) => sum + d.shown.length, 0);
  const mobileDay = days.find((d) => d.day === activeDay) || days[0];

  return (
    <div data-testid="weekly-schedule">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="text-pinklt text-xs uppercase tracking-[0.25em] font-bold mb-2">
            {FALL_SCHEDULE.term} &middot; {total} weekly classes
          </div>
          <h2 className="font-display text-3xl md:text-4xl uppercase text-white leading-none">Weekly schedule</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href={PDFS.fallSchedule}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 border border-white/20 text-white px-5 py-3 hover:border-lime hover:text-lime transition-colors text-sm"
            data-testid="schedule-pdf-link"
          >
            <FileDown className="w-4 h-4" /> Printable PDF
          </a>
          <a
            href={`tel:${BUSINESS.phoneRaw}`}
            className="inline-flex items-center gap-2 bg-lime text-ink font-bold px-5 py-3 hover:bg-white transition-colors text-sm"
            data-testid="schedule-call"
          >
            <Phone className="w-4 h-4" /> Book a free trial
          </a>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6" data-testid="schedule-filters">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            onClick={() => setCat(c.key)}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-wide font-bold transition-colors ${
              cat === c.key ? "bg-white text-ink" : "border border-white/20 text-white/70 hover:text-white hover:border-white/50"
            }`}
            data-testid={`schedule-filter-${c.key}`}
          >
            <span className={`w-2 h-2 rounded-full ${c.dot}`} /> {c.label}
          </button>
        ))}
      </div>

      {/* Mobile: one day at a time */}
      <div className="md:hidden">
        <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1" data-testid="schedule-days">
          {days.map((d) => (
            <button
              key={d.day}
              onClick={() => setActiveDay(d.day)}
              className={`px-3 py-2 text-xs uppercase font-bold shrink-0 transition-colors ${
                activeDay === d.day ? "bg-lime text-ink" : "border border-white/20 text-white/60"
              }`}
              data-testid={`schedule-day-${d.short.toLowerCase()}`}
            >
              {d.short}
              <span className="ml-1.5 opacity-60">{d.shown.length}</span>
            </button>
          ))}
        </div>
        <div className="space-y-2">
          {mobileDay.shown.length ? (
            mobileDay.shown.map((c, i) => (
              <ClassPill key={`${c.name}-${c.time}-${i}`} cls={c} morning={mobileDay.morning} />
            ))
          ) : (
            <p className="text-white/40 text-sm py-6">No classes in this category on {mobileDay.day}.</p>
          )}
        </div>
      </div>

      {/* Desktop: full week grid */}
      <div className="hidden md:grid grid-cols-6 gap-3" data-testid="schedule-grid">
        {days.map((d) => (
          <div key={d.day} className="min-w-0">
            <div className="border-b border-white/15 pb-2 mb-3">
              <div className="font-display text-xl uppercase text-white leading-none">{d.short}</div>
              <div className="text-white/35 text-[11px] uppercase tracking-wide font-bold mt-1">
                {d.shown.length} {d.shown.length === 1 ? "class" : "classes"}
              </div>
            </div>
            <div className="space-y-2">
              {d.shown.map((c, i) => (
                <ClassPill key={`${c.name}-${c.time}-${i}`} cls={c} morning={d.morning} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 border border-white/15 bg-white/[0.03] p-6" data-testid="schedule-tuition">
        <div className="flex items-center gap-2 text-white/80 text-xs uppercase tracking-[0.2em] font-bold mb-4">
          <Clock className="w-4 h-4" /> Tuition &amp; registration
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {FALL_SCHEDULE.rates.map((r) => (
            <div key={r.label} className="border-l-2 border-lime/60 pl-4">
              <div className="font-display text-2xl text-white leading-none">{r.price}</div>
              <div className="text-white/45 text-[11px] uppercase tracking-wide font-bold mt-1">{r.length}</div>
              <div className="text-white/60 text-sm mt-1.5">{r.label}</div>
            </div>
          ))}
        </div>
        <p className="text-white/50 text-sm mt-5">
          Yearly registration{" "}
          {FALL_SCHEDULE.registration.map((r, i) => (
            <span key={r.label}>
              {i > 0 && " / "}
              <span className="text-white font-bold">{r.price}</span> {r.label.toLowerCase()}
            </span>
          ))}
          . Sibling and multiple-class discounts available. Enrollment is subject to space availability - call{" "}
          <a href={`tel:${BUSINESS.phoneRaw}`} className="text-pinklt hover:text-white transition-colors">
            {BUSINESS.phone}
          </a>{" "}
          to check openings or book a free trial class.
        </p>
      </div>
    </div>
  );
};

export default WeeklySchedule;
