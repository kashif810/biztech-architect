import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Fld } from "./accounting.customers";

export const Route = createFileRoute("/accounting/settings")({ component: SettingsPage });

function SettingsPage() {
  const [s, setS] = useState<any>(null);
  useEffect(() => { (async () => { const { data } = await (supabase as any).from("accounting_settings").select("*").eq("id", 1).single(); setS(data); })(); }, []);
  if (!s) return <div className="p-8">Loading…</div>;
  async function save() {
    const { id, updated_at, ...rest } = s;
    const { error } = await (supabase as any).from("accounting_settings").update(rest).eq("id", 1);
    if (error) return toast.error(error.message);
    toast.success("Settings saved");
  }
  const upd = (k: string) => (v: any) => setS({ ...s, [k]: v });
  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Company & Document Settings</h1>
      <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6">
        <div>
          <h3 className="font-semibold mb-3">Company Info</h3>
          <div className="grid grid-cols-2 gap-4">
            <Fld label="Company Name" value={s.company_name} onChange={upd("company_name")} />
            <Fld label="Phone" value={s.phone} onChange={upd("phone")} />
            <Fld label="Email" value={s.email} onChange={upd("email")} />
            <Fld label="Website" value={s.website} onChange={upd("website")} />
            <Fld label="NTN" value={s.ntn} onChange={upd("ntn")} />
            <Fld label="STRN" value={s.strn} onChange={upd("strn")} />
            <div className="col-span-2">
              <label className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Address</label>
              <textarea value={s.address} onChange={(e) => upd("address")(e.target.value)} rows={2} className="mt-1 w-full px-3 py-2 rounded-md border border-slate-300 text-sm" />
            </div>
            <div className="col-span-2">
              <label className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Bank Details (printed on invoices)</label>
              <textarea value={s.bank_details} onChange={(e) => upd("bank_details")(e.target.value)} rows={3} className="mt-1 w-full px-3 py-2 rounded-md border border-slate-300 text-sm" />
            </div>
          </div>
        </div>
        <div className="pt-6 border-t border-slate-200">
          <h3 className="font-semibold mb-3">Defaults & Numbering</h3>
          <div className="grid grid-cols-3 gap-4">
            <Fld label="Default Tax %" type="number" value={s.default_tax_rate} onChange={(v) => upd("default_tax_rate")(Number(v))} />
            <Fld label="Default Credit Days" type="number" value={s.default_credit_days} onChange={(v) => upd("default_credit_days")(Number(v))} />
            <div />
            <Fld label="Quotation Prefix" value={s.quotation_prefix} onChange={upd("quotation_prefix")} />
            <Fld label="Next Quotation #" type="number" value={s.quotation_next_seq} onChange={(v) => upd("quotation_next_seq")(Number(v))} />
            <div />
            <Fld label="Invoice Prefix" value={s.invoice_prefix} onChange={upd("invoice_prefix")} />
            <Fld label="Next Invoice #" type="number" value={s.invoice_next_seq} onChange={(v) => upd("invoice_next_seq")(Number(v))} />
          </div>
        </div>
        <div className="pt-6 border-t border-slate-200">
          <h3 className="font-semibold mb-3">Default Quotation Terms</h3>
          <textarea value={s.quotation_terms} onChange={(e) => upd("quotation_terms")(e.target.value)} rows={8} className="w-full px-3 py-2 rounded-md border border-slate-300 text-xs font-mono" />
        </div>
        <div className="flex justify-end pt-4 border-t border-slate-200">
          <button onClick={save} className="px-5 py-2 rounded-md bg-blue-600 text-white text-sm font-semibold">Save Settings</button>
        </div>
      </div>
    </div>
  );
}