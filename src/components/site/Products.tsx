import { Laptop, Server, Router, Printer, Camera, Keyboard } from "lucide-react";

const categories = [
  { icon: Laptop, name: "Laptops & Desktops", desc: "Business-grade endpoints from Dell, Lenovo and HP.", specs: ["Latest Intel / AMD platforms", "Pro warranty options", "Enterprise imaging available"] },
  { icon: Server, name: "Servers", desc: "Tower, rack and blade — Dell PowerEdge & HPE ProLiant.", specs: ["Scoped to workload", "RAID & redundancy", "Onsite deployment"] },
  { icon: Router, name: "Networking", desc: "Cisco, Fortinet, TP-Link and Ubiquiti.", specs: ["Switching & routing", "Firewall & UTM", "Wi-Fi access points"] },
  { icon: Camera, name: "IP Cameras & NVR", desc: "UNV, Dahua and Hikvision surveillance systems.", specs: ["2MP – 8MP IP cameras", "PoE NVR systems", "Remote viewing"] },
  { icon: Printer, name: "Printers & Scanners", desc: "Epson, HP and Brother office productivity.", specs: ["Mono & color laser", "MFP & document scanners", "Service contracts"] },
  { icon: Keyboard, name: "Accessories", desc: "Logitech, Plantronics, Transcend, APC.", specs: ["Peripherals & headsets", "Storage & memory", "UPS & power"] },
];

export function Products() {
  return (
    <section id="products" className="bg-[var(--surface)] py-24 md:py-32">
      <div className="container-x">
        <div className="max-w-3xl">
          <span className="eyebrow"><span className="h-px w-8 bg-[var(--steel)]" /> Product Catalog</span>
          <h2 className="mt-5 text-3xl md:text-5xl font-bold text-[var(--navy-deep)] leading-tight">
            Genuine hardware. Configured for your environment.
          </h2>
          <p className="mt-5 text-muted-foreground max-w-2xl">
            Every product ships with official warranty and after-sales support. Request a tailored quotation — we'll match the specification to your workload and procurement schedule.
          </p>
        </div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((c) => (
            <div key={c.name} className="group flex flex-col bg-white border border-border hover:border-[var(--steel)] transition-colors">
              <div className="aspect-[4/3] bg-gradient-to-br from-[var(--navy-deep)] to-[var(--navy)] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_30%,white,transparent_60%)]" />
                <c.icon className="h-20 w-20 text-white/90 relative" strokeWidth={1.2} />
              </div>
              <div className="flex-1 p-7">
                <h3 className="text-lg font-bold text-[var(--navy-deep)]">{c.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
                <ul className="mt-5 space-y-2 text-sm text-foreground/75">
                  {c.specs.map((s) => (
                    <li key={s} className="flex gap-2"><span className="mt-2 h-1 w-2 bg-[var(--steel)]" />{s}</li>
                  ))}
                </ul>
              </div>
              <a href="#contact" className="block bg-[var(--navy-deep)] text-white text-sm font-semibold text-center py-3.5 hover:bg-[var(--steel)] transition-colors">
                Request Quote
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}