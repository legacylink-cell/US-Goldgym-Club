import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { trackPageview, initClickTracking, startScrollTracking, setAnalyticsEnabled } from "@/lib/analytics";

const EXCLUDED = /^\/(admin|login|register|dashboard)/;

export const AnalyticsTracker = () => {
  const { pathname } = useLocation();
  const { user, checked } = useAuth();
  const isAdmin = !!(user && user.role === "admin");

  useEffect(() => {
    initClickTracking();
  }, []);

  // Never track an admin's own browsing / scrolling / clicks.
  useEffect(() => {
    setAnalyticsEnabled(!isAdmin);
  }, [isAdmin]);

  useEffect(() => {
    if (!checked) return;
    if (isAdmin || EXCLUDED.test(pathname)) return;
    trackPageview(pathname);
    startScrollTracking(pathname);
  }, [pathname, isAdmin, checked]);

  return null;
};

export default AnalyticsTracker;
