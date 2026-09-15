import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// If the page is served from the same site as the API (apex vs www of the same domain),
// talk to our own origin so cookies stay first-party and CORS never applies.
function resolveApiBase() {
  if (typeof window === "undefined") return `${BACKEND_URL}/api`;
  try {
    const envHost = new URL(BACKEND_URL).hostname.replace(/^www\./, "");
    const pageHost = window.location.hostname.replace(/^www\./, "");
    if (envHost === pageHost) return `${window.location.origin}/api`;
  } catch {
    /* fall through to env value */
  }
  return `${BACKEND_URL}/api`;
}

export const API = resolveApiBase();

const api = axios.create({
  baseURL: API,
  withCredentials: true,
});

export function formatApiError(detail) {
  if (detail == null) return "Something went wrong. Please try again.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail
      .map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e)))
      .filter(Boolean)
      .join(" ");
  if (detail && typeof detail.msg === "string") return detail.msg;
  return String(detail);
}

export default api;
