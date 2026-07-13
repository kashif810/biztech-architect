import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { CategoryHero } from "@/components/site/CategoryHero";
import { findProduct, productCategories, type ProductCategory } from "@/data/catalog";

export const Route = createFileRoute("/products/$category")({
  loader: ({ params }) => {
    const category = findProduct(params.category);
    if (!category) throw notFound();
    return { category };
  },
  head: ({ loaderData }) => {
    const c = loaderData?.category;
    return {
      meta: c
        ? [
            { title: `${c.name} — Enterprise IT Products | Evertech` },
            { name: "description", content: `${c.tagline} ${c.intro.slice(0, 120)}` },
            { property: "og:title", content: `${c.name} — Evertech Corporation` },
            { property: "og:description", content: c.tagline },
            { property: "og:image", content: c.image },
          ]
        : [],
    };
  },
  notFoundComponent: () => (
    <PageShell>
      <div className="container-x py-40 text-center">
        <h1 className="text-3xl font-bold text-[var(--navy-deep)]">Category not found</h1>
        <Link to="/products" className="mt-6 inline-block text-[var(--steel)] underline">Back to all products</Link>
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
  component: CategoryPage,
});

function CategoryPage() {
  const { category: c } = Route.useLoaderData() as { category: ProductCategory };

  return (
    <PageShell>
      <CategoryHero
        eyebrow="Product Category"
        title={c.name}
        tagline={c.tagline}
        image={c.image}
        breadcrumb={[
          { label: "Home", to: "/" },
          { label: "Products", to: "/products" },
          { label: c.name, to: `/products/${c.slug}` },
        ]}
      />

      {/* Intro + brands */}
      <section className="bg-white py-20 md:py-28">
        <div className="container-x grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            <span className="eyebrow"><span className="h-px w-8 bg-[var(--steel)]" /> Overview</span>
            <p className="mt-5 text-lg text-[var(--navy-deep)] leading-relaxed">{c.intro}</p>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[var(--steel)]">Brands we supply</div>
            <ul className="mt-4 space-y-2">
              {c.brands.map((b) => (
                <li key={b} className="flex items-center gap-3 text-sm text-[var(--navy-deep)] font-medium border-b border-border pb-2">
                  <span className="h-1 w-3 bg-[var(--steel)]" /> {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="bg-[var(--surface)] py-20 md:py-28">
        <div className="container-x">
          <div className="max-w-3xl">
            <span className="eyebrow"><span className="h-px w-8 bg-[var(--steel)]" /> Featured Models</span>
            <h2 className="mt-5 text-3xl md:text-4xl font-bold text-[var(--navy-deep)] leading-tight">
              Models we deploy most often.
            </h2>
            <p className="mt-4 text-muted-foreground">
              A representative selection — full catalog and tailored configurations available on request.
            </p>
          </div>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {c.featured.map((f) => (
              <div key={f.name} className="flex flex-col bg-white border border-border hover:border-[var(--steel)] transition-colors">
                <div className="p-7 flex-1">
                  <div className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[var(--steel)]">{f.brand}</div>
                  <h3 className="mt-2 text-lg font-bold text-[var(--navy-deep)]">{f.name}</h3>
                  <div className="mt-1 text-xs text-muted-foreground">{f.highlight}</div>
                  {f.price && (
                    <div className="mt-4 rounded-sm bg-[var(--surface)] border border-border px-3 py-2">
                      <div className="text-lg font-bold text-[var(--navy-deep)]">{f.price}</div>
                      {f.priceNote && <div className="mt-0.5 text-[11px] text-muted-foreground">{f.priceNote}</div>}
                    </div>
                  )}
                  <ul className="mt-5 space-y-2 border-t border-border pt-5">
                    {f.specs.map((s) => (
                      <li key={s} className="flex gap-2 text-sm text-foreground/80">
                        <CheckCircle2 className="h-4 w-4 text-[var(--steel)] shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {f.price ? (
                  <div className="grid grid-cols-2 border-t border-border">
                    <Link
                      to="/quote"
                      search={{ type: "product", category: c.slug, item: f.name, intent: "buy", qty: "1" }}
                      className="block bg-[var(--steel)] text-white text-xs font-semibold text-center py-3.5 hover:brightness-110 transition"
                    >
                      Buy 1 License
                    </Link>
                    <Link
                      to="/quote"
                      search={{ type: "product", category: c.slug, item: f.name, intent: "quote" }}
                      className="block bg-[var(--navy-deep)] text-white text-xs font-semibold text-center py-3.5 hover:bg-black transition-colors"
                    >
                      Quote for 2+
                    </Link>
                  </div>
                ) : (
                  <Link
                    to="/quote"
                    search={{ type: "product", category: c.slug, item: f.name }}
                    className="block bg-[var(--navy-deep)] text-white text-sm font-semibold text-center py-3.5 hover:bg-[var(--steel)] transition-colors"
                  >
                    Request Quotation
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="bg-white py-20 md:py-28">
        <div className="container-x grid md:grid-cols-2 gap-12 items-start">
          <div>
            <span className="eyebrow"><span className="h-px w-8 bg-[var(--steel)]" /> Who it's for</span>
            <h2 className="mt-5 text-3xl md:text-4xl font-bold text-[var(--navy-deep)] leading-tight">
              Typical use cases.
            </h2>
          </div>
          <ul className="space-y-4">
            {c.useCases.map((u) => (
              <li key={u} className="flex items-start gap-4 p-5 bg-[var(--surface)] border-l-2 border-[var(--steel)]">
                <CheckCircle2 className="h-5 w-5 text-[var(--steel)] shrink-0 mt-0.5" />
                <span className="text-[var(--navy-deep)] font-medium">{u}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[var(--navy-deep)] text-white py-20">
        <div className="container-x grid md:grid-cols-[1fr_auto] items-center gap-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">Need a quote for {c.shortName.toLowerCase()}?</h2>
            <p className="mt-3 text-white/70 max-w-xl">Send your requirement — quantity, configuration and delivery window. We respond with a detailed quotation within one business day.</p>
          </div>
          <Link
            to="/quote"
            search={{ type: "product", category: c.slug }}
            className="inline-flex items-center gap-2 rounded-sm bg-[var(--steel)] px-7 py-4 text-sm font-semibold text-white hover:brightness-110 transition w-fit"
          >
            Request Quotation <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Other categories */}
      <section className="bg-[var(--surface)] py-16 border-t border-border">
        <div className="container-x">
          <div className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[var(--steel)] mb-6">Other product categories</div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {productCategories.filter((p) => p.slug !== c.slug).map((p) => (
              <Link
                key={p.slug}
                to="/products/$category"
                params={{ category: p.slug }}
                className="flex items-center gap-3 p-4 bg-white border border-border hover:border-[var(--steel)] transition-colors"
              >
                <p.icon className="h-5 w-5 text-[var(--steel)]" />
                <span className="text-sm font-medium text-[var(--navy-deep)]">{p.shortName}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}