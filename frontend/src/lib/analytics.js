import { API } from "@/lib/api";

const SID_KEY = "usg_sid";
const PROGRAM_PATHS = ["/preschool", "/recreational", "/competitive", "/cheer", "/baseball", "/college-recruits"];

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
