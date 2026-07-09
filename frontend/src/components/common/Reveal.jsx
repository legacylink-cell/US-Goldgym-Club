import { motion } from "framer-motion";

export const Reveal = ({ children, delay = 0, y = 24, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

export const SectionHeading = ({ overline, title, light = false, className = "" }) => (
  <div className={className}>
    {overline && (
      <div className={`text-xs uppercase tracking-[0.25em] font-bold mb-3 ${light ? "text-coral" : "text-lime"}`}>
        {overline}
      </div>
    )}
    <h2
      className={`font-display text-4xl sm:text-5xl md:text-6xl uppercase leading-[0.95] ${
        light ? "text-ink" : "text-white"
      }`}
    >
      {title}
    </h2>
  </div>
);

export default Reveal;
