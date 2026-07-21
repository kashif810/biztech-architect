import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, FileText, Printer, ArrowRight, Eye, X } from "lucide-react";
import { Fld, Modal } from "./accounting.customers";
import { computeTotals, emptyCustomer, fmtDate, fmtMoney, nextDocNumber, type Item, type CustomerSnapshot } from "@/lib/accounting";
import { QuotationPrint } from "@/components/accounting/DocumentPrint";

export const Route = createFileRoute("/accounting/quotations")({ component: QuotationsPage });

type Q = { id: string; number: string; date: string; valid_until: string | null; status: string; subtotal: number; tax_rate: number; tax_amount: number; total: number; notes: string; terms: string; customer_id: string | null; customer_snapshot: CustomerSnapshot };

function QuotationsPage() {
  const [rows, setRows] = useState<Q[]>([]);
  const [editing, setEditing] = useState<"new" | Q | null>(null);
  const [viewing, setViewing] = useState<Q | null>(null);

  async function load() {
    const { data } = await (supabase as any).from("quotations").select("*").order("created_at", { ascending: false });
    setRows((data ?? []) as Q[]);
  }
  useEffect(() => { load(); }, []);

  async function del(id: string) {
    if (!confirm("Delete quotation?")) return;
    const { error } = await (supabase as any).from("quotations").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  }

  async function convertToInvoice(q: Q) {
    if (!confirm(`Convert ${q.number} to an invoice?`)) return;
    const { data: items } = await (supabase as any).from("quotation_items").select("*").eq("quotation_id", q.id).order("sort_order");
    const number = await nextDocNumber("invoice");
    const today = new Date().toISOString().slice(0, 10);
    const { data: settings } = await (supabase as any).from("accounting_settings").select("default_credit_days,default_tax_rate").eq("id", 1).single();
    const credit = Number(settings?.default_credit_days || 30);
    const due = new Date(); due.setDate(due.getDate() + credit);
    const { data: inv, error } = await (supabase as any).from("invoices").insert({
      number, customer_id: q.customer_id, customer_snapshot: q.customer_snapshot, quotation_id: q.id,
      date: today, due_date: due.toISOString().slice(0, 10), status: "unpaid",
      subtotal: q.subtotal, tax_rate: q.tax_rate, tax_amount: q.tax_amount, total: q.total, balance: q.total,
    }).select().single();
    if (error) return toast.error(error.message);
    if (items && items.length > 0) {
      await (supabase as any).from("invoice_items").insert(items.map((it: any) => ({
        invoice_id: inv.id, description: it.description, detail: it.detail, quantity: it.quantity, unit_price: it.unit_price, amount: it.amount, sort_order: it.sort_order
      })));
    }
    await (supabase as any).from("quotations").update({ status: "invoiced" }).eq("id", q.id);
    toast.success(`Invoice ${number} created`);
    load();
  }

  return (
    <div className="p-8 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold">Quotations</h1><p className="text-sm text-slate-500 mt-1">{rows.length} total</p></div>
        <button onClick={() => setEditing("new")} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-blue-600 text-white text-sm font-semibold"><Plus className="h-4 w-4"/>New Quotation</button>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
            <tr><th className="p-3">Number</th><th className="p-3">Customer</th><th className="p-3">Date</th><th className="p-3">Valid Until</th><th className="p-3 text-right">Total</th><th className="p-3">Status</th><th className="p-3 w-48"></th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="p-3 font-semibold">{r.number}</td>
                <td className="p-3">{r.customer_snapshot?.company || r.customer_snapshot?.name || "-"}</td>
                <td className="p-3 text-xs">{fmtDate(r.date)}</td>
                <td className="p-3 text-xs">{r.valid_until ? fmtDate(r.valid_until) : "-"}</td>
                <td className="p-3 text-right font-semibold">{fmtMoney(Number(r.total))}</td>
                <td className="p-3"><span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded ${r.status === "invoiced" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{r.status}</span></td>
                <td className="p-3 text-right">
                  <button onClick={() => setViewing(r)} className="p-2 text-slate-500 hover:text-blue-600" title="View / Print"><Eye className="h-4 w-4"/></button>
                  {r.status !== "invoiced" && <button onClick={() => convertToInvoice(r)} className="p-2 text-slate-500 hover:text-emerald-600" title="Convert to Invoice"><ArrowRight className="h-4 w-4"/></button>}
                  <button onClick={() => del(r.id)} className="p-2 text-slate-500 hover:text-red-600"><Trash2 className="h-4 w-4"/></button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-slate-400">No quotations yet</td></tr>}
          </tbody>
        </table>
      </div>

      {editing && <QuoteEditor onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
      {viewing && <PrintModal doc={viewing} kind="quotation" onClose={() => setViewing(null)} />}
    </div>
  );
}

function QuoteEditor({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [customers, setCustomers] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [customerId, setCustomerId] = useState<string>("");
  const [snap, setSnap] = useState<CustomerSnapshot>(emptyCustomer());
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [validUntil, setValidUntil] = useState<string>(() => { const d = new Date(); d.setDate(d.getDate() + 7); return d.toISOString().slice(0, 10); });
  const [taxRate, setTaxRate] = useState(0);
  const [notes, setNotes] = useState("");
  const [terms, setTerms] = useState("");
  const [items, setItems] = useState<Item[]>([{ description: "", detail: "", quantity: 1, unit_price: 0, amount: 0, sort_order: 0 }]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const [c, s] = await Promise.all([
        (supabase as any).from("customers").select("*").order("company").order("name"),
        (supabase as any).from("accounting_settings").select("*").eq("id", 1).single(),
      ]);
      setCustomers(c.data ?? []);
      setSettings(s.data);
      if (s.data) { setTerms(s.data.quotation_terms); }
    })();
  }, []);

  useEffect(() => {
    if (!customerId) return;
    const c = customers.find((x) => x.id === customerId);
    if (c) setSnap({ name: c.name, company: c.company, address: c.address, city: c.city, country: c.country, ntn: c.ntn, strn: c.strn, email: c.email, phone: c.phone });
  }, [customerId, customers]);

  const totals = useMemo(() => computeTotals(items, taxRate), [items, taxRate]);

  function updItem(i: number, patch: Partial<Item>) {
    setItems((prev) => prev.map((it, idx) => {
      if (idx !== i) return it;
      const next = { ...it, ...patch };
      next.amount = +(Number(next.quantity || 0) * Number(next.unit_price || 0)).toFixed(2);
      return next;
    }));
  }

  async function save() {
    if (!snap.name && !snap.company) return toast.error("Add customer info");
    if (items.length === 0 || items.every((i) => !i.description)) return toast.error("Add at least one item");
    setSaving(true);
    try {
      const number = await nextDocNumber("quotation");
      const { data: q, error } = await (supabase as any).from("quotations").insert({
        number, customer_id: customerId || null, customer_snapshot: snap, date, valid_until: validUntil,
        subtotal: totals.subtotal, tax_rate: taxRate, tax_amount: totals.tax_amount, total: totals.total, notes, terms,
      }).select().single();
      if (error) throw error;
      const cleanItems = items.filter((it) => it.description.trim()).map((it, idx) => ({ quotation_id: q.id, description: it.description, detail: it.detail, quantity: it.quantity, unit_price: it.unit_price, amount: it.amount, sort_order: idx }));
      if (cleanItems.length) await (supabase as any).from("quotation_items").insert(cleanItems);
      toast.success(`Quotation ${number} saved`);
      onSaved();
    } catch (e: any) { toast.error(e.message); }
    finally { setSaving(false); }
  }

  return (
    <Modal title="New Quotation" onClose={onClose}>
      <ItemForm
        customers={customers} customerId={customerId} setCustomerId={setCustomerId}
        snap={snap} setSnap={setSnap} date={date} setDate={setDate}
        secondDateLabel="Valid Until" secondDate={validUntil} setSecondDate={setValidUntil}
        taxRate={taxRate} setTaxRate={setTaxRate} items={items} setItems={setItems} updItem={updItem}
        totals={totals} notes={notes} setNotes={setNotes} terms={terms} setTerms={setTerms}
      />
      <div className="flex justify-end gap-2 mt-6">
        <button onClick={onClose} className="px-4 py-2 rounded-md border border-slate-300 text-sm">Cancel</button>
        <button onClick={save} disabled={saving} className="px-5 py-2 rounded-md bg-blue-600 text-white text-sm font-semibold disabled:opacity-60">{saving ? "Saving…" : "Save Quotation"}</button>
      </div>
    </Modal>
  );
}

// Shared editor form (also used by invoice editor)
export function ItemForm(p: {
  customers: any[]; customerId: string; setCustomerId: (v: string) => void;
  snap: CustomerSnapshot; setSnap: (v: CustomerSnapshot) => void;
  date: string; setDate: (v: string) => void;
  secondDateLabel: string; secondDate: string; setSecondDate: (v: string) => void;
  taxRate: number; setTaxRate: (v: number) => void;
  items: Item[]; setItems: (v: Item[]) => void; updItem: (i: number, patch: Partial<Item>) => void;
  totals: { subtotal: number; tax_amount: number; total: number };
  notes: string; setNotes: (v: string) => void;
  terms: string; setTerms: (v: string) => void;
  extra?: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-3">
          <label className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Customer</label>
          <select value={p.customerId} onChange={(e) => p.setCustomerId(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-md border border-slate-300 text-sm">
            <option value="">— Select or enter manually below —</option>
            {p.customers.map((c) => <option key={c.id} value={c.id}>{c.company || c.name} {c.company && c.name ? `(${c.name})` : ""}</option>)}
          </select>
        </div>
        <Fld label="Bill To Name" value={p.snap.name} onChange={(v) => p.setSnap({ ...p.snap, name: v })} />
        <Fld label="Company" value={p.snap.company} onChange={(v) => p.setSnap({ ...p.snap, company: v })} />
        <Fld label="Phone" value={p.snap.phone} onChange={(v) => p.setSnap({ ...p.snap, phone: v })} />
        <Fld label="Address" value={p.snap.address} onChange={(v) => p.setSnap({ ...p.snap, address: v })} className="col-span-2" />
        <Fld label="City" value={p.snap.city} onChange={(v) => p.setSnap({ ...p.snap, city: v })} />
        <Fld label="NTN" value={p.snap.ntn} onChange={(v) => p.setSnap({ ...p.snap, ntn: v })} />
        <Fld label="STRN" value={p.snap.strn} onChange={(v) => p.setSnap({ ...p.snap, strn: v })} />
        <Fld label="Country" value={p.snap.country} onChange={(v) => p.setSnap({ ...p.snap, country: v })} />
      </div>

      <div className="grid grid-cols-4 gap-4 pt-4 border-t border-slate-200">
        <Fld label="Date" type="date" value={p.date} onChange={p.setDate} />
        <Fld label={p.secondDateLabel} type="date" value={p.secondDate} onChange={p.setSecondDate} />
        <Fld label="Tax %" type="number" value={p.taxRate} onChange={(v) => p.setTaxRate(Number(v))} />
        {p.extra}
      </div>

      <div className="pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-semibold">Line Items</div>
          <button type="button" onClick={() => p.setItems([...p.items, { description: "", detail: "", quantity: 1, unit_price: 0, amount: 0, sort_order: p.items.length }])} className="text-xs text-blue-600 hover:underline flex items-center gap-1"><Plus className="h-3 w-3"/>Add row</button>
        </div>
        <div className="space-y-2">
          {p.items.map((it, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-start bg-slate-50 p-3 rounded">
              <div className="col-span-5">
                <input placeholder="Item name" value={it.description} onChange={(e) => p.updItem(i, { description: e.target.value })} className="w-full px-2 py-1.5 rounded border border-slate-300 text-sm" />
                <textarea placeholder="Specs / detail (optional)" value={it.detail} onChange={(e) => p.updItem(i, { detail: e.target.value })} rows={2} className="mt-1 w-full px-2 py-1.5 rounded border border-slate-300 text-xs" />
              </div>
              <input type="number" placeholder="Qty" value={it.quantity} onChange={(e) => p.updItem(i, { quantity: Number(e.target.value) })} className="col-span-2 px-2 py-1.5 rounded border border-slate-300 text-sm" />
              <input type="number" placeholder="Unit price" value={it.unit_price} onChange={(e) => p.updItem(i, { unit_price: Number(e.target.value) })} className="col-span-2 px-2 py-1.5 rounded border border-slate-300 text-sm" />
              <div className="col-span-2 text-right py-1.5 text-sm font-semibold">{fmtMoney(it.amount)}</div>
              <button type="button" onClick={() => p.setItems(p.items.filter((_, idx) => idx !== i))} className="col-span-1 text-slate-400 hover:text-red-600 flex justify-center py-1.5"><Trash2 className="h-4 w-4"/></button>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <div className="w-72 text-sm space-y-1">
            <div className="flex justify-between"><span>Subtotal</span><span className="font-semibold">{fmtMoney(p.totals.subtotal)}</span></div>
            <div className="flex justify-between"><span>Tax</span><span className="font-semibold">{fmtMoney(p.totals.tax_amount)}</span></div>
            <div className="flex justify-between pt-2 border-t border-slate-300"><span className="font-bold">Total</span><span className="font-bold">{fmtMoney(p.totals.total)}</span></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 pt-4 border-t border-slate-200">
        <div>
          <label className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Notes (customer-facing)</label>
          <textarea value={p.notes} onChange={(e) => p.setNotes(e.target.value)} rows={2} className="mt-1 w-full px-3 py-2 rounded-md border border-slate-300 text-sm" />
        </div>
        <div>
          <label className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Terms / Footer</label>
          <textarea value={p.terms} onChange={(e) => p.setTerms(e.target.value)} rows={5} className="mt-1 w-full px-3 py-2 rounded-md border border-slate-300 text-sm font-mono text-[11px]" />
        </div>
      </div>
    </div>
  );
}

export function PrintModal({ doc, kind, onClose }: { doc: any; kind: "quotation" | "invoice"; onClose: () => void }) {
  const [items, setItems] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const table = kind === "quotation" ? "quotation_items" : "invoice_items";
      const fk = kind === "quotation" ? "quotation_id" : "invoice_id";
      const [it, s] = await Promise.all([
        (supabase as any).from(table).select("*").eq(fk, doc.id).order("sort_order"),
        (supabase as any).from("accounting_settings").select("*").eq("id", 1).single(),
      ]);
      setItems(it.data ?? []);
      setSettings(s.data);
    })();
  }, [doc.id, kind]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-800/80 overflow-y-auto" onClick={onClose}>
      <div className="min-h-screen py-8" onClick={(e) => e.stopPropagation()}>
        <div className="max-w-[860px] mx-auto mb-4 flex items-center justify-between px-4">
          <div className="text-white font-semibold">{doc.number}</div>
          <div className="flex gap-2">
            <button onClick={() => window.print()} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-semibold"><Printer className="h-4 w-4"/>Print / Save PDF</button>
            <button onClick={onClose} className="p-2 rounded-md bg-white/10 text-white"><X className="h-4 w-4"/></button>
          </div>
        </div>
        {settings && (
          <div className="print-area">
            {kind === "quotation"
              ? <QuotationPrint doc={doc} items={items} settings={settings} />
              : <InvoicePrintWrapped doc={doc} items={items} settings={settings} />}
          </div>
        )}
      </div>
    </div>
  );
}

function InvoicePrintWrapped({ doc, items, settings }: any) {
  const { InvoicePrint } = require("@/components/accounting/DocumentPrint");
  return <InvoicePrint doc={doc} items={items} settings={settings} />;
}