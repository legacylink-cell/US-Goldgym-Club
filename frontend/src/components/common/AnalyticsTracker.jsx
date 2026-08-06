import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageview, initClickTracking, startScrollTracking } from "@/lib/analytics";

export const AnalyticsTracker = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    initClickTracking();
  }, []);

  useEffect(() => {
    trackPageview(pathname);
    startScrollTracking(pathname);
  }, [pathname]);

  return null;
};

export default AnalyticsTracker;
