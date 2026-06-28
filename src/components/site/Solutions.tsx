import { Cpu, Network, Video, Wrench, Building2, ShieldCheck, ArrowUpRight } from "lucide-react";

const items = [
  {
    icon: Cpu,
    title: "IT Hardware Supply",
    desc: "Laptops, desktops and servers from Dell, Lenovo and HP — sourced as an authorized partner with full warranty.",
    tag: "Procurement",
  },
  {
    icon: Network,
    title: "Networking & Infrastructure",
    desc: "Routing, switching, enterprise LAN design and deployment for distributed offices and data centers.",
    tag: "Infrastructure",
  },
  {
    icon: Video,
    title: "CCTV & IP Surveillance",
    desc: "IP video surveillance, camera installation and centralized monitoring with UNV, Dahua and Hikvision systems.",
    tag: "Security",
  },
  {
    icon: Wrench,
    title: "IT Support & Maintenance",
    desc: "Annual maintenance contracts (AMC), troubleshooting and system optimization with response SLAs.",
    tag: "Managed Services",
  },
  {
    icon: Building2,
    title: "Corporate Bulk Procurement",
    desc: "Government and enterprise procurement, custom quotations, staged delivery and asset tagging.",
    tag: "B2B Supply",
  },
  {
    icon: ShieldCheck,
    title: "Information Security",
    desc: "IT security audits, perimeter hardening and identity-aware network policies for compliant operations.",
    tag: "Cybersecurity",
  },
];

export function Solutions() {
  return (
    <section id="solutions" className="relative bg-[var(--surface)] py-24 md:py-32">
      <div className="container-x">
        <div className="max-w-3xl">
          <span className="eyebrow"><span className="h-px w-8 bg-[var(--steel)]" /> Solutions</span>
          <h2 className="mt-5 text-3xl md:text-5xl font-bold text-[var(--navy-deep)] leading-tight">
            A single partner for the full enterprise IT stack.
          </h2>
          <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-2xl">
            From procurement to deployment to managed support — Evertech delivers connected solutions across infrastructure, security and corporate hardware supply.
          </p>
        </div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
          {items.map((it) => (
            <a
              key={it.title}
              href="#contact"
              className="group relative bg-white p-8 md:p-10 hover:bg-[var(--navy-deep)] transition-colors duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="h-12 w-12 rounded-sm bg-[var(--navy-deep)]/5 text-[var(--navy-deep)] group-hover:bg-[var(--steel)]/20 group-hover:text-[var(--steel)] flex items-center justify-center transition-colors">
                  <it.icon className="h-6 w-6" />
                </div>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-white transition-colors" />
              </div>
              <div className="mt-8 text-[10px] uppercase tracking-[0.2em] text-[var(--steel)] font-semibold">{it.tag}</div>
              <h3 className="mt-3 text-xl font-bold text-[var(--navy-deep)] group-hover:text-white transition-colors">{it.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground group-hover:text-white/70 transition-colors leading-relaxed">
                {it.desc}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}