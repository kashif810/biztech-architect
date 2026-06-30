import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import logo from "@/assets/evertech-logo.png";
import { productCategories, services } from "@/data/catalog";

type MenuKey = "products" | "services" | null;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<MenuKey>(null);
  const [mobileSub, setMobileSub] = useState<MenuKey>(null);

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
      onMouseLeave={() => setMenu(null)}
    >
      <div className="container-x flex h-16 md:h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Evertech" className="h-10 w-10" />
          <div className="text-white font-display font-bold tracking-tight text-base md:text-lg">
            EverTech Corporation
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          <Link to="/" hash="solutions" className="text-sm font-medium text-white/80 hover:text-white transition-colors" onMouseEnter={() => setMenu(null)}>
            Solutions
          </Link>

          <div onMouseEnter={() => setMenu("services")} className="relative">
            <Link to="/services" className="inline-flex items-center gap-1 text-sm font-medium text-white/80 hover:text-white transition-colors">
              Services <ChevronDown className="h-3 w-3 opacity-70" />
            </Link>
          </div>

          <div onMouseEnter={() => setMenu("products")} className="relative">
            <Link to="/products" className="inline-flex items-center gap-1 text-sm font-medium text-white/80 hover:text-white transition-colors">
              Products <ChevronDown className="h-3 w-3 opacity-70" />
            </Link>
          </div>

          <Link to="/" hash="about" className="text-sm font-medium text-white/80 hover:text-white transition-colors" onMouseEnter={() => setMenu(null)}>
            About
          </Link>
          <Link to="/" hash="brands" className="text-sm font-medium text-white/80 hover:text-white transition-colors" onMouseEnter={() => setMenu(null)}>
            Brands
          </Link>
          <Link to="/" hash="contact" className="text-sm font-medium text-white/80 hover:text-white transition-colors" onMouseEnter={() => setMenu(null)}>
            Contact
          </Link>
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link
            to="/"
            hash="contact"
            className="inline-flex items-center justify-center rounded-sm bg-[var(--steel)] px-5 py-2.5 text-sm font-semibold text-white hover:brightness-110 transition"
          >
            Request Quotation
          </Link>
        </div>

        <button
          aria-label="Menu"
          onClick={() => setOpen((o) => !o)}
          className="lg:hidden text-white p-2"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Desktop mega-menu */}
      {menu && (
        <div
          className="hidden lg:block absolute inset-x-0 top-full bg-[var(--navy-deep)] border-t border-white/10 shadow-2xl animate-fade-in"
          onMouseEnter={() => setMenu(menu)}
        >
          <div className="container-x py-8">
            {menu === "products" && (
              <div className="grid grid-cols-3 gap-2">
                {productCategories.map((c) => (
                  <Link
                    key={c.slug}
                    to="/products/$category"
                    params={{ category: c.slug }}
                    onClick={() => setMenu(null)}
                    className="group flex items-start gap-4 p-4 hover:bg-white/5 transition-colors border-l-2 border-transparent hover:border-[var(--steel)]"
                  >
                    <div className="h-10 w-10 rounded-sm bg-white/5 group-hover:bg-[var(--steel)]/20 flex items-center justify-center shrink-0">
                      <c.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-white">{c.name}</div>
                      <div className="mt-1 text-xs text-white/60 line-clamp-2">{c.tagline}</div>
                    </div>
                  </Link>
                ))}
                <div className="col-span-3 mt-2 pt-4 border-t border-white/10">
                  <Link to="/products" onClick={() => setMenu(null)} className="text-xs font-semibold uppercase tracking-wider text-[var(--steel)] hover:text-white transition-colors">
                    View all products →
                  </Link>
                </div>
              </div>
            )}

            {menu === "services" && (
              <div className="grid grid-cols-2 gap-2">
                {services.map((s) => (
                  <Link
                    key={s.slug}
                    to="/services/$service"
                    params={{ service: s.slug }}
                    onClick={() => setMenu(null)}
                    className="group flex items-start gap-4 p-4 hover:bg-white/5 transition-colors border-l-2 border-transparent hover:border-[var(--steel)]"
                  >
                    <div className="h-10 w-10 rounded-sm bg-white/5 group-hover:bg-[var(--steel)]/20 flex items-center justify-center shrink-0">
                      <s.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-white">{s.name}</div>
                      <div className="mt-1 text-xs text-white/60 line-clamp-2">{s.tagline}</div>
                    </div>
                  </Link>
                ))}
                <div className="col-span-2 mt-2 pt-4 border-t border-white/10">
                  <Link to="/services" onClick={() => setMenu(null)} className="text-xs font-semibold uppercase tracking-wider text-[var(--steel)] hover:text-white transition-colors">
                    View all services →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-[var(--navy-deep)] border-t border-white/10 max-h-[80vh] overflow-y-auto">
          <div className="container-x py-4 flex flex-col gap-1">
            <Link to="/" hash="solutions" onClick={() => setOpen(false)} className="py-3 text-white/80 hover:text-white border-b border-white/5">Solutions</Link>

            <div className="border-b border-white/5">
              <button onClick={() => setMobileSub(mobileSub === "services" ? null : "services")} className="w-full flex items-center justify-between py-3 text-white/80">
                Services <ChevronDown className={`h-4 w-4 transition-transform ${mobileSub === "services" ? "rotate-180" : ""}`} />
              </button>
              {mobileSub === "services" && (
                <div className="pb-3 pl-3 flex flex-col">
                  <Link to="/services" onClick={() => setOpen(false)} className="py-2 text-xs uppercase tracking-wider text-[var(--steel)]">All services →</Link>
                  {services.map((s) => (
                    <Link key={s.slug} to="/services/$service" params={{ service: s.slug }} onClick={() => setOpen(false)} className="py-2 text-sm text-white/70 hover:text-white flex items-center gap-2">
                      <s.icon className="h-4 w-4" /> {s.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="border-b border-white/5">
              <button onClick={() => setMobileSub(mobileSub === "products" ? null : "products")} className="w-full flex items-center justify-between py-3 text-white/80">
                Products <ChevronDown className={`h-4 w-4 transition-transform ${mobileSub === "products" ? "rotate-180" : ""}`} />
              </button>
              {mobileSub === "products" && (
                <div className="pb-3 pl-3 flex flex-col">
                  <Link to="/products" onClick={() => setOpen(false)} className="py-2 text-xs uppercase tracking-wider text-[var(--steel)]">All products →</Link>
                  {productCategories.map((c) => (
                    <Link key={c.slug} to="/products/$category" params={{ category: c.slug }} onClick={() => setOpen(false)} className="py-2 text-sm text-white/70 hover:text-white flex items-center gap-2">
                      <c.icon className="h-4 w-4" /> {c.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link to="/" hash="about" onClick={() => setOpen(false)} className="py-3 text-white/80 hover:text-white border-b border-white/5">About</Link>
            <Link to="/" hash="brands" onClick={() => setOpen(false)} className="py-3 text-white/80 hover:text-white border-b border-white/5">Brands</Link>
            <Link to="/" hash="contact" onClick={() => setOpen(false)} className="py-3 text-white/80 hover:text-white border-b border-white/5">Contact</Link>

            <Link
              to="/"
              hash="contact"
              onClick={() => setOpen(false)}
              className="mt-3 inline-flex items-center justify-center rounded-sm bg-[var(--steel)] px-5 py-3 text-sm font-semibold text-white"
            >
              Request Quotation
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}