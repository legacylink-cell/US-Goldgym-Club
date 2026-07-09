import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export const MagneticButton = ({
  children,
  as = "button",
  to,
  href,
  variant = "lime",
  className = "",
  ...props
}) => {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    setPos({ x: x * 0.3, y: y * 0.3 });
  };
  const reset = () => setPos({ x: 0, y: 0 });

  const variants = {
    lime: "bg-lime text-ink hover:bg-white",
    coral: "bg-coral text-white hover:bg-white hover:text-ink",
    outline: "bg-transparent text-white border-2 border-white/30 hover:border-lime hover:text-lime",
    dark: "bg-ink text-white hover:bg-lime hover:text-ink",
  };

  const inner = (
    <motion.span
      className="inline-flex items-center justify-center gap-2"
      animate={{ x: pos.x * 0.4, y: pos.y * 0.4 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
    >
      {children}
    </motion.span>
  );

  const cls = `relative inline-flex items-center justify-center px-8 py-4 font-display text-lg uppercase tracking-wide transition-colors duration-300 ${variants[variant]} ${className}`;

  const motionProps = {
    ref,
    onMouseMove: handleMove,
    onMouseLeave: reset,
    animate: { x: pos.x, y: pos.y },
    transition: { type: "spring", stiffness: 200, damping: 15 },
    className: cls,
  };

  if (as === "link" && to)
    return (
      <motion.div {...motionProps} style={{ display: "inline-flex" }}>
        <Link to={to} className="inline-flex items-center gap-2" {...props}>
          {inner}
        </Link>
      </motion.div>
    );
  if (as === "a")
    return (
      <motion.a href={href} {...motionProps} {...props}>
        {inner}
      </motion.a>
    );
  return (
    <motion.button {...motionProps} {...props}>
      {inner}
    </motion.button>
  );
};

export default MagneticButton;
