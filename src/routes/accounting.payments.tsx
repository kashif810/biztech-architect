import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { fmtDate, fmtMoney } from "@/lib/accounting";

export const Route = createFileRoute("/accounting/payments")({ component: PaymentsPage });

function PaymentsPage() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => {
    (async () => {
      const { data } = await (supabase as any).from("payments").select("*, invoices(number, customer_snapshot)").order("date", { ascending: false });
      setRows(data ?? []);
    })();
  }, []);
  const total = rows.reduce((s, r) => s + Number(r.amount || 0), 0);
  return (
    <div className="p-8 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Payments Received</h1>
        <p className="text-sm text-slate-500 mt-1">{rows.length} payments · {fmtMoney(total)} collected</p>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
            <tr><th className="p-3">Date</th><th className="p-3">Invoice</th><th className="p-3">Customer</th><th className="p-3">Method</th><th className="p-3">Reference</th><th className="p-3">Bank</th><th className="p-3 text-right">Amount</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="p-3 text-xs">{fmtDate(r.date)}</td>
                <td className="p-3 font-semibold">{r.invoices?.number || "-"}</td>
                <td className="p-3">{r.invoices?.customer_snapshot?.company || r.invoices?.customer_snapshot?.name || "-"}</td>
                <td className="p-3 text-xs uppercase tracking-wider">{r.method}</td>
                <td className="p-3">{r.reference_no}</td>
                <td className="p-3 text-xs">{r.bank_name}</td>
                <td className="p-3 text-right font-semibold text-emerald-700">{fmtMoney(Number(r.amount))}</td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-slate-400">No payments recorded yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}