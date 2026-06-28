import { Check } from "lucide-react";
import aboutBg from "@/assets/about-bg.jpg";

const pillars = [
  "Customized IT solutions matched to business needs",
  "Reliable after-sales and technical support",
  "Competitive pricing without compromising quality",
  "Commitment to eco-friendly technology",
];

export function About() {
  return (
    <section id="about" className="relative bg-[var(--navy-deep)] text-white py-24 md:py-32 overflow-hidden">
      <img src={aboutBg} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--navy-deep)] via-[var(--navy-deep)]/95 to-[var(--navy-deep)]/70" />

      <div className="relative container-x grid lg:grid-cols-12 gap-12 lg:gap-16">
        <div className="lg:col-span-5">
          <span className="eyebrow text-white/70"><span className="h-px w-8 bg-[var(--steel)]" /> About Evertech</span>
          <h2 className="mt-5 text-3xl md:text-5xl font-bold leading-tight">
            Empowering businesses with technology that lasts.
          </h2>
          <p className="mt-6 text-white/70 leading-relaxed">
            Founded in 2001 in Lahore, Pakistan, Evertech Corporation is a trusted provider of enterprise IT solutions. As an official partner of Dell and Lenovo, we deliver reliable, cost-effective and environmentally responsible technology — backed by responsive after-sales service.
          </p>

          <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
            <div>
              <dt className="text-xs uppercase tracking-wider text-white/50">Founded</dt>
              <dd className="mt-2 text-2xl font-bold font-display">2001</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-white/50">Headquarters</dt>
              <dd className="mt-2 text-2xl font-bold font-display">Lahore</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-white/50">Partners</dt>
              <dd className="mt-2 text-2xl font-bold font-display">Dell · Lenovo</dd>
            </div>
          </dl>
        </div>

        <div className="lg:col-span-7 lg:pl-10 lg:border-l lg:border-white/10">
          <h3 className="text-xl font-semibold text-white">More than a supplier — a long-term partner.</h3>
          <p className="mt-3 text-white/70 leading-relaxed">
            At Evertech Corporation, we do more than supply IT products. We build lasting partnerships and prepare organizations for today's challenges and tomorrow's opportunities.
          </p>

          <ul className="mt-8 grid sm:grid-cols-2 gap-4">
            {pillars.map((p) => (
              <li key={p} className="flex gap-3 rounded-sm border border-white/10 bg-white/5 p-4">
                <div className="h-6 w-6 shrink-0 rounded-sm bg-[var(--steel)]/20 text-[var(--steel)] flex items-center justify-center">
                  <Check className="h-4 w-4" />
                </div>
                <span className="text-sm text-white/85 leading-relaxed">{p}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap gap-4">
            <a href="#services" className="inline-flex items-center gap-2 rounded-sm bg-[var(--steel)] px-6 py-3 text-sm font-semibold text-white hover:brightness-110">
              Our Services
            </a>
            <a href="#profile" className="inline-flex items-center gap-2 rounded-sm border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">
              Download Profile
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}