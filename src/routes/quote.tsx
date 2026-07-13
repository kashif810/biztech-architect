import { useMemo, useState } from "react";
import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Send } from "lucide-react";
import { z } from "zod";
import { PageShell } from "@/components/site/PageShell";
import { findProduct, findService } from "@/data/catalog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const PHONE = "+923218446447";
const EMAIL = "info@evertech.com.pk";

const searchSchema = z.object({
  type: z.enum(["product", "service"]).optional(),
  category: z.string().optional(),
  service: z.string().optional(),
  item: z.string().optional(),
  qty: z.string().optional(),
  intent: z.enum(["buy", "quote"]).optional(),
});

export const Route = createFileRoute("/quote")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Request a Quotation — Evertech" },
      { name: "description", content: "Request a tailored quotation for a specific product or service. Adjust specs, quantity, and delivery details before submitting." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: QuotePage,
  errorComponent: ({ reset }) => (
    <PageShell>
      <div className="container-x py-32 text-center">
        <h1 className="text-3xl font-bold text-[var(--navy-deep)]">Something went wrong</h1>
        <button onClick={() => reset()} className="mt-6 text-[var(--steel)] underline">Try again</button>
      </div>
    </PageShell>
  ),
});

function QuotePage() {
  const search = useSearch({ from: "/quote" });
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const context = useMemo(() => {
    if (search.type === "service" && search.service) {
      const s = findService(search.service);
      if (!s) return null;
      return {
        kind: "service" as const,
        title: s.name,
        eyebrow: "Service",
        breadcrumb: { label: s.name, to: `/services/${s.slug}` as const, back: "/services" as const },
        summary: s.tagline,
        lines: s.included,
        lineLabel: "Scope items — tick / edit what you need",
        reqType: mapServiceReqType(s.slug),
        productLine: s.name,
      };
    }
    if (search.type === "product" && search.category) {
      const c = findProduct(search.category);
      if (!c) return null;
      const item = search.item ? c.featured.find((f) => f.name === search.item) : undefined;
      return {
        kind: "product" as const,
        title: item ? `${item.brand} ${item.name}` : c.name,
        eyebrow: item ? `${c.name} · ${item.brand}` : c.name,
        breadcrumb: { label: c.name, to: `/products/${c.slug}` as const, back: "/products" as const },
        summary: item?.highlight ?? c.tagline,
        lines: item?.specs ?? [],
        lineLabel: item ? "Configuration — edit any line to request a change" : "",
        reqType: "IT Hardware Supply",
        productLine: item ? `${item.brand} ${item.name}` : c.name,
        price: item?.price,
        priceNote: item?.priceNote,
      };
    }
    return null;
  }, [search]);

  const [specs, setSpecs] = useState<string[]>(context?.lines ?? []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    const form = new FormData(e.currentTarget);
    const cleanedSpecs = specs.map((s) => s.trim()).filter(Boolean);

    const specBlock = cleanedSpecs.length
      ? `\n\nRequested configuration / scope:\n- ${cleanedSpecs.join("\n- ")}`
      : "";

    const notes = String(form.get("notes") ?? "").trim();
    const message = `${context?.summary ?? ""}${specBlock}${notes ? `\n\nAdditional notes:\n${notes}` : ""}`.slice(0, 2000);

    const payload = {
      name: String(form.get("name") ?? "").trim().slice(0, 100),
      company: String(form.get("company") ?? "").trim().slice(0, 150),
      email: String(form.get("email") ?? "").trim().slice(0, 255),
      phone: String(form.get("phone") ?? "").trim().slice(0, 40),
      req_type: (context?.reqType ?? "Other").slice(0, 80),
      product: (context?.productLine ?? "General enquiry").slice(0, 300),
      qty: String(form.get("qty") ?? "").trim().slice(0, 40) || null,
      message,
    };

    setSubmitting(true);
    const { error } = await supabase.from("leads").insert(payload);
    setSubmitting(false);

    if (error) {
      console.error("Lead insert failed:", error);
      toast.error("Could not save your request. Please try again or contact us directly.");
      return;
    }

    const lines = [
      `New Quotation Request — Evertech Corporation`,
      ``,
      `Item: ${payload.product}`,
      `Requirement Type: ${payload.req_type}`,
      `Quantity: ${payload.qty ?? "-"}`,
      ``,
      `Name: ${payload.name}`,
      `Company: ${payload.company}`,
      `Email: ${payload.email}`,
      `Phone: ${payload.phone}`,
      ``,
      `Details:`,
      payload.message,
    ].join("\n");

    const subject = `RFQ — ${payload.product} — ${payload.company}`;
    const waUrl = `https://wa.me/${PHONE.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(lines)}`;
    const mailUrl = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines)}`;

    window.open(waUrl, "_blank", "noopener,noreferrer");
    window.location.href = mailUrl;

    toast.success("Request saved. WhatsApp and email opened for delivery.");
    setSent(true);
  }

  if (!context) {
    return (
      <PageShell>
        <div className="container-x py-32 text-center">
          <h1 className="text-3xl font-bold text-[var(--navy-deep)]">Choose an item first</h1>
          <p className="mt-3 text-muted-foreground">Pick a product or service to request a quotation for.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/products" className="rounded-sm bg-[var(--navy-deep)] text-white px-5 py-3 text-sm font-semibold">Browse Products</Link>
            <Link to="/services" className="rounded-sm border border-border px-5 py-3 text-sm font-semibold text-[var(--navy-deep)]">Browse Services</Link>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section className="bg-[var(--navy-deep)] text-white py-14">
        <div className="container-x">
          <Link to={context.breadcrumb.back} className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/60 hover:text-white">
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </Link>
          <div className="mt-4 text-[10px] uppercase tracking-[0.25em] text-[var(--steel)] font-semibold">{context.eyebrow}</div>
          <h1 className="mt-2 text-3xl md:text-4xl font-bold leading-tight">Request quotation — {context.title}</h1>
          <p className="mt-3 text-white/70 max-w-2xl">{context.summary}</p>
        </div>
      </section>

      <section className="bg-[var(--surface)] py-16 md:py-20">
        <div className="container-x grid lg:grid-cols-12 gap-10">
          {/* Left: item summary + editable specs */}
          <aside className="lg:col-span-5">
            <div className="rounded-sm border border-border bg-white p-6 md:p-8 sticky top-24">
              <div className="text-[10px] uppercase tracking-[0.25em] text-[var(--steel)] font-semibold">You are quoting</div>
              <h2 className="mt-2 text-xl font-bold text-[var(--navy-deep)]">{context.title}</h2>
              {"price" in context && context.price && (
                <div className="mt-4 rounded-sm bg-[var(--surface)] border border-border px-4 py-3">
                  <div className="text-lg font-bold text-[var(--navy-deep)]">{context.price}</div>
                  {context.priceNote && <div className="mt-0.5 text-[11px] text-muted-foreground">{context.priceNote}</div>}
                </div>
              )}

              {specs.length > 0 && (
                <>
                  <div className="mt-6 text-[10px] uppercase tracking-[0.25em] text-[var(--steel)] font-semibold">{context.lineLabel}</div>
                  <ul className="mt-3 space-y-2">
                    {specs.map((s, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[var(--steel)] shrink-0 mt-2.5" />
                        <input
                          value={s}
                          onChange={(e) => setSpecs((prev) => prev.map((v, idx) => (idx === i ? e.target.value : v)))}
                          className="flex-1 rounded-sm border border-border bg-white px-2.5 py-1.5 text-sm text-[var(--navy-deep)] focus:outline-none focus:ring-2 focus:ring-[var(--steel)]"
                        />
                        <button
                          type="button"
                          onClick={() => setSpecs((prev) => prev.filter((_, idx) => idx !== i))}
                          className="text-xs text-muted-foreground hover:text-[var(--steel)] px-1.5"
                          aria-label="Remove line"
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => setSpecs((prev) => [...prev, ""])}
                    className="mt-3 text-xs font-semibold text-[var(--steel)] hover:underline"
                  >
                    + Add another line
                  </button>
                  <p className="mt-4 text-[11px] text-muted-foreground leading-relaxed">
                    Edit any line to request a change (e.g. bump SSD to 1 TB, add second monitor, extend warranty to 5 years).
                  </p>
                </>
              )}
            </div>
          </aside>

          {/* Right: form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="rounded-sm border border-border bg-white p-6 md:p-8">
              <div className="grid md:grid-cols-2 gap-5">
                <Field name="name" label="Full Name" required />
                <Field name="company" label="Company Name" required />
                <Field name="email" label="Work Email" type="email" required />
                <Field name="phone" label="Phone / WhatsApp" required />
                <Field name="qty" label={context.kind === "service" ? "Sites / seats (approx.)" : "Quantity (approx.)"} defaultValue={search.qty ?? (search.intent === "buy" ? "1" : "")} />
                <div>
                  <Label>Delivery timeline</Label>
                  <input name="timeline" placeholder="e.g. within 2 weeks" className="mt-2 w-full rounded-sm border border-border bg-white px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--steel)]" />
                </div>
                <div className="md:col-span-2">
                  <Label>Additional notes</Label>
                  <textarea
                    name="notes"
                    rows={5}
                    placeholder={context.kind === "service"
                      ? "Site count, existing setup, coverage area, integration needs, deadlines…"
                      : "Any spec changes, accessories, warranty extensions, imaging or delivery preferences…"}
                    className="mt-2 w-full rounded-sm border border-border bg-white px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--steel)]"
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <p className="text-xs text-muted-foreground">Your submission is saved and delivered to Evertech via WhatsApp + email.</p>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-sm bg-[var(--navy-deep)] hover:bg-[var(--steel)] disabled:opacity-60 disabled:cursor-not-allowed px-7 py-3.5 text-sm font-semibold text-white transition"
                >
                  {submitting ? "Submitting…" : sent ? <><CheckCircle2 className="h-4 w-4" /> Sent</> : <><Send className="h-4 w-4" /> Submit Quotation Request</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function mapServiceReqType(slug: string): string {
  switch (slug) {
    case "cctv": return "CCTV / Surveillance";
    case "networking": return "Networking & Infrastructure";
    case "it-support": return "IT Support / AMC";
    case "corporate-supply": return "Corporate Bulk Procurement";
    default: return "Other";
  }
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-xs uppercase tracking-wider font-semibold text-[var(--navy-deep)]">{children}</label>;
}

function Field({ name, label, type = "text", required = false, defaultValue }: { name: string; label: string; type?: string; required?: boolean; defaultValue?: string }) {
  return (
    <div>
      <Label>{label}{required && <span className="text-[var(--steel)]"> *</span>}</Label>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        className="mt-2 w-full rounded-sm border border-border bg-white px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--steel)]"
      />
    </div>
  );
}