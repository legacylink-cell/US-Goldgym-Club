import { Phone, CalendarCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { BUSINESS } from "@/data/site";

export const MobileCallBar = () => (
  <div
    data-testid="mobile-action-bar"
    className="md:hidden fixed bottom-0 inset-x-0 z-[70] grid grid-cols-2 shadow-[0_-6px_20px_rgba(0,0,0,0.35)]"
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

export default MobileCallBar;
