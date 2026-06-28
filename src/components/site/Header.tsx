import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/evertech-logo.png";

const navItems = [
  { label: "Solutions", href: "#solutions" },
  { label: "Services", href: "#services" },
  { label: "Products", href: "#products" },
  { label: "About", href: "#about" },
  { label: "Brands", href: "#brands" },
  { label: "Contact", href: "#contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[var(--navy-deep)]/90 backdrop-blur-md border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="container-x flex h-16 md:h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Evertech" className="h-9 w-9" />
          <div className="leading-tight">
            <div className="text-white font-display font-bold tracking-tight text-base md:text-lg">EVERTECH</div>
            <div className="text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-white/60">Corporation</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="text-sm font-medium text-white/80 hover:text-white transition-colors"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <a
            href="#contact"
            className="inline-flex items-center justify-center rounded-sm bg-[var(--steel)] px-5 py-2.5 text-sm font-semibold text-white hover:brightness-110 transition"
          >
            Request Quotation
          </a>
        </div>

        <button
          aria-label="Menu"
          onClick={() => setOpen((o) => !o)}
          className="lg:hidden text-white p-2"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-[var(--navy-deep)] border-t border-white/10">
          <div className="container-x py-4 flex flex-col gap-1">
            {navItems.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="py-3 text-white/80 hover:text-white border-b border-white/5"
              >
                {n.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-3 inline-flex items-center justify-center rounded-sm bg-[var(--steel)] px-5 py-3 text-sm font-semibold text-white"
            >
              Request Quotation
            </a>
          </div>
        </div>
      )}
    </header>
  );
}