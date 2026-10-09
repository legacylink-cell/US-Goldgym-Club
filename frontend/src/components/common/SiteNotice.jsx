import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarOff, Hammer, Megaphone, Phone, X } from "lucide-react";
import { activeNotice, BUSINESS } from "@/data/site";

const STORAGE_KEY = "usg_notice_dismissed";
const ICONS = { calendar: CalendarOff, hammer: Hammer, announce: Megaphone };

export const SiteNotice = () => {
  const [notice, setNotice] = useState(null);
  const [dismissed, setDismissed] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Re-evaluated on mount, so a notice that lapsed while a tab sat open is replaced on next load.
    const current = activeNotice();
    setNotice(current);
    setDismissed(!current || localStorage.getItem(STORAGE_KEY) === current.version);
    const onScroll = () => setScrolled(window.scrollY > 90);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = () => {
    if (notice) localStorage.setItem(STORAGE_KEY, notice.version);
    setDismissed(true);
  };

  if (!notice) return null;
  const Icon = ICONS[notice.icon] || Megaphone;

  return (
    <AnimatePresence>
      {!dismissed && !scrolled && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="fixed top-[7.25rem] inset-x-0 z-40 px-4 md:px-8 pointer-events-none"
          data-testid="site-notice"
        >
          <div className="pointer-events-auto max-w-[1400px] mx-auto flex items-center gap-3 border border-lime/40 bg-ink/85 backdrop-blur-md px-4 py-2.5 md:px-5">
            <Icon className="w-4 h-4 text-pinklt shrink-0" />
            <p className="text-white/85 text-xs md:text-sm leading-snug flex-1">
              {notice.text}
            </p>
            <a
              href={`tel:${BUSINESS.phoneRaw}`}
              className="hidden sm:inline-flex items-center gap-1.5 text-pinklt hover:text-white text-xs md:text-sm font-bold uppercase tracking-wide shrink-0 transition-colors"
              data-testid="site-notice-call"
            >
              <Phone className="w-3.5 h-3.5" /> {BUSINESS.phone}
            </a>
            <button
              onClick={close}
              aria-label="Dismiss update notice"
              className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white shrink-0 transition-colors"
              data-testid="site-notice-close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SiteNotice;
