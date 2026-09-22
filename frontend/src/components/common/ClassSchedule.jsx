import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, Users, ArrowUpRight, Phone } from "lucide-react";
import { PRESCHOOL_TIERS, REC_LEVELS, TUMBLE_CLASSES, BUSINESS } from "@/data/site";

const FILTERS = [
  { key: "all", label: "All classes", dot: "bg-white" },
  { key: "preschool", label: "Preschool", dot: "bg-lime" },
  { key: "recreational", label: "Recreational", dot: "bg-purple-400" },
  { key: "cheer_tumble", label: "Cheer Tumble", dot: "bg-coral" },
  { key: "boys", label: "Boys", dot: "bg-sky-400" },
];

const LINKS = {
  preschool: "/preschool",
  recreational: "/recreational",
  cheer_tumble: "/cheer",
  boys: "/recreational",
};

const buildClasses = () => {
  const rows = [];
  PRESCHOOL_TIERS.forEach((t) => {
    rows.push({
      key: t.name === "Boys Sport" ? "boys" : "preschool",
      // Boys Sport is filtered under Boys but is described on the Preschool page
      link: "/preschool",
      name: t.name,
      age: t.age,
      length: t.length,
      desc: t.focus,
    });
  });
  REC_LEVELS.forEach((l) => {
    rows.push({
      key: "recreational",
      name: l.name,
      age: l.usag ? `USAG ${l.usag.replace("USAG ", "")}` : "Ages 6 & up",
      length: l.length,
      desc: l.desc,
    });
  });
  rows.push({
    key: "boys",
    name: "Boys Gymnastics",
    age: "Ages 6 & up",
    length: "55 min",
    desc: "A boys-only class built around the men's events - floor, trampoline, vault, and bars.",
  });
  TUMBLE_CLASSES.forEach((t) => {
    rows.push({
      key: "cheer_tumble",
      name: t.name,
      age: t.level,
      length: "",
      desc: "Standing and running tumbling taught with proper progressions - a great add-on for all-star or school cheer.",
    });
  });
  return rows;
};

export const ClassSchedule = () => {
  const [filter, setFilter] = useState("all");
  const classes = useMemo(buildClasses, []);
  const shown = filter === "all" ? classes : classes.filter((c) => c.key === filter);

  return (
    <div data-testid="class-schedule">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="text-pinklt text-xs uppercase tracking-[0.25em] font-bold mb-2">Weekly classes</div>
          <h2 className="font-display text-3xl md:text-4xl uppercase text-white leading-none">Class schedule</h2>
        </div>
        <a
          href={`tel:${BUSINESS.phoneRaw}`}
          className="inline-flex items-center gap-2 border border-white/20 text-white px-5 py-3 hover:border-lime hover:text-lime transition-colors self-start"
          data-testid="class-schedule-call"
        >
          <Phone className="w-4 h-4" /> Ask about day &amp; time options
        </a>
      </div>

      <div className="flex flex-wrap gap-2 mb-7" data-testid="class-schedule-filters">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-wide font-bold transition-colors ${
              filter === f.key ? "bg-white text-ink" : "border border-white/20 text-white/70 hover:text-white hover:border-white/50"
            }`}
            data-testid={`class-filter-${f.key}`}
          >
            <span className={`w-2 h-2 rounded-full ${f.dot}`} /> {f.label}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {shown.map((c) => (
          <div
            key={`${c.key}-${c.name}`}
            className="border border-white/15 bg-white/[0.03] p-5 flex flex-col"
            data-testid={`class-card-${c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="font-display text-2xl uppercase text-white leading-none">{c.name}</div>
              <span className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${FILTERS.find((f) => f.key === c.key).dot}`} />
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs uppercase tracking-wide font-bold">
              <span className="inline-flex items-center gap-1.5 text-pinklt"><Users className="w-3.5 h-3.5" /> {c.age}</span>
              {c.length && <span className="inline-flex items-center gap-1.5 text-white/55"><Clock className="w-3.5 h-3.5" /> {c.length}</span>}
            </div>
            <p className="text-white/60 text-sm mt-3 flex-1">{c.desc}</p>
            <Link
              to={c.link || LINKS[c.key]}
              className="inline-flex items-center gap-1.5 text-lime text-xs uppercase tracking-wide font-bold mt-4 hover:text-white transition-colors"
            >
              Program details <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>

      <p className="text-white/45 text-sm mt-6 max-w-3xl">
        Days and times are set each session and can change seasonally - call the front desk at{" "}
        <a href={`tel:${BUSINESS.phoneRaw}`} className="text-pinklt hover:text-white transition-colors">{BUSINESS.phone}</a>{" "}
        for the current openings. A full day-by-day schedule is coming soon.
      </p>
    </div>
  );
};

export default ClassSchedule;
