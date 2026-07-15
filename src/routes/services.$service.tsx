import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { CategoryHero } from "@/components/site/CategoryHero";
import { findService, services, type ServiceDetail } from "@/data/catalog";

export const Route = createFileRoute("/services/$service")({
  loader: ({ params }) => {
    const service = findService(params.service);
    if (!service) throw notFound();
    return { service };
  },
  head: ({ loaderData }) => {
    const s = loaderData?.service;
    return {
      meta: s
        ? [
            { title: `${s.name} — Enterprise IT Services | Evertech` },
            { name: "description", content: `${s.tagline} ${s.intro.slice(0, 120)}` },
            { property: "og:title", content: `${s.name} — Evertech Corporation` },
            { property: "og:description", content: s.tagline },
            { property: "og:image", content: s.image },
          ]
        : [],
    };
  },
  notFoundComponent: () => (
    <PageShell>
      <div className="container-x py-40 text-center">
        <h1 className="text-3xl font-bold text-[var(--navy-deep)]">Service not found</h1>
        <Link to="/services" className="mt-6 inline-block text-[var(--steel)] underline">Back to all services</Link>
      </div>
    </PageShell>
  ),
  errorComponent: ({ reset }) => (
    <PageShell>
      <div className="container-x py-40 text-center">
        <h1 className="text-3xl font-bold text-[var(--navy-deep)]">Something went wrong</h1>
        <button onClick={() => reset()} className="mt-6 text-[var(--steel)] underline">Try again</button>
      </div>
    </PageShell>
  ),
  component: ServicePage,
});

function ServicePage() {
  const { service: s } = Route.useLoaderData() as { service: ServiceDetail };

  return (
    <PageShell>
      <CategoryHero
        eyebrow="Service"
        title={s.name}
        tagline={s.tagline}
        image={s.image}
        breadcrumb={[
          { label: "Home", to: "/" },
          { label: "Services", to: "/services" },
          { label: s.name, to: `/services/${s.slug}` },
        ]}
      />

      <section className="bg-white py-20 md:py-28">
        <div className="container-x grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            <span className="eyebrow"><span className="h-px w-8 bg-[var(--steel)]" /> Overview</span>
            <p className="mt-5 text-lg text-[var(--navy-deep)] leading-relaxed">{s.intro}</p>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[var(--steel)]">Industries served</div>
            <ul className="mt-4 space-y-2">
              {s.industries.map((i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-[var(--navy-deep)] font-medium border-b border-border pb-2">
                  <span className="h-1 w-3 bg-[var(--steel)]" /> {i}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="bg-[var(--surface)] py-20 md:py-28">
        <div className="container-x">
          <div className="max-w-3xl">
            <span className="eyebrow"><span className="h-px w-8 bg-[var(--steel)]" /> What's included</span>
            <h2 className="mt-5 text-3xl md:text-4xl font-bold text-[var(--navy-deep)] leading-tight">
              Scope, written down.
            </h2>
          </div>
          <div className="mt-12 grid sm:grid-cols-2 gap-px bg-border border border-border">
            {s.included.map((item) => (
              <div key={item} className="bg-white p-6 flex items-start gap-4">
                <CheckCircle2 className="h-5 w-5 text-[var(--steel)] shrink-0 mt-0.5" />
                <span className="text-[var(--navy-deep)] font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-white py-20 md:py-28">
        <div className="container-x">
          <div className="max-w-3xl">
            <span className="eyebrow"><span className="h-px w-8 bg-[var(--steel)]" /> How we deliver</span>
            <h2 className="mt-5 text-3xl md:text-4xl font-bold text-[var(--navy-deep)] leading-tight">
              A four-step engagement.
            </h2>
          </div>
          <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border">
            {s.process.map((p) => (
              <div key={p.step} className="bg-white p-7">
                <div className="text-3xl font-bold font-display text-[var(--steel)]">{p.step}</div>
                <h3 className="mt-4 text-lg font-bold text-[var(--navy-deep)]">{p.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[var(--navy-deep)] text-white py-20">
        <div className="container-x grid md:grid-cols-[1fr_auto] items-center gap-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">Discuss your {s.shortName.toLowerCase()} requirement.</h2>
            <p className="mt-3 text-white/70 max-w-xl">Share your scope — site count, devices, timelines. We respond with a written proposal and indicative quotation within one business day.</p>
          </div>
          <Link
            to="/quote"
            search={{ type: "service", service: s.slug }}
            className="inline-flex items-center gap-2 rounded-sm bg-[var(--steel)] px-7 py-4 text-sm font-semibold text-white hover:brightness-110 transition w-fit"
          >
            Request Consultation <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Other services */}
      <section className="bg-[var(--surface)] py-16 border-t border-border">
        <div className="container-x">
          <div className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[var(--steel)] mb-6">Other services</div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {services.filter((x) => x.slug !== s.slug).map((x) => (
              <Link
                key={x.slug}
                to="/services/$service"
                params={{ service: x.slug }}
                className="flex items-center gap-3 p-4 bg-white border border-border hover:border-[var(--steel)] transition-colors"
              >
                <x.icon className="h-5 w-5 text-[var(--steel)]" />
                <span className="text-sm font-medium text-[var(--navy-deep)]">{x.shortName}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
