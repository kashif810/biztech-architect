import { createFileRoute, Outlet, Link, useRouterState } from "@tanstack/react-router";
import { LayoutGrid, Users, Truck, FileText, ShoppingCart, Receipt, Wallet, Settings, ClipboardList } from "lucide-react";

export const Route = createFileRoute("/accounting")({
  head: () => ({ meta: [{ title: "Accounting — Evertech" }, { name: "robots", content: "noindex" }] }),
  component: AccountingLayout,
});

const NAV = [
  { to: "/accounting", label: "Dashboard", icon: LayoutGrid, exact: true },
  { to: "/accounting/customers", label: "Customers", icon: Users },
  { to: "/accounting/suppliers", label: "Suppliers", icon: Truck },
  { to: "/accounting/quotations", label: "Quotations", icon: ClipboardList },
  { to: "/accounting/invoices", label: "Invoices", icon: FileText },
  { to: "/accounting/payments", label: "Payments Received", icon: Wallet },
  { to: "/accounting/bills", label: "Supplier Bills", icon: Receipt },
  { to: "/accounting/settings", label: "Settings", icon: Settings },
];

function AccountingLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      <aside className="w-64 shrink-0 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-5 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded bg-[#0b1a3a] text-white flex items-center justify-center font-bold">ET</div>
            <div>
              <div className="font-bold text-sm">Evertech</div>
              <div className="text-[11px] text-slate-500">Accounting Suite</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map((n) => {
            const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
            const Icon = n.icon;
            return (
              <Link key={n.to} to={n.to} className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition ${active ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-slate-100"}`}>
                <Icon className="h-4 w-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-200 text-[11px] text-slate-500">
          No authentication · internal use only
        </div>
      </aside>
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}