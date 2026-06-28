import { useState } from "react";
import { Mail, MessageCircle, MapPin, Phone, Send, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const reqTypes = ["IT Hardware Supply", "Networking & Infrastructure", "CCTV / Surveillance", "IT Support / AMC", "Corporate Bulk Procurement", "Other"];

const PHONE = "+923218446447"; // update if number differs
const EMAIL = "info@evertech.com.pk";

export function Contact() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") ?? "").trim().slice(0, 100),
      company: String(form.get("company") ?? "").trim().slice(0, 150),
      email: String(form.get("email") ?? "").trim().slice(0, 255),
      phone: String(form.get("phone") ?? "").trim().slice(0, 40),
      req_type: String(form.get("reqType") ?? "").trim().slice(0, 80),
      product: String(form.get("product") ?? "").trim().slice(0, 300),
      qty: String(form.get("qty") ?? "").trim().slice(0, 40) || null,
      message: String(form.get("message") ?? "").trim().slice(0, 2000),
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
      `Name: ${payload.name}`,
      `Company: ${payload.company}`,
      `Email: ${payload.email}`,
      `Phone: ${payload.phone}`,
      `Requirement Type: ${payload.req_type}`,
      `Product / Service: ${payload.product}`,
      `Quantity: ${payload.qty ?? "-"}`,
      ``,
      `Message:`,
      `${payload.message}`,
    ].join("\n");

    const subject = `RFQ from ${payload.company} — ${payload.req_type}`;
    const waUrl = `https://wa.me/${PHONE.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(lines)}`;
    const mailUrl = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines)}`;

    // Save lead first, then hand the message off to WhatsApp and email.
    window.open(waUrl, "_blank", "noopener,noreferrer");
    window.location.href = mailUrl;

    toast.success("Request saved. WhatsApp and email opened for delivery.");
    setSent(true);
    (e.currentTarget as HTMLFormElement).reset();
  }

  return (
    <section id="contact" className="bg-white py-24 md:py-32">
      <div className="container-x grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <span className="eyebrow"><span className="h-px w-8 bg-[var(--steel)]" /> Request a Quotation</span>
          <h2 className="mt-5 text-3xl md:text-5xl font-bold text-[var(--navy-deep)] leading-tight">
            Tell us what you need. We'll respond with a tailored proposal.
          </h2>
          <p className="mt-5 text-muted-foreground max-w-md">
            Procurement, deployment, AMC — share your requirement and our team will get back within one business day.
          </p>

          <div className="mt-10 space-y-4">
            <a href={`mailto:${EMAIL}`} className="flex items-start gap-4 rounded-sm border border-border p-5 hover:border-[var(--steel)] transition">
              <div className="h-10 w-10 rounded-sm bg-[var(--navy-deep)] text-white flex items-center justify-center"><Mail className="h-4 w-4" /></div>
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Email</div>
                <div className="font-semibold text-[var(--navy-deep)]">{EMAIL}</div>
              </div>
            </a>
            <a href={`https://wa.me/${PHONE.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer" className="flex items-start gap-4 rounded-sm border border-border p-5 hover:border-[var(--steel)] transition">
              <div className="h-10 w-10 rounded-sm bg-[var(--navy-deep)] text-white flex items-center justify-center"><MessageCircle className="h-4 w-4" /></div>
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">WhatsApp / Phone</div>
                <div className="font-semibold text-[var(--navy-deep)]">{PHONE}</div>
              </div>
            </a>
            <div className="flex items-start gap-4 rounded-sm border border-border p-5">
              <div className="h-10 w-10 rounded-sm bg-[var(--navy-deep)] text-white flex items-center justify-center"><MapPin className="h-4 w-4" /></div>
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Headquarters</div>
                <div className="font-semibold text-[var(--navy-deep)]">Lahore, Pakistan</div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="rounded-sm border border-border bg-[var(--surface)] p-6 md:p-10"
          >
            <div className="grid md:grid-cols-2 gap-5">
              <Field name="name" label="Full Name" required />
              <Field name="company" label="Company Name" required />
              <Field name="email" label="Work Email" type="email" required />
              <Field name="phone" label="Phone / WhatsApp" required />
              <div className="md:col-span-1">
                <Label>Requirement Type</Label>
                <select name="reqType" required className="mt-2 w-full rounded-sm border border-border bg-white px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--steel)]">
                  {reqTypes.map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>
              <Field name="qty" label="Quantity (approx.)" />
              <div className="md:col-span-2">
                <Field name="product" label="Product / Service Needed" required />
              </div>
              <div className="md:col-span-2">
                <Label>Message</Label>
                <textarea
                  name="message"
                  rows={5}
                  required
                  placeholder="Share specifications, deadlines, deployment site, or any context that helps us quote accurately."
                  className="mt-2 w-full rounded-sm border border-border bg-white px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--steel)]"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-xs text-muted-foreground">By submitting you consent to be contacted by Evertech regarding your inquiry.</p>
              <button type="submit" disabled={submitting} className="inline-flex items-center justify-center gap-2 rounded-sm bg-[var(--navy-deep)] hover:bg-[var(--steel)] disabled:opacity-60 disabled:cursor-not-allowed px-7 py-3.5 text-sm font-semibold text-white transition">
                {submitting ? <>Submitting…</> : sent ? <><CheckCircle2 className="h-4 w-4"/> Sent — check WhatsApp</> : <><Send className="h-4 w-4" /> Submit Request</>}
              </button>
            </div>
          </form>

          <div className="mt-4 flex flex-wrap gap-3">
            <a href={`https://wa.me/${PHONE.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-sm border border-border bg-white px-5 py-3 text-sm font-semibold text-[var(--navy-deep)] hover:border-[var(--steel)]">
              <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
            </a>
            <a href={`mailto:${EMAIL}`} className="inline-flex items-center gap-2 rounded-sm border border-border bg-white px-5 py-3 text-sm font-semibold text-[var(--navy-deep)] hover:border-[var(--steel)]">
              <Mail className="h-4 w-4" /> Email Us
            </a>
            <a href={`tel:${PHONE}`} className="inline-flex items-center gap-2 rounded-sm border border-border bg-white px-5 py-3 text-sm font-semibold text-[var(--navy-deep)] hover:border-[var(--steel)]">
              <Phone className="h-4 w-4" /> Call
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-xs uppercase tracking-wider font-semibold text-[var(--navy-deep)]">{children}</label>;
}

function Field({ name, label, type = "text", required = false }: { name: string; label: string; type?: string; required?: boolean }) {
  return (
    <div>
      <Label>{label}{required && <span className="text-[var(--steel)]"> *</span>}</Label>
      <input
        name={name}
        type={type}
        required={required}
        className="mt-2 w-full rounded-sm border border-border bg-white px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--steel)]"
      />
    </div>
  );
}