import { motion } from "framer-motion";
import { ANNOUNCEMENT } from "@/data/site";

export const AnnouncementBar = () => {
  const text = `${ANNOUNCEMENT}\u00A0\u00A0\u00A0\u00A0`;
  return (
    <div
      className="fixed top-0 inset-x-0 z-[60] h-9 bg-lime overflow-hidden flex items-center border-b border-ink/20"
      data-testid="announcement-bar"
      aria-label="Announcement"
    >
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 22, ease: "linear", repeat: Infinity }}
      >
        {[0, 1].map((i) => (
          <span
            key={i}
            className="text-ink text-xs md:text-sm font-bold uppercase tracking-[0.12em] px-2"
          >
            {text}
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default AnnouncementBar;
