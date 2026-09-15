import { useEffect, useRef, useState } from "react";
import { Phone, CalendarCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { BUSINESS } from "@/data/site";

// Slides out of the way while reading down the page, comes straight back on any
// upward scroll (and at the very bottom), so it never fights the content.
export const MobileCallBar = () => {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const frame = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      if (frame.current) return;
      frame.current = requestAnimationFrame(() => {
        frame.current = 0;
        const y = window.scrollY;
        const atBottom = y + window.innerHeight >= document.body.scrollHeight - 80;
        const delta = y - lastY.current;
        if (y < 140 || atBottom || delta < -6) setHidden(false);
        else if (delta > 6) setHidden(true);
        lastY.current = y;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, []);

  return (
    <div
      data-testid="mobile-action-bar"
      className={`md:hidden fixed bottom-0 inset-x-0 z-[70] grid grid-cols-2 shadow-[0_-6px_20px_rgba(0,0,0,0.35)] transition-transform duration-300 ease-out ${
        hidden ? "translate-y-full" : "translate-y-0"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <a
        href={`tel:${BUSINESS.phoneRaw}`}
        data-testid="mobile-call-cta"
        className="bg-ink text-white flex items-center justify-center gap-2 py-3.5 font-display uppercase tracking-wide text-sm active:bg-ink/90 transition-colors"
      >
        <Phone className="w-5 h-5" /> Call Us
      </a>
      <Link
        to="/contact"
        data-testid="mobile-trial-cta"
        className="bg-lime text-ink flex items-center justify-center gap-2 py-3.5 font-display uppercase tracking-wide text-sm active:bg-white transition-colors"
      >
        <CalendarCheck className="w-5 h-5" /> Book Trial
      </Link>
    </div>
  );
};

export default MobileCallBar;
