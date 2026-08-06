import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { fmtDate, fmtMoney } from "@/lib/accounting";
import { Fld, Modal } from "./accounting.customers";

export const Route = createFileRoute("/accounting/expenses")({ component: ExpensesPage });

type E = { id: string; date: string; category: string; vendor: string; description: string; amount: number; tax_amount: number; method: string; reference_no: string; notes: string };

export const EXPENSE_CATEGORIES = [
  "Office Supplies",
  "Pantry / Tea",
  "Utilities",
  "Rent",
  "Salaries",
  "Transport / Fuel",
  "IT Hardware & Spares",
  "Repairs & Maintenance",
  "Marketing",
  "Bank Charges",
  "Other",
];

function empty(): Partial<E> {
  return { date: new Date().toISOString().slice(0, 10), category: "Office Supplies", vendor: "", description: "", amount: 0, tax_amount: 0, method: "cash", reference_no: "", notes: "" };
}

function ExpensesPage() {
  const [rows, setRows] = useState<E[]>([]);
  const [editing, setEditing] = useState<Partial<E> | null>(null);
  const [cat, setCat] = useState<string>("all");

  async function load() {
    const { data } = await (supabase as any).from("expenses").select("*").order("date", { ascending: false });
    setRows((data ?? []) as E[]);
  }
  useEffect(() => { load(); }, []);

  async function save() {
    if (!editing) return;
    const payload = {
      date: editing.date, category: editing.category, vendor: editing.vendor ?? "", description: editing.description ?? "",
      amount: Number(editing.amount) || 0, tax_amount: Number(editing.tax_amount) || 0,
      method: editing.method ?? "cash", reference_no: editing.reference_no ?? "", notes: editing.notes ?? "",
    };
    const res = editing.id
      ? await (supabase as any).from("expenses").update(payload).eq("id", editing.id)
      : await (supabase as any).from("expenses").insert(payload);
    if (res.error) return toast.error(res.error.message);
    toast.success("Saved"); setEditing(null); load();
  }
  async function del(id: string) {
    if (!confirm("Delete this expense?")) return;
    const { error } = await (supabase as any).from("expenses").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  }

  const filtered = useMemo(() => rows.filter((r) => cat === "all" || r.category === cat), [rows, cat]);
  const byCat = useMemo(() => {
    const m = new Map<string, { count: number; total: number }>();
    rows.forEach((r) => {
      const k = r.category || "Other";
      const cur = m.get(k) ?? { count: 0, total: 0 };
      m.set(k, { count: cur.count + 1, total: cur.total + Number(r.amount || 0) + Number(r.tax_amount || 0) });
    });
    return [...m.entries()].sort((a, b) => b[1].total - a[1].total);
  }, [rows]);
  const grand = filtered.reduce((s, r) => s + Number(r.amount || 0) + Number(r.tax_amount || 0), 0);

  return (
    <div className="p-8 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Expenses</h1>
          <p className="text-sm text-slate-500 mt-1">Office, pantry, hardware spares and other running costs</p>
        </div>
        <button onClick={() => setEditing(empty())} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"><Plus className="h-4 w-4" />New Expense</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {byCat.slice(0, 8).map(([k, v]) => (
          <button key={k} onClick={() => setCat(cat === k ? "all" : k)} className={`text-left rounded-lg border p-4 ${cat === k ? "border-blue-500 bg-blue-50" : "border-slate-200 bg-white"}`}>
            <div className="text-xs uppercase tracking-wider text-slate-500">{k}</div>
            <div className="mt-1 font-bold">{fmtMoney(v.total)}</div>
            <div className="text-xs text-slate-500">{v.count} entries</div>
          </button>
        ))}
      </div>

      <div className="mb-4 flex items-center gap-3">
        <select value={cat} onChange={(e) => setCat(e.target.value)} className="px-3 py-2 rounded-md border border-slate-300 text-sm bg-white">
          <option value="all">All categories</option>
          {EXPENSE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <span className="text-sm text-slate-500">{filtered.length} entries · {fmtMoney(grand)} total</span>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
            <tr><th className="p-3">Date</th><th className="p-3">Category</th><th className="p-3">Vendor</th><th className="p-3">Description</th><th className="p-3">Method</th><th className="p-3 text-right">Amount</th><th className="p-3 text-right">Tax</th><th className="p-3 text-right">Total</th><th className="p-3 w-24"></th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((r) => (
              <tr key={r.id}>
                <td className="p-3 text-xs">{fmtDate(r.date)}</td>
                <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-slate-100 text-xs font-semibold">{r.category}</span></td>
                <td className="p-3">{r.vendor || "-"}</td>
                <td className="p-3 text-slate-600">{r.description || "-"}</td>
                <td className="p-3 text-xs uppercase tracking-wider">{r.method}</td>
                <td className="p-3 text-right">{fmtMoney(Number(r.amount))}</td>
                <td className="p-3 text-right text-slate-500">{fmtMoney(Number(r.tax_amount))}</td>
                <td className="p-3 text-right font-semibold">{fmtMoney(Number(r.amount) + Number(r.tax_amount))}</td>
                <td className="p-3 text-right">
                  <button onClick={() => setEditing(r)} className="p-2 text-slate-500 hover:text-blue-600"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => del(r.id)} className="p-2 text-slate-500 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={9} className="p-8 text-center text-slate-400">No expenses recorded yet</td></tr>}
          </tbody>
          {filtered.length > 0 && (
            <tfoot className="bg-slate-50 font-semibold"><tr><td className="p-3" colSpan={7}>Total</td><td className="p-3 text-right">{fmtMoney(grand)}</td><td /></tr></tfoot>
          )}
        </table>
      </div>

      {editing && (
        <Modal onClose={() => setEditing(null)} title={editing.id ? "Edit Expense" : "New Expense"}>
          <div className="grid grid-cols-2 gap-4">
            <Fld label="Date" type="date" value={editing.date || ""} onChange={(v) => setEditing({ ...editing, date: v })} />
            <div>
              <label className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Category</label>
              <select value={editing.category || ""} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className="mt-1 w-full px-3 py-2 rounded-md border border-slate-300 text-sm bg-white">
                {EXPENSE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <Fld label="Vendor / Shop" value={editing.vendor || ""} onChange={(v) => setEditing({ ...editing, vendor: v })} />
            <div>
              <label className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Paid By</label>
              <select value={editing.method || "cash"} onChange={(e) => setEditing({ ...editing, method: e.target.value })} className="mt-1 w-full px-3 py-2 rounded-md border border-slate-300 text-sm bg-white">
                {["cash", "cheque", "bank transfer", "card", "other"].map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <Fld label="Description" value={editing.description || ""} onChange={(v) => setEditing({ ...editing, description: v })} className="col-span-2" />
            <Fld label="Amount" type="number" value={editing.amount ?? 0} onChange={(v) => setEditing({ ...editing, amount: Number(v) })} />
            <Fld label="Tax (if any)" type="number" value={editing.tax_amount ?? 0} onChange={(v) => setEditing({ ...editing, tax_amount: Number(v) })} />
            <Fld label="Reference / Bill No." value={editing.reference_no || ""} onChange={(v) => setEditing({ ...editing, reference_no: v })} />
            <Fld label="Notes" value={editing.notes || ""} onChange={(v) => setEditing({ ...editing, notes: v })} />
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-md border border-slate-300 text-sm">Cancel</button>
            <button onClick={save} className="px-5 py-2 rounded-md bg-blue-600 text-white text-sm font-semibold">Save</button>
          </div>
        </Modal>
      )}
    </div>
  );
}