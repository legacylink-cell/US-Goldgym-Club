import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

export const StatCounter = ({ value, suffix = "", label, numberClass = "text-lime", labelClass = "text-white/60" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px", layoutEffect: false });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1600;
    const startTime = performance.now();
    const tick = (now) => {
      const p = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(eased * value));
      if (p < 1) requestAnimationFrame(tick);
      else setCount(value);
    };
    requestAnimationFrame(tick);
  }, [inView, value]);

  return (
    <div ref={ref} className="text-center md:text-left">
      <div className={`font-display text-5xl sm:text-6xl md:text-7xl leading-none ${numberClass}`}>
        {count.toLocaleString()}
        {suffix}
      </div>
      <div className={`mt-2 text-xs uppercase tracking-[0.2em] font-bold ${labelClass}`}>
        {label}
      </div>
    </div>
  );
};

export default StatCounter;
