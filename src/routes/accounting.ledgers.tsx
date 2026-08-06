import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { fmtDate, fmtMoney } from "@/lib/accounting";
import { ChevronLeft, ChevronDown, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/accounting/ledgers")({ component: LedgersPage });

type Entry = { date: string; ref: string; type: string; debit: number; credit: number };

function LedgersPage() {
  const [tab, setTab] = useState<"customers" | "suppliers" | "expenses">("customers");
  const [open, setOpen] = useState<{ id: string; name: string } | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [data, setData] = useState<any>({ customers: [], suppliers: [], invoices: [], payments: [], bills: [], spays: [], items: [], expenses: [] });

  useEffect(() => {
    (async () => {
      const [customers, suppliers, invoices, payments, bills, spays, items, expenses] = await Promise.all([
        (supabase as any).from("customers").select("id,name,company"),
        (supabase as any).from("suppliers").select("id,name,company"),
        (supabase as any).from("invoices").select("id,number,date,total,paid_amount,balance,customer_id,customer_snapshot"),
        (supabase as any).from("payments").select("id,date,amount,method,reference_no,customer_id,invoice_id,invoices(number)"),
        (supabase as any).from("supplier_bills").select("id,number,date,total,paid_amount,balance,supplier_id,supplier_snapshot,due_date"),
        (supabase as any).from("supplier_payments").select("id,date,amount,method,reference_no,supplier_id,bill_id,supplier_bills(number)"),
        (supabase as any).from("invoice_items").select("invoice_id,description,quantity,unit_price,amount,sort_order"),
        (supabase as any).from("expenses").select("*").order("date", { ascending: false }),
      ]);
      setData({
        customers: customers.data ?? [], suppliers: suppliers.data ?? [],
        invoices: invoices.data ?? [], payments: payments.data ?? [],
        bills: bills.data ?? [], spays: spays.data ?? [],
        items: items.data ?? [], expenses: expenses.data ?? [],
      });
    })();
  }, []);

  const parties = useMemo(() => {
    if (tab === "customers") {
      return data.customers.map((c: any) => {
        const inv = data.invoices.filter((i: any) => i.customer_id === c.id);
        const billed = inv.reduce((s: number, i: any) => s + Number(i.total || 0), 0);
        const paid = data.payments.filter((p: any) => p.customer_id === c.id).reduce((s: number, p: any) => s + Number(p.amount || 0), 0);
        return { id: c.id, name: c.company || c.name, docs: inv.length, billed, paid, balance: billed - paid };
      });
    }
    return data.suppliers.map((s: any) => {
      const bl = data.bills.filter((b: any) => b.supplier_id === s.id);
      const billed = bl.reduce((a: number, b: any) => a + Number(b.total || 0), 0);
      const paid = data.spays.filter((p: any) => p.supplier_id === s.id).reduce((a: number, p: any) => a + Number(p.amount || 0), 0);
      return { id: s.id, name: s.company || s.name, docs: bl.length, billed, paid, balance: billed - paid };
    });
  }, [tab, data]);

  const entries: Entry[] = useMemo(() => {
    if (!open) return [];
    const rows: Entry[] =
      tab === "customers"
        ? [
            ...data.invoices.filter((i: any) => i.customer_id === open.id).map((i: any) => ({ date: i.date, ref: i.number, type: "Invoice", debit: Number(i.total || 0), credit: 0 })),
            ...data.payments.filter((p: any) => p.customer_id === open.id).map((p: any) => ({ date: p.date, ref: p.invoices?.number || p.reference_no || "-", type: `Payment (${p.method})`, debit: 0, credit: Number(p.amount || 0) })),
          ]
        : [
            ...data.bills.filter((b: any) => b.supplier_id === open.id).map((b: any) => ({ date: b.date, ref: b.number, type: "Bill", debit: Number(b.total || 0), credit: 0 })),
            ...data.spays.filter((p: any) => p.supplier_id === open.id).map((p: any) => ({ date: p.date, ref: p.supplier_bills?.number || p.reference_no || "-", type: `Payment (${p.method})`, debit: 0, credit: Number(p.amount || 0) })),
          ];
    return rows.sort((a, b) => a.date.localeCompare(b.date));
  }, [open, tab, data]);

  const totals = parties.reduce(
    (a: any, p: any) => ({ billed: a.billed + p.billed, paid: a.paid + p.paid, balance: a.balance + p.balance }),
    { billed: 0, paid: 0, balance: 0 },
  );

  if (open) {
    let running = 0;
    return (
      <div className="p-8 max-w-6xl">
        <button onClick={() => setOpen(null)} className="inline-flex items-center gap-1 text-sm text-blue-600 mb-4"><ChevronLeft className="h-4 w-4" /> Back to ledgers</button>
        <h1 className="text-2xl font-bold">{open.name}</h1>
        <p className="text-sm text-slate-500 mt-1">{tab === "customers" ? "Customer" : "Supplier"} ledger — every document and payment</p>
        <div className="mt-6 rounded-lg border border-slate-200 bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <tr><th className="p-3">Date</th><th className="p-3">Reference</th><th className="p-3">Type</th><th className="p-3 text-right">{tab === "customers" ? "Invoiced" : "Billed"}</th><th className="p-3 text-right">Paid</th><th className="p-3 text-right">Balance</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {entries.map((e, i) => {
                running += e.debit - e.credit;
                return (
                  <tr key={i}>
                    <td className="p-3 text-xs">{fmtDate(e.date)}</td>
                    <td className="p-3 font-semibold">{e.ref}</td>
                    <td className="p-3 text-xs uppercase tracking-wider text-slate-500">{e.type}</td>
                    <td className="p-3 text-right">{e.debit ? fmtMoney(e.debit) : "-"}</td>
                    <td className="p-3 text-right text-emerald-700">{e.credit ? fmtMoney(e.credit) : "-"}</td>
                    <td className="p-3 text-right font-semibold">{fmtMoney(running)}</td>
                  </tr>
                );
              })}
              {entries.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-slate-400">No activity yet</td></tr>}
            </tbody>
            {entries.length > 0 && (
              <tfoot className="bg-slate-50 font-semibold">
                <tr><td className="p-3" colSpan={5}>Closing balance {tab === "customers" ? "receivable" : "payable"}</td><td className="p-3 text-right">{fmtMoney(running)}</td></tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Ledgers</h1>
        <p className="text-sm text-slate-500 mt-1">Business done and outstanding balance per party</p>
      </div>
      <div className="inline-flex rounded-md border border-slate-300 bg-white overflow-hidden mb-6">
        {(["customers", "suppliers"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-semibold capitalize ${tab === t ? "bg-blue-600 text-white" : "text-slate-700"}`}>{t}</button>
        ))}
      </div>
      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
            <tr><th className="p-3">{tab === "customers" ? "Customer" : "Supplier"}</th><th className="p-3 text-center">Docs</th><th className="p-3 text-right">Total business</th><th className="p-3 text-right">Paid</th><th className="p-3 text-right">{tab === "customers" ? "Receivable" : "Payable"}</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {parties.map((p: any) => (
              <tr key={p.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => setOpen({ id: p.id, name: p.name })}>
                <td className="p-3 font-semibold text-blue-700">{p.name}</td>
                <td className="p-3 text-center">{p.docs}</td>
                <td className="p-3 text-right">{fmtMoney(p.billed)}</td>
                <td className="p-3 text-right text-emerald-700">{fmtMoney(p.paid)}</td>
                <td className={`p-3 text-right font-semibold ${p.balance > 0 ? "text-rose-700" : "text-slate-500"}`}>{fmtMoney(p.balance)}</td>
              </tr>
            ))}
            {parties.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-slate-400">Nothing here yet</td></tr>}
          </tbody>
          <tfoot className="bg-slate-50 font-semibold">
            <tr><td className="p-3">Total</td><td /><td className="p-3 text-right">{fmtMoney(totals.billed)}</td><td className="p-3 text-right">{fmtMoney(totals.paid)}</td><td className="p-3 text-right">{fmtMoney(totals.balance)}</td></tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}