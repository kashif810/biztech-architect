import { Video, Network, Wrench, Building2 } from "lucide-react";

const groups = [
  {
    icon: Video,
    name: "CCTV & IP Surveillance",
    items: ["Site survey & camera installation", "NVR / VMS configuration", "Remote and centralized monitoring", "IP camera management & maintenance"],
  },
  {
    icon: Network,
    name: "Networking Solutions",
    items: ["Office LAN & structured cabling", "Enterprise network planning", "Routing, switching & firewall deployment", "Wi-Fi coverage and segmentation"],
  },
  {
    icon: Wrench,
    name: "IT Support",
    items: ["Annual maintenance contracts (AMC)", "On-site & remote troubleshooting", "Endpoint and server optimization", "IT security audit & hardening"],
  },
  {
    icon: Building2,
    name: "Corporate Supply",
    items: ["Bulk laptop, desktop & server supply", "Government & enterprise procurement", "Custom configuration & asset tagging", "Staged delivery and rollout"],
  },
];

export function Services() {
  return (
    <section id="services" className="bg-white py-24 md:py-32">
      <div className="container-x">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <span className="eyebrow"><span className="h-px w-8 bg-[var(--steel)]" /> Services</span>
            <h2 className="mt-5 text-3xl md:text-5xl font-bold text-[var(--navy-deep)] leading-tight">
              Engineered services, delivered with accountability.
            </h2>
          </div>
          <p className="text-muted-foreground max-w-md">
            From a single deployment to a fully managed estate, every engagement is scoped, documented and signed off against measurable outcomes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-px bg-border border border-border">
          {groups.map((g) => (
            <div key={g.name} className="bg-white p-8 md:p-10">
              <div className="flex items-center gap-4 pb-6 border-b border-border">
                <div className="h-12 w-12 rounded-sm bg-[var(--navy-deep)] text-white flex items-center justify-center">
                  <g.icon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-[var(--navy-deep)]">{g.name}</h3>
              </div>
              <ul className="mt-6 grid sm:grid-cols-2 gap-x-6 gap-y-3">
                {g.items.map((i) => (
                  <li key={i} className="flex gap-3 text-sm text-foreground/80">
                    <span className="mt-2 h-1 w-3 shrink-0 bg-[var(--steel)]" />
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}