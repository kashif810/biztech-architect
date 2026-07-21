import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Search } from "lucide-react";

export const Route = createFileRoute("/accounting/customers")({ component: CustomersPage });

type C = { id: string; name: string; company: string; address: string; city: string; country: string; ntn: string; strn: string; email: string; phone: string; notes: string };

function empty(): Partial<C> { return { name: "", company: "", address: "", city: "", country: "Pakistan", ntn: "", strn: "", email: "", phone: "", notes: "" }; }

function CustomersPage() {
  const [rows, setRows] = useState<C[]>([]);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Partial<C> | null>(null);

  async function load() {
    const { data } = await (supabase as any).from("customers").select("*").order("company").order("name");
    setRows((data ?? []) as C[]);
  }
  useEffect(() => { load(); }, []);

  async function save() {
    if (!editing?.name?.trim()) return toast.error("Name required");
    const { id, ...rest } = editing;
    const res = id ? await (supabase as any).from("customers").update(rest).eq("id", id) : await (supabase as any).from("customers").insert(rest);
    if (res.error) return toast.error(res.error.message);
    toast.success("Saved"); setEditing(null); load();
  }
  async function del(id: string) {
    if (!confirm("Delete this customer?")) return;
    const { error } = await (supabase as any).from("customers").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  }

  const filtered = rows.filter((r) => !q || (r.name + r.company + r.email + r.phone).toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="p-8 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold">Customers</h1><p className="text-sm text-slate-500 mt-1">{rows.length} total</p></div>
        <button onClick={() => setEditing(empty())} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"><Plus className="h-4 w-4"/>New Customer</button>
      </div>

      <div className="mb-4 relative max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search customers…" className="w-full pl-10 pr-4 py-2.5 rounded-md border border-slate-300 text-sm focus:outline-none focus:border-blue-500" />
      </div>

      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
            <tr><th className="p-3">Company / Name</th><th className="p-3">Contact</th><th className="p-3">Tax IDs</th><th className="p-3 w-32"></th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((r) => (
              <tr key={r.id}>
                <td className="p-3"><div className="font-semibold">{r.company || r.name}</div>{r.company && <div className="text-xs text-slate-500">{r.name}</div>}</td>
                <td className="p-3 text-xs">{r.phone && <div>{r.phone}</div>}{r.email && <div className="text-slate-500">{r.email}</div>}</td>
                <td className="p-3 text-xs">{r.ntn && <div>NTN {r.ntn}</div>}{r.strn && <div className="text-slate-500">STRN {r.strn}</div>}</td>
                <td className="p-3 text-right">
                  <button onClick={() => setEditing(r)} className="p-2 text-slate-500 hover:text-blue-600"><Pencil className="h-4 w-4"/></button>
                  <button onClick={() => del(r.id)} className="p-2 text-slate-500 hover:text-red-600"><Trash2 className="h-4 w-4"/></button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-slate-400">No customers</td></tr>}
          </tbody>
        </table>
      </div>

      {editing && (
        <Modal onClose={() => setEditing(null)} title={editing.id ? "Edit Customer" : "New Customer"}>
          <div className="grid grid-cols-2 gap-4">
            <Fld label="Name *" value={editing.name || ""} onChange={(v) => setEditing({ ...editing, name: v })} />
            <Fld label="Company" value={editing.company || ""} onChange={(v) => setEditing({ ...editing, company: v })} />
            <Fld label="Email" value={editing.email || ""} onChange={(v) => setEditing({ ...editing, email: v })} />
            <Fld label="Phone" value={editing.phone || ""} onChange={(v) => setEditing({ ...editing, phone: v })} />
            <Fld label="Address" value={editing.address || ""} onChange={(v) => setEditing({ ...editing, address: v })} className="col-span-2" />
            <Fld label="City" value={editing.city || ""} onChange={(v) => setEditing({ ...editing, city: v })} />
            <Fld label="Country" value={editing.country || ""} onChange={(v) => setEditing({ ...editing, country: v })} />
            <Fld label="NTN" value={editing.ntn || ""} onChange={(v) => setEditing({ ...editing, ntn: v })} />
            <Fld label="STRN" value={editing.strn || ""} onChange={(v) => setEditing({ ...editing, strn: v })} />
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

export function Fld({ label, value, onChange, type = "text", className = "" }: { label: string; value: string | number; onChange: (v: string) => void; type?: string; className?: string }) {
  return (
    <div className={className}>
      <label className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-md border border-slate-300 text-sm focus:outline-none focus:border-blue-500" />
    </div>
  );
}

export function Modal({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold">{title}</h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700"><X className="h-5 w-5"/></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}