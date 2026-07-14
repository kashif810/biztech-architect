import { useEffect, useState } from "react";
import { ArrowRight, FileText } from "lucide-react";
import heroInfra from "@/assets/hero-infrastructure.jpg";
import heroSec from "@/assets/hero-security.jpg";
import heroProc from "@/assets/hero-procurement.jpg";

const slides = [
  {
    image: heroInfra,
    eyebrow: "Enterprise IT Infrastructure",
    title: "Infrastructure built for what your business runs on.",
    sub: "Server deployment, networking design and IT systems engineered for uptime, scale and security across your organization.",
  },
  {
    image: heroSec,
    eyebrow: "Surveillance & Security",
    title: "Total visibility. Verified protection.",
    sub: "IP video surveillance, camera installation and information security solutions deployed and managed end-to-end.",
  },
  {
    image: heroProc,
    eyebrow: "Corporate Hardware Supply",
    title: "Genuine hardware, sourced at corporate scale.",
    sub: "Official Dell and Lenovo partner. Bulk procurement of laptops, desktops, servers and accessories with warranty and after-sales.",
  },
];

export function Hero() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((p) => (p + 1) % slides.length), 6500);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative isolate overflow-hidden bg-[var(--navy-deep)] text-white">
      {slides.map((s, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            idx === i ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={s.image}
            alt=""
            className="h-full w-full object-cover"
            loading={idx === 0 ? "eager" : "lazy"}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--navy-deep)]/95 via-[var(--navy-deep)]/80 to-[var(--navy-deep)]/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy-deep)] via-transparent to-transparent" />
        </div>
      ))}

      <div className="relative container-x pt-24 sm:pt-28 md:pt-44 pb-16 md:pb-32 min-h-[560px] sm:min-h-[620px] md:min-h-[780px] flex flex-col justify-center">
        <div className="max-w-3xl">
          {slides.map((s, idx) => (
            <div
              key={idx}
              className={`transition-all duration-700 ${
                idx === i ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 absolute pointer-events-none"
              }`}
            >
              <span className="eyebrow text-white/70">
                <span className="h-px w-8 bg-[var(--steel)]" /> {s.eyebrow}
              </span>
              <h1 className="mt-4 text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
                {s.title}
              </h1>
              <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-white/75 max-w-2xl leading-relaxed">
                {s.sub}
              </p>
            </div>
          ))}

          <div className="mt-6 sm:mt-10 flex flex-wrap gap-2 sm:gap-3">
            <a
              href="#solutions"
              className="inline-flex items-center gap-2 rounded-sm bg-[var(--steel)] px-4 sm:px-6 py-3 sm:py-3.5 text-xs sm:text-sm font-semibold text-white hover:brightness-110 transition"
            >
              Explore Solutions <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-sm border border-white/30 bg-white/5 px-4 sm:px-6 py-3 sm:py-3.5 text-xs sm:text-sm font-semibold text-white hover:bg-white/10 transition"
            >
              Request Quotation
            </a>
            <a
              href="#profile"
              className="inline-flex items-center gap-2 rounded-sm px-4 sm:px-6 py-3 sm:py-3.5 text-xs sm:text-sm font-semibold text-white/80 hover:text-white transition"
            >
              <FileText className="h-4 w-4" /> Company Profile
            </a>
          </div>
        </div>

        <div className="mt-8 sm:mt-16 flex items-center gap-3">
          {slides.map((_, idx) => (
            <button
              key={idx}
              aria-label={`Slide ${idx + 1}`}
              onClick={() => setI(idx)}
              className={`h-1 transition-all ${
                idx === i ? "w-12 bg-[var(--steel)]" : "w-6 bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
          <span className="ml-3 text-xs text-white/50 tabular-nums">
            0{i + 1} / 0{slides.length}
          </span>
        </div>
      </div>

      {/* Stats strip */}
      <div className="relative border-t border-white/10 bg-[var(--navy-deep)]/80 backdrop-blur">
        <div className="container-x grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10">
          {[
            { k: "20+", v: "Years in enterprise IT" },
            { k: "500+", v: "Satisfied corporate customers" },
            { k: "Dell · Lenovo", v: "Official partner" },
            { k: "24 / 7", v: "After-sales support" },
          ].map((s) => (
            <div key={s.v} className="bg-[var(--navy-deep)] px-5 py-6">
              <div className="text-2xl md:text-3xl font-bold font-display text-white">{s.k}</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-white/60">{s.v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}