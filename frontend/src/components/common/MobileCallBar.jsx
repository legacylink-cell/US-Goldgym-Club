import { Phone } from "lucide-react";
import { BUSINESS } from "@/data/site";

export const MobileCallBar = () => (
  <a
    href={`tel:${BUSINESS.phoneRaw}`}
    data-testid="mobile-call-cta"
    className="md:hidden fixed bottom-0 inset-x-0 z-[70] bg-lime text-ink flex items-center justify-center gap-2 py-3.5 font-display uppercase tracking-wide text-base shadow-[0_-6px_20px_rgba(0,0,0,0.35)] active:bg-white transition-colors"
  >
    <Phone className="w-5 h-5" /> Call Us — {BUSINESS.phone}
  </a>
);

export default MobileCallBar;
