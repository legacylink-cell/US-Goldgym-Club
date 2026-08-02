import React from "react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "", stack: "" };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: String(error && error.message || error), stack: String(error && error.stack || "") };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error("App crashed:", error, info);
    // Report the real error back to the server so we can diagnose crashes
    // that only happen in a specific browser/environment.
    try {
      fetch(`${BACKEND_URL}/api/client-error`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: String(error && error.message || error),
          stack: String(error && error.stack || ""),
          componentStack: String((info && info.componentStack) || ""),
          url: window.location.href,
          userAgent: navigator.userAgent,
        }),
        keepalive: true,
      }).catch(() => {});
    } catch (e) { /* noop */ }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: "100vh", background: "#0E0E10", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif", padding: "24px", textAlign: "center" }}>
          <div style={{ fontFamily: "Anton, sans-serif", fontSize: "44px", textTransform: "uppercase", color: "#D4FF3F" }}>Something went wrong</div>
          <p style={{ color: "rgba(255,255,255,0.7)", maxWidth: 520, marginTop: 12 }}>
            We've logged the details. Please tap reload — if it keeps happening, send us this message:
          </p>
          <pre style={{ marginTop: 16, maxWidth: 640, width: "100%", overflow: "auto", background: "#161618", border: "1px solid #2A2A2D", color: "#FF9B9B", fontSize: 12, padding: 14, textAlign: "left", whiteSpace: "pre-wrap" }}>
            {this.state.message}
          </pre>
          <button
            onClick={() => window.location.reload()}
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
