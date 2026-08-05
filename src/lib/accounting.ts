import { supabase } from "@/integrations/supabase/client";

export type Item = {
  id?: string;
  description: string;
  detail: string;
  quantity: number;
  unit_price: number;
  amount: number;
  sort_order: number;
  /** Optional per-line tax rate; falls back to the document tax rate. */
  tax_rate?: number | null;
};

export type CustomerSnapshot = {
  name: string;
  company: string;
  address: string;
  city: string;
  country: string;
  ntn: string;
  strn: string;
  email: string;
  phone: string;
};

export function emptyCustomer(): CustomerSnapshot {
  return { name: "", company: "", address: "", city: "", country: "Pakistan", ntn: "", strn: "", email: "", phone: "" };
}

export function fmtMoney(n: number, currency = "PKR"): string {
  const v = Number.isFinite(n) ? n : 0;
  return `${currency === "PKR" ? "₨" : currency + " "}${v.toLocaleString("en-PK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function fmtDate(d: string | null | undefined): string {
  if (!d) return "-";
  const dt = new Date(d);
  return dt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export function itemTaxRate(it: Item, docRate: number): number {
  return it.tax_rate === null || it.tax_rate === undefined ? Number(docRate) || 0 : Number(it.tax_rate) || 0;
}

export function itemTax(it: Item, docRate: number): number {
  return +(Number(it.amount || 0) * itemTaxRate(it, docRate) / 100).toFixed(2);
}

export function computeTotals(items: Item[], taxRate: number) {
  const subtotal = items.reduce((s, it) => s + Number(it.amount || 0), 0);
  const tax_amount = +items.reduce((s, it) => s + itemTax(it, taxRate), 0).toFixed(2);
  const total = +(subtotal + tax_amount).toFixed(2);
  return { subtotal: +subtotal.toFixed(2), tax_amount, total };
}

export async function nextDocNumber(type: "quotation" | "invoice"): Promise<string> {
  const { data, error } = await (supabase as any).rpc("next_document_number", { doc_type: type });
  if (error) throw error;
  return data as string;
}

export function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export const TAX_PRESETS = [0, 5, 10, 16, 17, 18];

/** Pakistan tax authority naming: PRA services tax = 5%, GST = 10% / 16% / 17% / 18% */
export function taxName(rate: number): string {
  const r = Number(rate) || 0;
  if (r === 5) return "PRA";
  if (r > 0) return "GST";
  return "Tax";
}

export function taxLabel(rate: number): string {
  const r = Number(rate) || 0;
  return `${taxName(r)} ${r}%`;
}

export const TAX_OPTIONS = [
  { rate: 0, label: "No Tax (0%)" },
  { rate: 5, label: "PRA 5% — Software & Licensing" },
  { rate: 10, label: "GST 10% — Laptops" },
  { rate: 16, label: "GST 16% — Hardware" },
  { rate: 17, label: "GST 17%" },
  { rate: 18, label: "GST 18%" },
];

export function waLink(phone: string, text: string): string {
  const digits = (phone || "").replace(/[^\d]/g, "");
  const num = digits.startsWith("0") ? "92" + digits.slice(1) : digits;
  return `https://wa.me/${num}?text=${encodeURIComponent(text)}`;
}

export function docMessage(kind: "quotation" | "invoice", doc: any, items: any[], company = "EverTech Corporation"): string {
  const c = doc.customer_snapshot || {};
  const title = kind === "quotation" ? "Quotation" : "Sales Tax Invoice";
  const lines = items.map((it, i) => `${i + 1}. ${it.description} — ${it.quantity} x ${fmtMoney(Number(it.unit_price))} = ${fmtMoney(Number(it.amount))}`);
  return [
    `*${company}*`,
    `${title}: ${doc.number}`,
    `Date: ${fmtDate(doc.date)}`,
    c.company || c.name ? `For: ${c.company || c.name}` : "",
    "",
    ...lines,
    "",
    `Subtotal: ${fmtMoney(Number(doc.subtotal))}`,
    Number(doc.tax_rate) > 0 ? `${taxLabel(Number(doc.tax_rate))}: ${fmtMoney(Number(doc.tax_amount))}` : "",
    `*Grand Total: ${fmtMoney(Number(doc.total))}*`,
    kind === "invoice" && doc.due_date ? `Due Date: ${fmtDate(doc.due_date)}` : "",
  ].filter(Boolean).join("\n");
}