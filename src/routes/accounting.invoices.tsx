import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, Eye, Wallet } from "lucide-react";
import { Fld, Modal } from "./accounting.customers";
import { ItemForm, PrintModal } from "./accounting.quotations";
import { computeTotals, emptyCustomer, fmtDate, fmtMoney, nextDocNumber, addDays, type Item, type CustomerSnapshot } from "@/lib/accounting";

export const Route = createFileRoute("/accounting/invoices")({ component: InvoicesPage });

type Inv = { id: string; number: string; date: string; due_date: string | null; po_number: string; status: string; subtotal: number; tax_rate: number; tax_amount: number; total: number; paid_amount: number; balance: number; notes: string; terms: string; customer_id: string | null; customer_snapshot: CustomerSnapshot; quotation_id: string | null };

function InvoicesPage() {
  const [rows, setRows] = useState<Inv[]>([]);
  const [editing, setEditing] = useState<"new" | null>(null);
  const [viewing, setViewing] = useState<Inv | null>(null);
  const [paying, setPaying] = useState<Inv | null>(null);

  async function load() {
    const { data } = await (supabase as any).from("invoices").select("*").order("created_at", { ascending: false });
    setRows((data ?? []) as Inv[]);
  }
  useEffect(() => { load(); }, []);

  async function del(id: string) {
    if (!confirm("Delete invoice?")) return;
    const { error } = await (supabase as any).from("invoices").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  }

  return (
    <div className="p-8 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold">Invoices</h1><p className="text-sm text-slate-500 mt-1">{rows.length} total</p></div>
        <button onClick={() => setEditing("new")} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-blue-600 text-white text-sm font-semibold"><Plus className="h-4 w-4"/>New Invoice</button>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
            <tr><th className="p-3">Invoice #</th><th className="p-3">Customer</th><th className="p-3">Date</th><th className="p-3">Due</th><th className="p-3 text-right">Total</th><th className="p-3 text-right">Paid</th><th className="p-3 text-right">Balance</th><th className="p-3">Status</th><th className="p-3 w-40"></th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="p-3 font-semibold">{r.number}</td>
                <td className="p-3">{r.customer_snapshot?.company || r.customer_snapshot?.name || "-"}</td>
                <td className="p-3 text-xs">{fmtDate(r.date)}</td>
                <td className="p-3 text-xs">{r.due_date ? fmtDate(r.due_date) : "-"}</td>
                <td className="p-3 text-right font-semibold">{fmtMoney(Number(r.total))}</td>
                <td className="p-3 text-right text-emerald-700">{fmtMoney(Number(r.paid_amount))}</td>
                <td className="p-3 text-right font-semibold">{fmtMoney(Number(r.balance))}</td>
                <td className="p-3"><StatusPill s={r.status} /></td>
                <td className="p-3 text-right">
                  <button onClick={() => setViewing(r)} className="p-2 text-slate-500 hover:text-blue-600" title="View / Print"><Eye className="h-4 w-4"/></button>
                  <button onClick={() => setPaying(r)} className="p-2 text-slate-500 hover:text-emerald-600" title="Record Payment"><Wallet className="h-4 w-4"/></button>
                  <button onClick={() => del(r.id)} className="p-2 text-slate-500 hover:text-red-600"><Trash2 className="h-4 w-4"/></button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={9} className="p-8 text-center text-slate-400">No invoices yet</td></tr>}
          </tbody>
        </table>
      </div>

      {editing && <InvoiceEditor onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
      {viewing && <PrintModal doc={viewing} kind="invoice" onClose={() => setViewing(null)} />}
      {paying && <PaymentModal invoice={paying} onClose={() => setPaying(null)} onSaved={() => { setPaying(null); load(); }} />}
    </div>
  );
}

function StatusPill({ s }: { s: string }) {
  const map: Record<string, string> = { paid: "bg-emerald-50 text-emerald-700", partial: "bg-amber-50 text-amber-700", unpaid: "bg-rose-50 text-rose-700", overdue: "bg-rose-100 text-rose-800" };
  return <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded ${map[s] || "bg-slate-100 text-slate-600"}`}>{s}</span>;
}

function InvoiceEditor({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [customers, setCustomers] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [customerId, setCustomerId] = useState("");
  const [snap, setSnap] = useState<CustomerSnapshot>(emptyCustomer());
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [dueDate, setDueDate] = useState(() => addDays(new Date().toISOString().slice(0, 10), 30));
  const [poNumber, setPoNumber] = useState("");
  const [taxRate, setTaxRate] = useState(16);
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
      if (s.data) { setTaxRate(Number(s.data.default_tax_rate || 16)); setDueDate(addDays(new Date().toISOString().slice(0, 10), Number(s.data.default_credit_days || 30))); }
    })();
  }, []);

  useEffect(() => {
    if (!customerId) return;
    const c = customers.find((x) => x.id === customerId);
    if (c) setSnap({ name: c.name, company: c.company, address: c.address, city: c.city, country: c.country, ntn: c.ntn, strn: c.strn, email: c.email, phone: c.phone });
  }, [customerId, customers]);

  const totals = useMemo(() => computeTotals(items, taxRate), [items, taxRate]);
  function updItem(i: number, patch: Partial<Item>) {
    setItems((prev) => prev.map((it, idx) => { if (idx !== i) return it; const n = { ...it, ...patch }; n.amount = +(Number(n.quantity || 0) * Number(n.unit_price || 0)).toFixed(2); return n; }));
  }

  async function save() {
    if (!snap.name && !snap.company) return toast.error("Add customer info");
    if (items.every((i) => !i.description)) return toast.error("Add at least one item");
    setSaving(true);
    try {
      const number = await nextDocNumber("invoice");
      const { data: inv, error } = await (supabase as any).from("invoices").insert({
        number, customer_id: customerId || null, customer_snapshot: snap, date, due_date: dueDate, po_number: poNumber,
        subtotal: totals.subtotal, tax_rate: taxRate, tax_amount: totals.tax_amount, total: totals.total, balance: totals.total,
        notes, terms, status: "unpaid",
      }).select().single();
      if (error) throw error;
      const clean = items.filter((it) => it.description.trim()).map((it, idx) => ({ invoice_id: inv.id, description: it.description, detail: it.detail, quantity: it.quantity, unit_price: it.unit_price, amount: it.amount, sort_order: idx }));
      if (clean.length) await (supabase as any).from("invoice_items").insert(clean);
      toast.success(`Invoice ${number} saved`);
      onSaved();
    } catch (e: any) { toast.error(e.message); } finally { setSaving(false); }
  }

  return (
    <Modal title="New Invoice" onClose={onClose}>
      <ItemForm
        customers={customers} customerId={customerId} setCustomerId={setCustomerId}
        snap={snap} setSnap={setSnap}
        date={date} setDate={setDate}
        secondDateLabel="Due Date" secondDate={dueDate} setSecondDate={setDueDate}
        taxRate={taxRate} setTaxRate={setTaxRate}
        items={items} setItems={setItems} updItem={updItem}
        totals={totals} notes={notes} setNotes={setNotes} terms={terms} setTerms={setTerms}
        extra={<Fld label="P.O. Number" value={poNumber} onChange={setPoNumber} />}
      />
      <div className="flex justify-end gap-2 mt-6">
        <button onClick={onClose} className="px-4 py-2 rounded-md border border-slate-300 text-sm">Cancel</button>
        <button onClick={save} disabled={saving} className="px-5 py-2 rounded-md bg-blue-600 text-white text-sm font-semibold disabled:opacity-60">{saving ? "Saving…" : "Save Invoice"}</button>
      </div>
    </Modal>
  );
}

function PaymentModal({ invoice, onClose, onSaved }: { invoice: Inv; onClose: () => void; onSaved: () => void }) {
  const [amount, setAmount] = useState(Number(invoice.balance));
  const [method, setMethod] = useState("cheque");
  const [ref, setRef] = useState("");
  const [bank, setBank] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");

  async function save() {
    if (amount <= 0) return toast.error("Amount must be > 0");
    const { error } = await (supabase as any).from("payments").insert({
      invoice_id: invoice.id, customer_id: invoice.customer_id, date, amount, method, reference_no: ref, bank_name: bank, notes,
    });
    if (error) return toast.error(error.message);
    const paid = Number(invoice.paid_amount) + amount;
    const bal = +(Number(invoice.total) - paid).toFixed(2);
    const status = bal <= 0 ? "paid" : "partial";
    await (supabase as any).from("invoices").update({ paid_amount: paid, balance: bal, status }).eq("id", invoice.id);
    toast.success("Payment recorded");
    onSaved();
  }

  return (
    <Modal title={`Record Payment · ${invoice.number}`} onClose={onClose}>
      <div className="mb-4 p-3 bg-slate-50 rounded text-sm">
        <div className="flex justify-between"><span>Total</span><span className="font-semibold">{fmtMoney(Number(invoice.total))}</span></div>
        <div className="flex justify-between"><span>Paid so far</span><span>{fmtMoney(Number(invoice.paid_amount))}</span></div>
        <div className="flex justify-between font-bold"><span>Outstanding</span><span>{fmtMoney(Number(invoice.balance))}</span></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Fld label="Amount" type="number" value={amount} onChange={(v) => setAmount(Number(v))} />
        <Fld label="Date" type="date" value={date} onChange={setDate} />
        <div>
          <label className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Method</label>
          <select value={method} onChange={(e) => setMethod(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-md border border-slate-300 text-sm">
            <option value="cheque">Cheque</option><option value="bank_transfer">Bank Transfer</option><option value="cash">Cash</option><option value="card">Card</option><option value="other">Other</option>
          </select>
        </div>
        <Fld label={method === "cheque" ? "Cheque No." : "Reference No."} value={ref} onChange={setRef} />
        <Fld label="Bank" value={bank} onChange={setBank} className="col-span-2" />
        <div className="col-span-2">
          <label className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Notes</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="mt-1 w-full px-3 py-2 rounded-md border border-slate-300 text-sm" />
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-6">
        <button onClick={onClose} className="px-4 py-2 rounded-md border border-slate-300 text-sm">Cancel</button>
        <button onClick={save} className="px-5 py-2 rounded-md bg-emerald-600 text-white text-sm font-semibold">Save Payment</button>
      </div>
    </Modal>
  );
}