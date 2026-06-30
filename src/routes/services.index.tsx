import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { CategoryHero } from "@/components/site/CategoryHero";
import { services } from "@/data/catalog";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "IT Services — CCTV, Networking, Support & Corporate Supply | Evertech" },
      { name: "description", content: "Engineered IT services delivered with accountability: surveillance, networking, IT support contracts and corporate hardware procurement." },
      { property: "og:title", content: "IT Services — Evertech Corporation" },
      { property: "og:description", content: "Surveillance, networking, support and corporate supply — scoped, documented and signed off." },
    ],
  }),
  component: ServicesIndex,
});

function ServicesIndex() {
  return (
    <PageShell>
      <CategoryHero
        eyebrow="Services"
        title="Engineered services. Documented outcomes."
        tagline="Four service lines covering surveillance, networking, IT support and corporate IT supply — each delivered against measurable scope and timelines."
        image={services[0].image}
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Services", to: "/services" }]}
      />

      <section className="bg-[var(--surface)] py-20 md:py-28">
        <div className="container-x">
          <div className="grid md:grid-cols-2 gap-6">
            {services.map((s) => (
              <Link
                key={s.slug}
                to="/services/$service"
                params={{ service: s.slug }}
                className="group flex flex-col md:flex-row bg-white border border-border hover:border-[var(--steel)] transition-colors"
              >
                <div className="md:w-2/5 aspect-[4/3] md:aspect-auto overflow-hidden bg-[var(--navy-deep)]">
                  <img
                    src={s.image}
                    alt={s.name}
                    loading="lazy"
                    className="h-full w-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  />
                </div>
                <div className="flex-1 p-7 flex flex-col">
                  <div className="flex items-start justify-between">
                    <div className="h-10 w-10 rounded-sm bg-[var(--navy-deep)] text-white flex items-center justify-center">
                      <s.icon className="h-5 w-5" />
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-[var(--steel)] transition-colors" />
                  </div>
                  <h2 className="mt-5 text-xl font-bold text-[var(--navy-deep)]">{s.name}</h2>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed flex-1">{s.tagline}</p>
                  <div className="mt-5 text-xs text-[var(--steel)] font-semibold uppercase tracking-wider">View details →</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}