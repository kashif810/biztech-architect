import { supabase } from "@/integrations/supabase/client";

export type Item = {
  id?: string;
  description: string;
  detail: string;
  quantity: number;
  unit_price: number;
  amount: number;
  sort_order: number;
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

export function computeTotals(items: Item[], taxRate: number) {
  const subtotal = items.reduce((s, it) => s + Number(it.amount || 0), 0);
  const tax_amount = +(subtotal * (Number(taxRate) || 0) / 100).toFixed(2);
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