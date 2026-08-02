import React from "react";

const RECOVER_KEY = "__usg_recovered";

async function purgeCachesAndReload() {
  try {
    if ("serviceWorker" in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((r) => r.unregister()));
    }
  } catch (e) { /* noop */ }
  try {
    if (window.caches && caches.keys) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    }
  } catch (e) { /* noop */ }
  // Cache-bust the reload so the browser fetches the latest bundle
  const url = new URL(window.location.href);
  url.searchParams.set("_r", Date.now().toString());
  window.location.replace(url.toString());
}

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error("App crashed:", error, info);
    // Auto-recover ONCE per session: most crashes here are a stale cached
    // bundle (old JS in the tab). Purge caches + hard reload to fetch latest.
    try {
      if (!sessionStorage.getItem(RECOVER_KEY)) {
        sessionStorage.setItem(RECOVER_KEY, "1");
        purgeCachesAndReload();
      }
    } catch (e) { /* noop */ }
  }

  handleManualReload = () => {
    try { sessionStorage.removeItem(RECOVER_KEY); } catch (e) { /* noop */ }
    purgeCachesAndReload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: "100vh", background: "#0E0E10", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif", padding: "24px", textAlign: "center" }}>
          <div style={{ fontFamily: "Anton, sans-serif", fontSize: "48px", textTransform: "uppercase", color: "#D4FF3F" }}>Just a sec…</div>
          <p style={{ color: "rgba(255,255,255,0.7)", maxWidth: 440, marginTop: 12 }}>
            We're loading the latest version of the site. If this screen stays, tap reload.
          </p>
          <button
            onClick={this.handleManualReload}
            style={{ marginTop: 24, background: "#D4FF3F", color: "#0E0E10", fontFamily: "Anton, sans-serif", textTransform: "uppercase", fontSize: 18, padding: "14px 32px", border: "none", cursor: "pointer" }}
            data-testid="error-reload-btn"
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
