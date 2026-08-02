import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, User, LogOut } from "lucide-react";
import { NAV_LINKS, BUSINESS } from "@/data/site";
import { useAuth } from "@/context/AuthContext";
import { MagneticButton } from "@/components/common/MagneticButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Set to true to bring back the Parent Login / dashboard entry points in the nav.
const SHOW_PARENT_LOGIN = false;

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => { setOpen(false); }, [location.pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-9 inset-x-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-ink/80 backdrop-blur-xl border-b border-white/10" : "bg-gradient-to-b from-black/70 to-transparent"
      }`}
      data-testid="main-navbar"
    >
      <nav className="max-w-[1400px] mx-auto px-5 md:px-8 h-20 flex items-center justify-between">
        <Link to="/" className="flex flex-col leading-none group" data-testid="nav-logo">
          <span className="font-display text-2xl md:text-3xl text-white uppercase leading-none">
            US<span className="text-lime">Gold</span>
          </span>
          <span className="text-[9px] md:text-[10px] uppercase tracking-[0.18em] text-white/55 font-semibold mt-0.5">
            Gymnastics &amp; Cheer Academy
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) =>
            link.children ? (
              <DropdownMenu key={link.label}>
                <DropdownMenuTrigger
                  className="px-4 py-2 text-sm font-semibold uppercase tracking-wide text-white/80 hover:text-lime flex items-center gap-1 outline-none"
                  data-testid={`nav-${link.label.toLowerCase()}-trigger`}
                >
                  {link.label}
                  <ChevronDown className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-ink border border-white/15 text-white rounded-none">
                  {link.children.map((c) => (
                    <DropdownMenuItem
                      key={c.to}
                      asChild
                      className="focus:bg-lime focus:text-ink cursor-pointer uppercase text-xs tracking-wide font-semibold"
                    >
                      <Link to={c.to} data-testid={`nav-link-${c.to}`}>{c.label}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 text-sm font-semibold uppercase tracking-wide hover:text-lime ${
                  location.pathname === link.to ? "text-lime" : "text-white/80"
                }`}
                data-testid={`nav-link-${link.to}`}
              >
                {link.label}
              </Link>
            )
          )}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          {SHOW_PARENT_LOGIN && (user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:border-lime"
                data-testid="nav-user-menu"
              >
                <User className="w-5 h-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-ink border border-white/15 text-white rounded-none">
                <DropdownMenuItem asChild className="focus:bg-lime focus:text-ink cursor-pointer">
                  <Link to="/dashboard" data-testid="nav-dashboard-link">Dashboard</Link>
                </DropdownMenuItem>
                {user.role === "admin" && (
                  <DropdownMenuItem asChild className="focus:bg-lime focus:text-ink cursor-pointer">
                    <Link to="/admin" data-testid="nav-admin-link">Admin</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={async () => { await logout(); navigate("/"); }}
                  className="focus:bg-coral focus:text-white cursor-pointer"
                  data-testid="nav-logout"
                >
                  <LogOut className="w-4 h-4 mr-2" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              to="/login"
              className="text-sm font-semibold uppercase tracking-wide text-white/80 hover:text-lime px-3"
              data-testid="nav-login-link"
            >
              Parent Login
            </Link>
          ))}
          <MagneticButton as="link" to="/contact" variant="lime" className="px-6 py-3 text-base" data-testid="nav-book-trial">
            Book Free Trial
          </MagneticButton>
        </div>

        <button
          className="lg:hidden text-white p-2"
          onClick={() => setOpen((o) => !o)}
          data-testid="nav-mobile-toggle"
          aria-label="Toggle menu"
        >
          {open ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </nav>

      {open && (
        <div className="lg:hidden bg-ink border-t border-white/10 px-5 py-6 max-h-[80vh] overflow-y-auto" data-testid="mobile-menu">
          {NAV_LINKS.map((link) =>
            link.children ? (
              <div key={link.label} className="py-2">
                <div className="text-xs uppercase tracking-[0.2em] text-lime font-bold mb-1">{link.label}</div>
                {link.children.map((c) => (
                  <Link key={c.to} to={c.to} className="block py-2 text-white/85 font-semibold uppercase text-sm" data-testid={`m-nav-${c.to}`}>
                    {c.label}
                  </Link>
                ))}
              </div>
            ) : (
              <Link key={link.to} to={link.to} className="block py-3 text-white font-semibold uppercase" data-testid={`m-nav-${link.to}`}>
                {link.label}
              </Link>
            )
          )}
          <div className="mt-4 flex flex-col gap-3">
            {SHOW_PARENT_LOGIN && (user ? (
              <>
                <Link to="/dashboard" className="text-white font-semibold uppercase py-2" data-testid="m-nav-dashboard">Dashboard</Link>
                {user.role === "admin" && <Link to="/admin" className="text-white font-semibold uppercase py-2" data-testid="m-nav-admin">Admin</Link>}
                <button onClick={async () => { await logout(); navigate("/"); }} className="text-coral font-semibold uppercase text-left py-2" data-testid="m-nav-logout">Log out</button>
              </>
            ) : (
              <Link to="/login" className="text-white font-semibold uppercase py-2" data-testid="m-nav-login">Parent Login</Link>
            ))}
            <Link to="/contact" className="bg-lime text-ink font-display uppercase text-center py-4" data-testid="m-nav-book">Book Free Trial</Link>
            <a href={`tel:${BUSINESS.phoneRaw}`} className="text-white/70 text-center py-2 text-sm">{BUSINESS.phone}</a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
