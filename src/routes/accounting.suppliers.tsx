import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Fld, Modal } from "./accounting.customers";

export const Route = createFileRoute("/accounting/suppliers")({ component: SuppliersPage });

type S = { id: string; name: string; company: string; address: string; city: string; country: string; ntn: string; strn: string; email: string; phone: string; default_credit_days: number; bank_details: string; notes: string };

function empty(): Partial<S> { return { name: "", company: "", address: "", city: "", country: "Pakistan", ntn: "", strn: "", email: "", phone: "", default_credit_days: 30, bank_details: "", notes: "" }; }

function SuppliersPage() {
  const [rows, setRows] = useState<S[]>([]);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Partial<S> | null>(null);

  async function load() {
    const { data } = await (supabase as any).from("suppliers").select("*").order("company").order("name");
    setRows((data ?? []) as S[]);
  }
  useEffect(() => { load(); }, []);

  async function save() {
    if (!editing?.name?.trim()) return toast.error("Name required");
    const { id, ...rest } = editing;
    (rest as any).default_credit_days = Number(rest.default_credit_days || 30);
    const res = id ? await (supabase as any).from("suppliers").update(rest).eq("id", id) : await (supabase as any).from("suppliers").insert(rest);
    if (res.error) return toast.error(res.error.message);
    toast.success("Saved"); setEditing(null); load();
  }
  async function del(id: string) {
    if (!confirm("Delete supplier?")) return;
    const { error } = await (supabase as any).from("suppliers").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  }

  const filtered = rows.filter((r) => !q || (r.name + r.company + r.email).toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="p-8 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold">Suppliers</h1><p className="text-sm text-slate-500 mt-1">{rows.length} total</p></div>
        <button onClick={() => setEditing(empty())} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-blue-600 text-white text-sm font-semibold"><Plus className="h-4 w-4"/>New Supplier</button>
      </div>

      <div className="mb-4 relative max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search suppliers…" className="w-full pl-10 pr-4 py-2.5 rounded-md border border-slate-300 text-sm focus:outline-none focus:border-blue-500" />
      </div>

      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
            <tr><th className="p-3">Company / Name</th><th className="p-3">Contact</th><th className="p-3">Credit Days</th><th className="p-3 w-32"></th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((r) => (
              <tr key={r.id}>
                <td className="p-3"><div className="font-semibold">{r.company || r.name}</div>{r.company && <div className="text-xs text-slate-500">{r.name}</div>}</td>
                <td className="p-3 text-xs">{r.phone && <div>{r.phone}</div>}{r.email && <div className="text-slate-500">{r.email}</div>}</td>
                <td className="p-3 text-sm">{r.default_credit_days} days</td>
                <td className="p-3 text-right">
                  <button onClick={() => setEditing(r)} className="p-2 text-slate-500 hover:text-blue-600"><Pencil className="h-4 w-4"/></button>
                  <button onClick={() => del(r.id)} className="p-2 text-slate-500 hover:text-red-600"><Trash2 className="h-4 w-4"/></button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-slate-400">No suppliers</td></tr>}
          </tbody>
        </table>
      </div>

      {editing && (
        <Modal onClose={() => setEditing(null)} title={editing.id ? "Edit Supplier" : "New Supplier"}>
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
            <Fld label="Default Credit Days" type="number" value={editing.default_credit_days ?? 30} onChange={(v) => setEditing({ ...editing, default_credit_days: Number(v) })} />
            <div className="col-span-2">
              <label className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Bank Details</label>
              <textarea value={editing.bank_details || ""} onChange={(e) => setEditing({ ...editing, bank_details: e.target.value })} rows={3} className="mt-1 w-full px-3 py-2 rounded-md border border-slate-300 text-sm" />
            </div>
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