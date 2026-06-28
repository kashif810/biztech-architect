import { ShieldCheck, BadgeCheck, Building2, Banknote, Headphones, FileBadge } from "lucide-react";

const trust = [
  { icon: BadgeCheck, title: "Registered Business", desc: "Officially registered enterprise operating since 2001." },
  { icon: ShieldCheck, title: "Genuine Products", desc: "100% authentic hardware sourced through authorized channels." },
  { icon: FileBadge, title: "Warranty Assurance", desc: "Manufacturer warranty on every product we supply." },
  { icon: Building2, title: "Corporate Clients Support", desc: "Dedicated account handling for enterprise and government." },
  { icon: Banknote, title: "Bank Transfer Available", desc: "Secure B2B payments and corporate invoicing supported." },
  { icon: Headphones, title: "Responsive After-Sales", desc: "Technical support and AMC coverage post-deployment." },
];

export function Trust() {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="container-x">
        <div className="max-w-3xl">
          <span className="eyebrow"><span className="h-px w-8 bg-[var(--steel)]" /> Why Evertech</span>
          <h2 className="mt-5 text-3xl md:text-5xl font-bold text-[var(--navy-deep)] leading-tight">
            Built on trust. Backed by accountability.
          </h2>
        </div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trust.map((t) => (
            <div key={t.title} className="flex gap-5 rounded-sm border border-border p-6 hover:border-[var(--steel)] hover:shadow-[0_8px_30px_-12px_rgba(20,40,90,0.15)] transition">
              <div className="h-12 w-12 shrink-0 rounded-sm bg-[var(--navy-deep)] text-white flex items-center justify-center">
                <t.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--navy-deep)]">{t.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}