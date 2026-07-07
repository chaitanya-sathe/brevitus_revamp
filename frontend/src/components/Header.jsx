import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { List, X } from "@phosphor-icons/react";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/courses", label: "Courses" },
  { to: "/blog", label: "Blog" },
  { to: "/success-stories", label: "Success Stories" },
  { to: "/about", label: "About" },
  { to: "/team", label: "Team" },
  { to: "/contact", label: "Contact" },
];

export default function Header({ settings }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => { setOpen(false); }, [loc.pathname]);

  return (
    <header
      data-testid="site-header"
      className={`sticky top-0 z-40 transition-all ${scrolled ? "backdrop-blur-xl bg-white/80 border-b border-slate-200/80" : "bg-transparent"}`}
    >
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <Link to="/" data-testid="brand-link" className="flex items-center gap-2">
          <img
            src={settings?.logo || "/assets/brevitus-logo.jpeg"}
            alt="Brevitus Technology"
            className="h-11 w-11 rounded-xl object-cover bg-black"
          />
          <div className="leading-tight">
            <div className="font-heading font-bold text-lg text-slate-900">Brevitus</div>
            <div className="text-[10px] uppercase tracking-widest text-slate-500 -mt-0.5">Technology</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              data-testid={`nav-${n.label.toLowerCase().replace(/\s+/g, "-")}`}
              className={`text-sm font-medium hover:text-purple-700 transition ${loc.pathname === n.to ? "text-purple-700" : "text-slate-700"}`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link to="/admission" data-testid="header-apply-btn" className="px-4 py-2 rounded-full text-sm font-semibold bg-brand-gradient text-white hover:opacity-95 transition">
            Apply Now
          </Link>
        </div>

        <button onClick={() => setOpen((v) => !v)} className="lg:hidden p-2" data-testid="mobile-menu-btn">
          {open ? <X size={24} /> : <List size={24} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-slate-200 bg-white">
          <div className="px-6 py-4 flex flex-col gap-3">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} data-testid={`mobile-nav-${n.label.toLowerCase().replace(/\s+/g, "-")}`} className="py-2 text-slate-800">
                {n.label}
              </Link>
            ))}
            <Link to="/admission" data-testid="mobile-apply-btn" className="mt-2 text-center px-4 py-3 rounded-full bg-brand-gradient text-white font-semibold">Apply Now</Link>
          </div>
        </div>
      )}
    </header>
  );
}
