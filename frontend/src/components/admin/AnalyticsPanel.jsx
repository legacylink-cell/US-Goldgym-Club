import { useEffect, useState } from "react";
import api from "@/lib/api";
import dayjs from "dayjs";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, Cell, PieChart, Pie, Legend,
} from "recharts";
import { Eye, Users, Target, Mail, Gauge, Smartphone, Monitor, MapPin, Loader2, ArrowUp, ArrowDown, AlertTriangle } from "lucide-react";

const PINK = "#FF1D8E";
const PURPLE = "#A855F7";
const BLUE = "#4EA8FF";
const INK = "#2C0A4E";
const AXIS = "rgba(44,10,78,0.55)";
const GRID = "rgba(44,10,78,0.10)";
const DEVICE_COLORS = { mobile: PINK, desktop: PURPLE, tablet: BLUE };
const TOOLTIP = { background: "#fff", border: "1px solid rgba(44,10,78,0.15)", color: INK, fontSize: 12, boxShadow: "0 4px 16px rgba(44,10,78,0.12)" };

const PROGRAM_NAMES = {
  "/preschool": "Preschool", "/recreational": "Recreational", "/competitive": "Competitive",
  "/cheer": "Cheer", "/baseball": "Baseball", "/college-recruits": "College Recruits",
};
const CTA_NAMES = {
  book_free_trial: "Book Free Trial", request_pricing: "Request Pricing", newsletter_signup: "Email Signup",
  careers_apply: "Careers Apply", phone_tap: "Phone Tap", email_tap: "Email Tap",
};

const prettyPath = (p) => (p === "/" ? "Home" : (p || "/").replace(/^\//, "").replace(/-/g, " "));

const RANGES = [
  { label: "7 days", value: 7 },
  { label: "30 days", value: 30 },
  { label: "90 days", value: 90 },
];

const AnalyticsPanel = () => {
  const [days, setDays] = useState(30);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    api.get(`/admin/analytics?days=${days}`)
      .then(({ data }) => { if (active) setData(data); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [days]);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center py-24 text-lime" data-testid="analytics-loading">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }
  if (!data) return null;

  const t = data.totals;
  const tp = data.totals_prev || {};
  const devices = Object.entries(data.device_split || {}).map(([name, value]) => ({ name, value }));
  const hasDevices = devices.some((d) => d.value > 0);
  const webLoad = data.load_time?.web?.avg_ms;
  const mobileLoad = data.load_time?.mobile?.avg_ms;
  const programs = (data.top_programs || []).map((p) => ({ name: PROGRAM_NAMES[p.program] || p.program, clicks: p.clicks }));
  const ctas = (data.cta_clicks || []).map((c) => ({ name: CTA_NAMES[c.cta] || c.cta, clicks: c.clicks }));
  const series = (data.timeseries || []).map((s) => ({ ...s, label: dayjs(s.date).format("MMM D") }));
  const empty = t.pageviews === 0;

  return (
    <div className="space-y-6" data-testid="analytics-panel">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-ink/50 text-sm max-w-xl">
          First-party website insights — real visitor traffic only (your own admin browsing, search bots, and automated tests are excluded).
        </p>
        <div className="flex gap-1 bg-ink/5 border border-ink/10 p-1" data-testid="analytics-range">
          {RANGES.map((r) => (
            <button
              key={r.value}
              onClick={() => setDays(r.value)}
              className={`px-4 py-1.5 text-xs uppercase font-bold tracking-wide transition-colors ${
                days === r.value ? "bg-lime text-ink" : "text-ink/60 hover:text-ink"
              }`}
              data-testid={`analytics-range-${r.value}`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {(data.alerts || []).map((a, i) => (
        <div key={i} className="border border-amber-400 bg-amber-50 p-4 flex items-start gap-3" data-testid={`analytics-alert-${i}`}>
          <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
          <div>
            <div className="text-amber-700 font-bold text-sm uppercase tracking-wide">{a.title}</div>
            <div className="text-ink/70 text-sm mt-0.5">{a.message}</div>
          </div>
        </div>
      ))}

      {empty && (
        <div className="border border-ink/10 bg-white p-8 text-center text-ink/60" data-testid="analytics-empty">
          No visitor data yet for this range. Stats will appear here as people browse the live site.
        </div>
      )}

      {/* KPI ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Kpi icon={Eye} label="Page Views" value={t.pageviews} cur={t.pageviews} prev={tp.pageviews} />
        <Kpi icon={Users} label="Unique Visitors" value={t.unique_visitors} cur={t.unique_visitors} prev={tp.unique_visitors} />
        <Kpi icon={Target} label="Pricing Leads" value={t.leads} cur={t.leads} prev={tp.leads} />
        <Kpi icon={Mail} label="Email Signups" value={t.signups} cur={t.signups} prev={tp.signups} />
        <Kpi icon={Gauge} label="Lead Conv. Rate" value={`${t.conversion_rate}%`} cur={t.conversion_rate} prev={tp.conversion_rate} />
      </div>

      {/* TRIAL FUNNEL */}
      <Card title="Trial Funnel — Program → Book Trial → Submitted" testid="trial-funnel">
        <Funnel steps={data.funnel || []} />
      </Card>

      {/* FUNNEL BY PROGRAM */}
      <Card title="Trial Funnel by Program — Which Programs Convert Best" testid="funnel-by-program">
        {(data.funnel_by_program || []).length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[520px]">
              <thead>
                <tr className="text-left text-ink/40 text-xs uppercase tracking-wide">
                  <th className="pb-2 font-bold">Program</th>
                  <th className="pb-2 font-bold text-right">Viewed</th>
                  <th className="pb-2 font-bold text-right">Clicked</th>
                  <th className="pb-2 font-bold text-right">Submitted</th>
                  <th className="pb-2 font-bold text-right pl-6">Conv.</th>
                </tr>
              </thead>
              <tbody>
                {(data.funnel_by_program || []).map((p) => (
                  <tr key={p.program} className="border-t border-ink/10 text-ink/80" data-testid={`fbp-row-${p.program}`}>
                    <td className="py-2.5 capitalize font-semibold text-ink">{PROGRAM_NAMES[p.program] || prettyPath(p.program)}</td>
                    <td className="py-2.5 text-right">{p.viewed}</td>
                    <td className="py-2.5 text-right">{p.clicked}</td>
                    <td className="py-2.5 text-right">{p.submitted}</td>
                    <td className="py-2.5 pl-6">
                      <div className="flex items-center gap-2 justify-end">
                        <div className="w-20 h-2 bg-ink/10 hidden sm:block">
                          <div className="h-full bg-lime" style={{ width: `${Math.min(p.conv_rate, 100)}%` }} />
                        </div>
                        <span className="text-lime font-semibold w-12 text-right">{p.conv_rate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <Muted>No program funnel data yet.</Muted>}
      </Card>

      {/* LOAD TIME + DEVICE */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Card title="Avg. Page Load — Web" testid="load-web">
          <LoadStat icon={Monitor} ms={webLoad} samples={data.load_time?.web?.samples} />
        </Card>
        <Card title="Avg. Page Load — Mobile" testid="load-mobile">
          <LoadStat icon={Smartphone} ms={mobileLoad} samples={data.load_time?.mobile?.samples} />
        </Card>
        <Card title="Device Split" testid="device-split">
          {hasDevices ? (
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={devices} dataKey="value" nameKey="name" innerRadius={40} outerRadius={65} paddingAngle={3}>
                  {devices.map((d) => <Cell key={d.name} fill={DEVICE_COLORS[d.name] || PURPLE} />)}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 11, textTransform: "capitalize", color: INK }} />
                <Tooltip contentStyle={TOOLTIP} />
              </PieChart>
            </ResponsiveContainer>
          ) : <Muted>No data yet.</Muted>}
        </Card>
      </div>

      {/* TRAFFIC & CONVERSION TREND */}
      <Card title="Traffic & Conversions Over Time" testid="trend">
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={series} margin={{ top: 10, right: 10, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="gPv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={PURPLE} stopOpacity={0.35} />
                <stop offset="100%" stopColor={PURPLE} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID} />
            <XAxis dataKey="label" tick={{ fill: AXIS, fontSize: 11 }} interval="preserveStartEnd" />
            <YAxis tick={{ fill: AXIS, fontSize: 11 }} allowDecimals={false} />
            <Tooltip contentStyle={TOOLTIP} />
            <Legend wrapperStyle={{ fontSize: 12, color: INK }} />
            <Area type="monotone" dataKey="pageviews" name="Page Views" stroke={PURPLE} fill="url(#gPv)" strokeWidth={2} />
            <Area type="monotone" dataKey="leads" name="Pricing Leads" stroke={PINK} fill="transparent" strokeWidth={2} />
            <Area type="monotone" dataKey="signups" name="Email Signups" stroke={BLUE} fill="transparent" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* PROGRAMS + CTAs */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card title="Program Interest (clicks)" testid="programs-chart">
          {programs.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={programs} layout="vertical" margin={{ left: 20, right: 16 }}>
                <XAxis type="number" tick={{ fill: AXIS, fontSize: 11 }} allowDecimals={false} />
                <YAxis type="category" dataKey="name" width={90} tick={{ fill: INK, fontSize: 11 }} />
                <Tooltip contentStyle={TOOLTIP} cursor={{ fill: "rgba(44,10,78,0.05)" }} />
                <Bar dataKey="clicks" fill={PINK} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <Muted>No program clicks yet.</Muted>}
        </Card>

        <Card title="Key Actions (CTA clicks)" testid="cta-chart">
          {ctas.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={ctas} layout="vertical" margin={{ left: 20, right: 16 }}>
                <XAxis type="number" tick={{ fill: AXIS, fontSize: 11 }} allowDecimals={false} />
                <YAxis type="category" dataKey="name" width={100} tick={{ fill: INK, fontSize: 11 }} />
                <Tooltip contentStyle={TOOLTIP} cursor={{ fill: "rgba(44,10,78,0.05)" }} />
                <Bar dataKey="clicks" fill={PURPLE} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <Muted>No CTA clicks yet.</Muted>}
        </Card>
      </div>

      {/* LOCATION + PAGES + REFERRERS */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Card title="Visitors by City / State" testid="location-table">
          <MiniTable
            head={["Location", "Views"]}
            rows={(data.by_location || []).map((l) => [
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-lime" />{l.city}{l.state ? `, ${l.state}` : ""}</span>,
              l.views,
            ])}
            empty="No location data yet."
          />
        </Card>
        <Card title="Top Pages" testid="pages-table">
          <MiniTable
            head={["Page", "Views"]}
            rows={(data.top_pages || []).map((p) => [<span className="capitalize">{prettyPath(p.path)}</span>, p.views])}
            empty="No page views yet."
          />
        </Card>
        <Card title="Top Referrers" testid="referrers-table">
          <MiniTable
            head={["Source", "Visits"]}
            rows={(data.top_referrers || []).map((r) => [r.referrer, r.count])}
            empty="No external referrers yet."
          />
        </Card>
      </div>

      {/* PEAK TIMES HEATMAP */}
      <Card title="Peak Times — Busiest Days & Hours (visitor local time)" testid="peak-heatmap">
        <PeakHeatmap peaks={data.peak_times || []} />
      </Card>

      {/* SCROLL DEPTH + EXIT PAGES */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card title="Scroll Depth — How Far Visitors Read" testid="scroll-depth">
          {(data.scroll_depth || []).length ? (
            <div className="space-y-4">
              {(data.scroll_depth || []).map((s) => (
                <div key={s.path} data-testid={`scroll-row-${s.path}`}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize text-ink/80">{PROGRAM_NAMES[s.path] || prettyPath(s.path)}</span>
                    <span className="text-ink/50 text-xs">
                      <span className="text-lime font-semibold">{s.avg_depth}%</span> avg · {s.reached_bottom_pct}% reached end · {s.samples} view{s.samples === 1 ? "" : "s"}
                    </span>
                  </div>
                  <div className="h-2.5 bg-ink/10 overflow-hidden">
                    <div className="h-full bg-lime" style={{ width: `${s.avg_depth}%` }} />
                  </div>
                </div>
              ))}
            </div>
          ) : <Muted>No scroll data yet.</Muted>}
        </Card>

        <Card title="Exit Pages — Where Visitors Leave" testid="exit-pages">
          <MiniTable
            head={["Page", "Exits"]}
            rows={(data.exit_pages || []).map((p) => [<span className="capitalize">{prettyPath(p.path)}</span>, p.exits])}
            empty="No exit data yet."
          />
        </Card>
      </div>
    </div>
  );
};

const Delta = ({ cur, prev }) => {
  if (cur == null || prev == null) return <div className="h-4 mt-2" />;
  if (prev === 0 && cur === 0) return <div className="h-4 mt-2" />;
  if (prev === 0) {
    return <div className="flex items-center gap-1 mt-2 text-emerald-600 text-xs font-semibold"><ArrowUp className="w-3 h-3" /> new</div>;
  }
  const change = Math.round(((cur - prev) / prev) * 100);
  const up = change >= 0;
  const Icon = up ? ArrowUp : ArrowDown;
  return (
    <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${up ? "text-emerald-600" : "text-rose-600"}`} title="vs previous period">
      <Icon className="w-3 h-3" /> {Math.abs(change)}% <span className="text-ink/35 font-normal">vs prev</span>
    </div>
  );
};

const Kpi = ({ icon: Icon, label, value, cur, prev }) => (
  <div className="border border-ink/10 bg-white shadow-sm p-5" data-testid={`kpi-${label.toLowerCase().replace(/[^a-z]+/g, "-")}`}>
    <Icon className="w-5 h-5 text-lime mb-3" />
    <div className="font-display text-3xl text-ink leading-none">{value}</div>
    <div className="text-ink/50 text-xs uppercase tracking-wide mt-1">{label}</div>
    <Delta cur={cur} prev={prev} />
  </div>
);

const Card = ({ title, children, testid }) => (
  <div className="border border-ink/10 bg-white shadow-sm p-5" data-testid={testid}>
    <h4 className="text-xs uppercase tracking-[0.2em] text-coral font-bold mb-4">{title}</h4>
    {children}
  </div>
);

const LoadStat = ({ icon: Icon, ms, samples }) => (
  <div className="flex items-center gap-4">
    <Icon className="w-9 h-9 text-ink/30" />
    <div>
      <div className="font-display text-4xl text-ink leading-none">
        {ms ? `${(ms / 1000).toFixed(2)}s` : "—"}
      </div>
      <div className="text-ink/50 text-xs mt-1">{samples ? `${samples} sample${samples === 1 ? "" : "s"}` : "No data yet"}</div>
    </div>
  </div>
);

const Muted = ({ children }) => <div className="text-ink/50 text-sm py-8 text-center">{children}</div>;

const MiniTable = ({ head, rows, empty }) => (
  rows.length === 0 ? <Muted>{empty}</Muted> : (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left">
          {head.map((h, i) => <th key={h} className={`pb-2 text-ink/40 text-xs uppercase tracking-wide font-bold ${i > 0 ? "text-right" : ""}`}>{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} className="border-t border-ink/10 text-ink/80">
            <td className="py-2 pr-2">{r[0]}</td>
            <td className="py-2 text-right font-semibold text-ink">{r[1]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
);

const Funnel = ({ steps }) => {
  const top = steps[0]?.sessions || 0;
  if (!top) return <Muted>No funnel data yet — this fills in as visitors browse programs and start a trial or pricing request.</Muted>;
  return (
    <div className="space-y-4">
      {steps.map((s, i) => {
        const pct = Math.round((s.sessions / top) * 100);
        const prevN = i > 0 ? steps[i - 1].sessions : null;
        const cont = prevN ? Math.round((s.sessions / prevN) * 100) : null;
        const drop = cont != null ? 100 - cont : null;
        return (
          <div key={s.stage} data-testid={`funnel-step-${i}`}>
            <div className="flex justify-between items-baseline text-sm mb-1">
              <span className="text-ink/80 font-semibold">{i + 1}. {s.stage}</span>
              <span className="text-ink/50 text-xs">
                {s.sessions} visitor{s.sessions === 1 ? "" : "s"}
                {cont != null && <span className={drop > 0 ? "text-rose-600" : "text-emerald-600"}> · {cont}% continued ({drop}% drop)</span>}
              </span>
            </div>
            <div className="h-9 bg-ink/10">
              <div className="h-full bg-gradient-to-r from-lime to-coral flex items-center px-3 text-white font-bold text-sm transition-all"
                   style={{ width: `${Math.max(pct, 8)}%` }}>
                {pct}%
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HOUR_TICKS = { 0: "12a", 6: "6a", 12: "12p", 18: "6p", 23: "11p" };

const PeakHeatmap = ({ peaks }) => {
  const map = {};
  let max = 0;
  peaks.forEach((p) => {
    map[`${p.dow}-${p.hour}`] = p.count;
    if (p.count > max) max = p.count;
  });
  if (max === 0) return <Muted>No traffic timing data yet.</Muted>;

  const fmtHour = (h) => `${((h + 11) % 12) + 1}${h < 12 ? "am" : "pm"}`;

  return (
    <div className="overflow-x-auto" data-testid="peak-heatmap-grid">
      <div className="min-w-[640px]">
        {DAY_LABELS.map((day, d) => (
          <div key={day} className="flex items-center gap-1 mb-1">
            <div className="w-9 text-[10px] uppercase tracking-wide text-ink/60 font-bold shrink-0">{day}</div>
            <div className="flex gap-1 flex-1">
              {Array.from({ length: 24 }).map((_, h) => {
                const count = map[`${d}-${h}`] || 0;
                const intensity = count ? 0.18 + 0.82 * (count / max) : 0;
                return (
                  <div
                    key={h}
                    title={`${day} ${fmtHour(h)} — ${count} view${count === 1 ? "" : "s"}`}
                    className="h-5 flex-1 rounded-sm"
                    style={{ backgroundColor: count ? `rgba(255,29,142,${intensity})` : "rgba(44,10,78,0.06)" }}
                  />
                );
              })}
            </div>
          </div>
        ))}
        <div className="flex items-center gap-1 mt-1">
          <div className="w-9 shrink-0" />
          <div className="flex gap-1 flex-1">
            {Array.from({ length: 24 }).map((_, h) => (
              <div key={h} className="flex-1 text-center text-[9px] text-ink/40">{HOUR_TICKS[h] || ""}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPanel;
