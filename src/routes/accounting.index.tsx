import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { fmtMoney } from "@/lib/accounting";
import { FileText, ClipboardList, Wallet, Receipt, TrendingUp, Users } from "lucide-react";

export const Route = createFileRoute("/accounting/")({
  component: DashboardPage,
});

function DashboardPage() {
  const [stats, setStats] = useState({
    invoicesTotal: 0, invoicesPaid: 0, invoicesBalance: 0, invoiceCount: 0,
    quoteCount: 0, customerCount: 0, supplierBalance: 0, billCount: 0,
  });
  const [recentInvoices, setRecentInvoices] = useState<any[]>([]);
  const [recentQuotes, setRecentQuotes] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const [inv, quo, cust, bills] = await Promise.all([
        (supabase as any).from("invoices").select("id,number,date,total,paid_amount,balance,customer_snapshot,status").order("created_at", { ascending: false }),
        (supabase as any).from("quotations").select("id,number,date,total,status,customer_snapshot").order("created_at", { ascending: false }).limit(5),
        (supabase as any).from("customers").select("id", { count: "exact", head: true }),
        (supabase as any).from("supplier_bills").select("id,balance"),
      ]);
      const invoices = inv.data ?? [];
      const supplierBills = bills.data ?? [];
      setStats({
        invoicesTotal: invoices.reduce((s: number, i: any) => s + Number(i.total || 0), 0),
        invoicesPaid: invoices.reduce((s: number, i: any) => s + Number(i.paid_amount || 0), 0),
        invoicesBalance: invoices.reduce((s: number, i: any) => s + Number(i.balance || 0), 0),
        invoiceCount: invoices.length,
        quoteCount: (quo.data ?? []).length,
        customerCount: cust.count ?? 0,
        supplierBalance: supplierBills.reduce((s: number, b: any) => s + Number(b.balance || 0), 0),
        billCount: supplierBills.length,
      });
      setRecentInvoices(invoices.slice(0, 5));
      setRecentQuotes(quo.data ?? []);
    })();
  }, []);

  return (
    <div className="p-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Overview of quotations, invoices and payments</p>
        </div>
        <div className="flex gap-3">
          <Link to="/accounting/quotations" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md border border-slate-300 bg-white text-sm font-semibold hover:border-blue-500">
            <ClipboardList className="h-4 w-4" /> New Quote
          </Link>
          <Link to="/accounting/invoices" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700">
            <FileText className="h-4 w-4" /> New Invoice
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Stat icon={<TrendingUp className="h-4 w-4" />} label="Invoiced (all)" value={fmtMoney(stats.invoicesTotal)} tone="blue" />
        <Stat icon={<Wallet className="h-4 w-4" />} label="Cash Collected" value={fmtMoney(stats.invoicesPaid)} tone="green" />
        <Stat icon={<FileText className="h-4 w-4" />} label="Outstanding" value={fmtMoney(stats.invoicesBalance)} tone="amber" />
        <Stat icon={<Receipt className="h-4 w-4" />} label="Owed to Suppliers" value={fmtMoney(stats.supplierBalance)} tone="red" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MiniStat label="Invoices" value={stats.invoiceCount} to="/accounting/invoices" />
        <MiniStat label="Quotations" value={stats.quoteCount} to="/accounting/quotations" />
        <MiniStat label="Customers" value={stats.customerCount} to="/accounting/customers" />
        <MiniStat label="Supplier Bills" value={stats.billCount} to="/accounting/bills" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Panel title="Recent Invoices" href="/accounting/invoices">
          {recentInvoices.length === 0 && <Empty>No invoices yet</Empty>}
          {recentInvoices.map((i) => (
            <Row key={i.id} left={i.number} sub={i.customer_snapshot?.company || i.customer_snapshot?.name || "-"} right={fmtMoney(Number(i.total))} tag={i.status} />
          ))}
        </Panel>
        <Panel title="Recent Quotations" href="/accounting/quotations">
          {recentQuotes.length === 0 && <Empty>No quotations yet</Empty>}
          {recentQuotes.map((q) => (
            <Row key={q.id} left={q.number} sub={q.customer_snapshot?.company || q.customer_snapshot?.name || "-"} right={fmtMoney(Number(q.total))} tag={q.status} />
          ))}
        </Panel>
      </div>
    </div>
  );
}

function Stat({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone: "blue" | "green" | "amber" | "red" }) {
  const tones = { blue: "bg-blue-50 text-blue-700", green: "bg-emerald-50 text-emerald-700", amber: "bg-amber-50 text-amber-700", red: "bg-rose-50 text-rose-700" };
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</span>
        <span className={`h-8 w-8 rounded flex items-center justify-center ${tones[tone]}`}>{icon}</span>
      </div>
      <div className="mt-3 text-2xl font-bold">{value}</div>
    </div>
  );
}

function MiniStat({ label, value, to }: { label: string; value: number; to: string }) {
  return (
    <Link to={to} className="rounded-lg border border-slate-200 bg-white p-4 hover:border-blue-500 transition">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-xl font-semibold mt-1">{value}</div>
    </Link>
  );
}

function Panel({ title, href, children }: { title: string; href: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        <h3 className="font-semibold">{title}</h3>
        <Link to={href} className="text-xs text-blue-600 hover:underline">View all →</Link>
      </div>
      <div className="divide-y divide-slate-100">{children}</div>
    </div>
  );
}

function Row({ left, sub, right, tag }: { left: string; sub: string; right: string; tag?: string }) {
  return (
    <div className="p-4 flex items-center justify-between">
      <div>
        <div className="text-sm font-semibold">{left}</div>
        <div className="text-xs text-slate-500">{sub}</div>
      </div>
      <div className="text-right">
        <div className="text-sm font-semibold">{right}</div>
        {tag && <div className="text-[10px] uppercase tracking-wider text-slate-500 mt-0.5">{tag}</div>}
      </div>
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <div className="p-8 text-center text-sm text-slate-400">{children}</div>;
}