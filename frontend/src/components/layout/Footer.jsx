import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Instagram, Facebook } from "lucide-react";
import { BUSINESS, NAV_LINKS } from "@/data/site";

export const Footer = () => (
  <footer className="bg-ink border-t border-white/10 pt-16 pb-8" data-testid="site-footer">
    <div className="max-w-[1400px] mx-auto px-5 md:px-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-4">
          <div className="font-display text-4xl text-white uppercase leading-none">
            US<span className="text-lime">Gold</span>
          </div>
          <p className="mt-4 text-white/60 max-w-sm leading-relaxed">
            Gymnastics & cheer for every age and level. Proudly training athletes and welcoming families
            from Roanoke and every surrounding town.
          </p>
          <div className="flex gap-3 mt-6">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-11 h-11 border border-white/20 flex items-center justify-center text-white hover:bg-lime hover:text-ink hover:border-lime transition-colors" data-testid="footer-instagram">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-11 h-11 border border-white/20 flex items-center justify-center text-white hover:bg-lime hover:text-ink hover:border-lime transition-colors" data-testid="footer-facebook">
              <Facebook className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="md:col-span-3">
          <h4 className="text-xs uppercase tracking-[0.2em] text-lime font-bold mb-4">Explore</h4>
          <div className="flex flex-col gap-2">
            {NAV_LINKS.flatMap((l) => (l.children ? l.children : [l])).map((l) => (
              <Link key={l.to} to={l.to} className="text-white/70 hover:text-lime text-sm" data-testid={`footer-link-${l.to}`}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="md:col-span-3">
          <h4 className="text-xs uppercase tracking-[0.2em] text-lime font-bold mb-4">Visit / Call</h4>
          <a href={`tel:${BUSINESS.phoneRaw}`} className="flex items-start gap-3 text-white/70 hover:text-lime text-sm mb-3" data-testid="footer-phone">
            <Phone className="w-4 h-4 mt-0.5 shrink-0" /> {BUSINESS.phone}
          </a>
          <a href={`mailto:${BUSINESS.email}`} className="flex items-start gap-3 text-white/70 hover:text-lime text-sm mb-3" data-testid="footer-email">
            <Mail className="w-4 h-4 mt-0.5 shrink-0" /> {BUSINESS.email}
          </a>
          <div className="flex items-start gap-3 text-white/70 text-sm">
            <MapPin className="w-4 h-4 mt-0.5 shrink-0" /> {BUSINESS.address}
          </div>
        </div>

        <div className="md:col-span-2">
          <h4 className="text-xs uppercase tracking-[0.2em] text-lime font-bold mb-4">Hours</h4>
          {BUSINESS.hours.map((h) => (
            <div key={h.day} className="text-sm text-white/70 mb-2">
              <div className="font-semibold text-white">{h.day}</div>
              {h.time}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-14 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between gap-3 text-white/40 text-xs uppercase tracking-wide">
        <span>© {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.</span>
        <span>Roanoke, TX • Serving DFW & surrounding towns</span>
        <span>
          Made by{" "}
          <a href="https://mostudio.com" target="_blank" rel="noreferrer" className="text-lime hover:text-white transition-colors font-bold" data-testid="footer-credit">Mo Studio</a>
        </span>
      </div>
    </div>
  </footer>
);

export default Footer;
