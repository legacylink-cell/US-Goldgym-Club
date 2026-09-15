import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Hammer, Phone, X } from "lucide-react";
import { SITE_NOTICE, BUSINESS } from "@/data/site";

const STORAGE_KEY = "usg_notice_dismissed";

export const SiteNotice = () => {
  const [dismissed, setDismissed] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setDismissed(localStorage.getItem(STORAGE_KEY) === SITE_NOTICE.version);
    const onScroll = () => setScrolled(window.scrollY > 90);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = () => {
    localStorage.setItem(STORAGE_KEY, SITE_NOTICE.version);
    setDismissed(true);
  };

  if (!SITE_NOTICE.enabled) return null;

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
            <Hammer className="w-4 h-4 text-pinklt shrink-0" />
            <p className="text-white/85 text-xs md:text-sm leading-snug flex-1">
              {SITE_NOTICE.text}
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
