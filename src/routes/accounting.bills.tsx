import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, Wallet } from "lucide-react";
import { Fld, Modal } from "./accounting.customers";
import { addDays, fmtDate, fmtMoney } from "@/lib/accounting";

export const Route = createFileRoute("/accounting/bills")({ component: BillsPage });

type Bill = { id: string; number: string; supplier_id: string | null; supplier_snapshot: any; related_invoice_id: string | null; date: string; credit_days: number; due_date: string | null; status: string; subtotal: number; tax_rate: number; tax_amount: number; total: number; paid_amount: number; balance: number; notes: string; items: any[] };

function BillsPage() {
  const [rows, setRows] = useState<Bill[]>([]);
  const [editing, setEditing] = useState<"new" | null>(null);
  const [paying, setPaying] = useState<Bill | null>(null);

  async function load() {
    const { data } = await (supabase as any).from("supplier_bills").select("*, invoices(number)").order("created_at", { ascending: false });
    setRows((data ?? []) as any);
  }
  useEffect(() => { load(); }, []);

  async function del(id: string) { if (!confirm("Delete bill?")) return; await (supabase as any).from("supplier_bills").delete().eq("id", id); load(); }

  const totalOwed = rows.reduce((s, r) => s + Number(r.balance || 0), 0);

  return (
    <div className="p-8 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold">Supplier Bills</h1><p className="text-sm text-slate-500 mt-1">{rows.length} bills · {fmtMoney(totalOwed)} outstanding</p></div>
        <button onClick={() => setEditing("new")} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-blue-600 text-white text-sm font-semibold"><Plus className="h-4 w-4"/>New Bill</button>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
            <tr><th className="p-3">Bill #</th><th className="p-3">Supplier</th><th className="p-3">Related Invoice</th><th className="p-3">Date</th><th className="p-3">Due</th><th className="p-3 text-right">Total</th><th className="p-3 text-right">Balance</th><th className="p-3">Status</th><th className="p-3 w-24"></th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((r: any) => (
              <tr key={r.id}>
                <td className="p-3 font-semibold">{r.number}</td>
                <td className="p-3">{r.supplier_snapshot?.company || r.supplier_snapshot?.name || "-"}</td>
                <td className="p-3 text-xs">{r.invoices?.number || "-"}</td>
                <td className="p-3 text-xs">{fmtDate(r.date)}</td>
                <td className="p-3 text-xs">{r.due_date ? fmtDate(r.due_date) : "-"}</td>
                <td className="p-3 text-right font-semibold">{fmtMoney(Number(r.total))}</td>
                <td className="p-3 text-right font-semibold text-rose-700">{fmtMoney(Number(r.balance))}</td>
                <td className="p-3"><span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded bg-slate-100 text-slate-600">{r.status}</span></td>
                <td className="p-3 text-right">
                  <button onClick={() => setPaying(r)} className="p-2 text-slate-500 hover:text-emerald-600"><Wallet className="h-4 w-4"/></button>
                  <button onClick={() => del(r.id)} className="p-2 text-slate-500 hover:text-red-600"><Trash2 className="h-4 w-4"/></button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={9} className="p-8 text-center text-slate-400">No supplier bills yet</td></tr>}
          </tbody>
        </table>
      </div>
      {editing && <BillEditor onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
      {paying && <SupPayModal bill={paying} onClose={() => setPaying(null)} onSaved={() => { setPaying(null); load(); }} />}
    </div>
  );
}

function BillEditor({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [supplierId, setSupplierId] = useState("");
  const [snap, setSnap] = useState({ name: "", company: "", phone: "", ntn: "" });
  const [relatedInvoiceId, setRelatedInvoiceId] = useState("");
  const [number, setNumber] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [creditDays, setCreditDays] = useState(30);
  const [items, setItems] = useState<any[]>([{ description: "", quantity: 1, unit_price: 0, amount: 0 }]);
  const [taxRate, setTaxRate] = useState(0);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    (async () => {
      const [s, i] = await Promise.all([
        (supabase as any).from("suppliers").select("*").order("company"),
        (supabase as any).from("invoices").select("id,number,customer_snapshot").order("created_at", { ascending: false }).limit(50),
      ]);
      setSuppliers(s.data ?? []); setInvoices(i.data ?? []);
    })();
  }, []);

  useEffect(() => {
    const sup = suppliers.find((x) => x.id === supplierId);
    if (sup) { setSnap({ name: sup.name, company: sup.company, phone: sup.phone, ntn: sup.ntn }); setCreditDays(sup.default_credit_days || 30); }
  }, [supplierId, suppliers]);

  const totals = useMemo(() => {
    const sub = items.reduce((s, it) => s + Number(it.amount || 0), 0);
    const tax = +(sub * (taxRate / 100)).toFixed(2);
    return { subtotal: +sub.toFixed(2), tax_amount: tax, total: +(sub + tax).toFixed(2) };
  }, [items, taxRate]);

  const due = useMemo(() => addDays(date, creditDays), [date, creditDays]);

  function upd(i: number, patch: any) {
    setItems((prev) => prev.map((it, idx) => { if (idx !== i) return it; const n = { ...it, ...patch }; n.amount = +(Number(n.quantity || 0) * Number(n.unit_price || 0)).toFixed(2); return n; }));
  }

  async function save() {
    if (!number.trim()) return toast.error("Bill number required");
    if (!snap.name && !snap.company) return toast.error("Supplier required");
    const { error } = await (supabase as any).from("supplier_bills").insert({
      number, supplier_id: supplierId || null, supplier_snapshot: snap, related_invoice_id: relatedInvoiceId || null,
      date, credit_days: creditDays, due_date: due, subtotal: totals.subtotal, tax_rate: taxRate,
      tax_amount: totals.tax_amount, total: totals.total, balance: totals.total, notes,
      items: items.filter((it) => it.description),
    });
    if (error) return toast.error(error.message);
    toast.success("Bill saved");
    onSaved();
  }

  return (
    <Modal title="New Supplier Bill" onClose={onClose}>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Supplier</label>
          <select value={supplierId} onChange={(e) => setSupplierId(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-md border border-slate-300 text-sm">
            <option value="">— Select —</option>
            {suppliers.map((s) => <option key={s.id} value={s.id}>{s.company || s.name}</option>)}
          </select>
        </div>
        <Fld label="Supplier Bill #" value={number} onChange={setNumber} />
        <div>
          <label className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Link to Invoice (optional)</label>
          <select value={relatedInvoiceId} onChange={(e) => setRelatedInvoiceId(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-md border border-slate-300 text-sm">
            <option value="">— None —</option>
            {invoices.map((i) => <option key={i.id} value={i.id}>{i.number} · {i.customer_snapshot?.company || i.customer_snapshot?.name}</option>)}
          </select>
        </div>
        <Fld label="Date" type="date" value={date} onChange={setDate} />
        <Fld label="Credit Days" type="number" value={creditDays} onChange={(v) => setCreditDays(Number(v))} />
        <Fld label="Tax %" type="number" value={taxRate} onChange={(v) => setTaxRate(Number(v))} />
        <div className="col-span-2 text-xs text-slate-500">Due: <span className="font-semibold text-slate-800">{fmtDate(due)}</span></div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-200">
        <div className="flex justify-between mb-2"><div className="text-sm font-semibold">Items</div><button onClick={() => setItems([...items, { description: "", quantity: 1, unit_price: 0, amount: 0 }])} className="text-xs text-blue-600"><Plus className="h-3 w-3 inline"/> Add row</button></div>
        <div className="space-y-2">
          {items.map((it, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 bg-slate-50 p-2 rounded items-center">
              <input placeholder="Description" value={it.description} onChange={(e) => upd(i, { description: e.target.value })} className="col-span-6 px-2 py-1.5 rounded border border-slate-300 text-sm" />
              <input type="number" placeholder="Qty" value={it.quantity} onChange={(e) => upd(i, { quantity: Number(e.target.value) })} className="col-span-2 px-2 py-1.5 rounded border border-slate-300 text-sm" />
              <input type="number" placeholder="Price" value={it.unit_price} onChange={(e) => upd(i, { unit_price: Number(e.target.value) })} className="col-span-2 px-2 py-1.5 rounded border border-slate-300 text-sm" />
              <div className="col-span-1 text-right text-sm font-semibold">{fmtMoney(it.amount)}</div>
              <button onClick={() => setItems(items.filter((_, x) => x !== i))} className="col-span-1 text-slate-400 hover:text-red-600 flex justify-center"><Trash2 className="h-4 w-4"/></button>
            </div>
          ))}
        </div>
        <div className="mt-3 flex justify-end text-sm">
          <div className="w-64 space-y-1">
            <div className="flex justify-between"><span>Subtotal</span><span>{fmtMoney(totals.subtotal)}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>{fmtMoney(totals.tax_amount)}</span></div>
            <div className="flex justify-between pt-2 border-t border-slate-300 font-bold"><span>Total</span><span>{fmtMoney(totals.total)}</span></div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <label className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Notes</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="mt-1 w-full px-3 py-2 rounded-md border border-slate-300 text-sm" />
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <button onClick={onClose} className="px-4 py-2 rounded-md border border-slate-300 text-sm">Cancel</button>
        <button onClick={save} className="px-5 py-2 rounded-md bg-blue-600 text-white text-sm font-semibold">Save Bill</button>
      </div>
    </Modal>
  );
}

function SupPayModal({ bill, onClose, onSaved }: { bill: Bill; onClose: () => void; onSaved: () => void }) {
  const [amount, setAmount] = useState(Number(bill.balance));
  const [method, setMethod] = useState("bank_transfer");
  const [ref, setRef] = useState("");
  const [bank, setBank] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  async function save() {
    const { error } = await (supabase as any).from("supplier_payments").insert({ bill_id: bill.id, supplier_id: bill.supplier_id, date, amount, method, reference_no: ref, bank_name: bank });
    if (error) return toast.error(error.message);
    const paid = Number(bill.paid_amount) + amount;
    const bal = +(Number(bill.total) - paid).toFixed(2);
    await (supabase as any).from("supplier_bills").update({ paid_amount: paid, balance: bal, status: bal <= 0 ? "paid" : "partial" }).eq("id", bill.id);
    toast.success("Payment recorded");
    onSaved();
  }

  return (
    <Modal title={`Pay Supplier · ${bill.number}`} onClose={onClose}>
      <div className="mb-4 p-3 bg-slate-50 rounded text-sm">
        <div className="flex justify-between"><span>Total</span><span>{fmtMoney(Number(bill.total))}</span></div>
        <div className="flex justify-between font-bold"><span>Balance</span><span>{fmtMoney(Number(bill.balance))}</span></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Fld label="Amount" type="number" value={amount} onChange={(v) => setAmount(Number(v))} />
        <Fld label="Date" type="date" value={date} onChange={setDate} />
        <div>
          <label className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Method</label>
          <select value={method} onChange={(e) => setMethod(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-md border border-slate-300 text-sm">
            <option value="bank_transfer">Bank Transfer</option><option value="cheque">Cheque</option><option value="cash">Cash</option><option value="other">Other</option>
          </select>
        </div>
        <Fld label={method === "cheque" ? "Cheque No." : "Reference"} value={ref} onChange={setRef} />
        <Fld label="Bank" value={bank} onChange={setBank} className="col-span-2" />
      </div>
      <div className="flex justify-end gap-2 mt-6">
        <button onClick={onClose} className="px-4 py-2 rounded-md border border-slate-300 text-sm">Cancel</button>
        <button onClick={save} className="px-5 py-2 rounded-md bg-emerald-600 text-white text-sm font-semibold">Save Payment</button>
      </div>
    </Modal>
  );
}