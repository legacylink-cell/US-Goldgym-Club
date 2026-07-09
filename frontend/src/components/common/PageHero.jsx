import { motion } from "framer-motion";

export const PageHero = ({ overline, title, subtitle, image, height = "min-h-[55vh]" }) => (
  <section className={`relative ${height} flex items-end overflow-hidden`}>
    <div className="absolute inset-0">
      <img src={image} alt={title} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-black/40" />
    </div>
    <div className="relative max-w-[1400px] mx-auto px-5 md:px-8 pb-16 pt-32 w-full">
      {overline && (
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="text-xs uppercase tracking-[0.3em] text-lime font-bold mb-3"
        >
          {overline}
        </motion.div>
      )}
      <motion.h1
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05 }}
        className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl uppercase text-white leading-[0.9] max-w-4xl"
      >
        {title}
      </motion.h1>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-5 text-white/70 text-lg max-w-2xl leading-relaxed"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  </section>
);

export default PageHero;
