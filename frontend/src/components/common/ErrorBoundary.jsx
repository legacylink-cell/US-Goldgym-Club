import React from "react";

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
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: "100vh", background: "#0E0E10", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif", padding: "24px", textAlign: "center" }}>
          <div style={{ fontFamily: "Anton, sans-serif", fontSize: "48px", textTransform: "uppercase", color: "#D4FF3F" }}>Oops.</div>
          <p style={{ color: "rgba(255,255,255,0.7)", maxWidth: 420, marginTop: 12 }}>
            Something went wrong loading the page. This is usually fixed with a quick reload.
          </p>
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
