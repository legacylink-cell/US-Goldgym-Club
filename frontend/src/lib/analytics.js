import { API } from "@/lib/api";

const SID_KEY = "usg_sid";
const PROGRAM_PATHS = ["/preschool", "/recreational", "/competitive", "/cheer", "/baseball", "/college-recruits"];

let enabled = true;
export function setAnalyticsEnabled(v) {
  enabled = !!v;
}

function getSessionId() {
  try {
    let sid = localStorage.getItem(SID_KEY);
    if (!sid) {
      sid = (crypto.randomUUID && crypto.randomUUID()) ||
        `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      localStorage.setItem(SID_KEY, sid);
    }
    return sid;
  } catch {
    return "anon";
  }
}

function detectDevice() {
  const ua = navigator.userAgent || "";
  if (/iPad|Tablet|PlayBook|Silk/i.test(ua)) return "tablet";
  if (/Mobi|Android|iPhone|iPod|Windows Phone/i.test(ua)) return "mobile";
  return "desktop";
}

function send(payload) {
  if (!enabled) return;
  try {
    fetch(`${API}/analytics/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, session_id: getSessionId(), device: detectDevice() }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* no-op */
  }
}

function getLoadTime() {
  try {
    const nav = performance.getEntriesByType("navigation")[0];
    if (nav) {
      const t = Math.round(nav.loadEventEnd || nav.responseEnd || nav.domContentLoadedEventEnd || 0);
      return t > 0 && t < 120000 ? t : null;
    }
  } catch {
    /* no-op */
  }
  return null;
}

let initialSent = false;

let scrollState = { path: null, max: 0 };

function computeScrollPct() {
  try {
    const el = document.documentElement;
    const scrollTop = window.scrollY || el.scrollTop || 0;
    const trackable = el.scrollHeight - el.clientHeight;
    if (trackable <= 0) return 100;
    return Math.min(100, Math.max(0, Math.round((scrollTop / trackable) * 100)));
  } catch {
    return 0;
  }
}

function onScroll() {
  if (!scrollState.path) return;
  const p = computeScrollPct();
  if (p > scrollState.max) scrollState.max = p;
}

export function flushScroll() {
  if (scrollState.path) {
    send({ type: "scroll", path: scrollState.path, depth: scrollState.max });
    scrollState = { path: null, max: 0 };
  }
}

export function startScrollTracking(path) {
  flushScroll();
  scrollState = { path, max: computeScrollPct() };
}

export function trackConversion(label) {
  send({ type: "conversion", category: "conversion", label, path: window.location.pathname });
}

export function trackPageview(path) {
  let referrer = "";
  try {
    if (document.referrer) {
      const r = new URL(document.referrer);
      if (r.host !== window.location.host && !/emergent/i.test(r.host)) referrer = r.hostname;
    }
  } catch {
    /* no-op */
  }
  const payload = { type: "pageview", path, referrer };
  const now = new Date();
  payload.hour = now.getHours();
  payload.dow = now.getDay();

  if (!initialSent) {
    initialSent = true;
    const finish = () => { payload.load_time_ms = getLoadTime(); send(payload); };
    if (document.readyState === "complete") setTimeout(finish, 0);
    else window.addEventListener("load", () => setTimeout(finish, 0), { once: true });
  } else {
    send(payload);
  }
}

export function initClickTracking() {
  if (window.__usgClickInit) return;
  window.__usgClickInit = true;

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("pagehide", flushScroll);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flushScroll();
  });

  document.addEventListener(
    "click",
    (e) => {
      const target = e.target;
      if (!target || !target.closest) return;

      const anchor = target.closest("a[href]");
      if (anchor) {
        try {
          const url = new URL(anchor.getAttribute("href"), window.location.origin);
          if (PROGRAM_PATHS.includes(url.pathname)) {
            send({ type: "click", category: "program", label: url.pathname, path: window.location.pathname });
          }
        } catch {
          /* no-op */
        }
      }

      const el = target.closest("[data-testid]");
      const t = ((el && el.getAttribute("data-testid")) || "").toLowerCase();
      if (!t) return;

      let label = "";
      if (t.includes("book") && (t.includes("trial") || t.includes("nav-book"))) label = "book_free_trial";
      else if (t.includes("request") || t.includes("quote") || t.includes("pricing")) label = "request_pricing";
      else if (t.includes("newsletter-submit")) label = "newsletter_signup";
      else if (t.includes("apply")) label = "careers_apply";
      else if (t.includes("phone")) label = "phone_tap";
      else if (t.includes("email")) label = "email_tap";

      if (label) send({ type: "click", category: "cta", label, path: window.location.pathname });
    },
    true
  );
}
