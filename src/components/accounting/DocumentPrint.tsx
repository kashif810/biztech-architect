import evertechLogo from "@/assets/evertech-logo.png";
import { fmtDate, fmtMoney } from "@/lib/accounting";

type Settings = {
  company_name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  ntn: string;
  strn: string;
  bank_details: string;
};

type Doc = {
  number: string;
  date: string;
  valid_until?: string | null;
  due_date?: string | null;
  po_number?: string;
  po_date?: string | null;
  customer_snapshot: any;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  notes?: string;
  terms?: string;
};

type Item = { description: string; detail?: string; quantity: number; unit_price: number; amount: number };

export function QuotationPrint({ doc, items, settings }: { doc: Doc; items: Item[]; settings: Settings }) {
  const c = doc.customer_snapshot || {};
  return (
    <div className="print-doc bg-white text-slate-900 max-w-[820px] mx-auto p-10 text-[13px]">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded bg-[#0b1a3a] flex items-center justify-center">
            <img src={evertechLogo} alt="Evertech" className="h-12 w-12 object-contain" />
          </div>
          <div>
            <div className="text-2xl font-black tracking-tight text-[#0b1a3a]">EVERTECH</div>
            <div className="text-[11px] text-slate-500 tracking-wider">CORPORATION · DELIVERING FUTURE</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold text-slate-800">QUOTATION</div>
          <div className="mt-3 text-[12px] leading-tight text-slate-600">
            <div className="font-bold text-slate-800">{settings.company_name}</div>
            <div>{settings.address}</div>
            <div className="mt-1">Mobile: {settings.phone}</div>
            <div>{settings.website}</div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-8">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-slate-400">Bill To</div>
          <div className="mt-1 font-bold">{c.company || c.name || "-"}</div>
          {c.name && c.company && <div>{c.name}</div>}
          {c.address && <div>{c.address}</div>}
          {(c.city || c.country) && <div>{[c.city, c.country].filter(Boolean).join(", ")}</div>}
          {c.phone && <div>Ph: {c.phone}</div>}
        </div>
        <div className="text-sm">
          <Row label="Estimate Number:" value={doc.number} bold />
          <Row label="Estimate Date:" value={fmtDate(doc.date)} />
          {doc.valid_until && <Row label="Valid Until:" value={fmtDate(doc.valid_until)} />}
          <div className="mt-2 bg-slate-100 -mx-2 px-2 py-2 flex justify-between">
            <span className="font-bold text-slate-700">Grand Total (PKR):</span>
            <span className="font-bold">{fmtMoney(doc.total)}</span>
          </div>
        </div>
      </div>

      <table className="w-full mt-8 border-collapse">
        <thead>
          <tr className="bg-[#3ba7d9] text-white text-left">
            <th className="px-3 py-2.5 text-[12px] font-semibold">Items</th>
            <th className="px-3 py-2.5 text-[12px] font-semibold text-center w-24">Quantity</th>
            <th className="px-3 py-2.5 text-[12px] font-semibold text-right w-32">Price</th>
            <th className="px-3 py-2.5 text-[12px] font-semibold text-right w-32">Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it, i) => (
            <tr key={i} className="border-b border-slate-200 align-top">
              <td className="px-3 py-3">
                <div className="font-bold">{it.description}</div>
                {it.detail && <div className="text-[12px] text-slate-600 whitespace-pre-wrap">{it.detail}</div>}
              </td>
              <td className="px-3 py-3 text-center">{it.quantity}</td>
              <td className="px-3 py-3 text-right">{fmtMoney(it.unit_price)}</td>
              <td className="px-3 py-3 text-right">{fmtMoney(it.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 flex justify-end">
        <div className="w-72 text-sm">
          <div className="flex justify-between py-1"><span>Subtotal:</span><span className="font-semibold">{fmtMoney(doc.subtotal)}</span></div>
          {doc.tax_rate > 0 && <div className="flex justify-between py-1"><span>GST {doc.tax_rate}%:</span><span className="font-semibold">{fmtMoney(doc.tax_amount)}</span></div>}
          <div className="flex justify-between py-2 mt-1 border-t border-slate-300">
            <span className="font-bold">Grand Total (PKR):</span><span className="font-bold">{fmtMoney(doc.total)}</span>
          </div>
        </div>
      </div>

      {doc.terms && (
        <div className="mt-8">
          <div className="font-bold text-slate-800">Notes / Terms</div>
          <div className="text-[12px] text-slate-600 whitespace-pre-wrap mt-1">{doc.terms}</div>
        </div>
      )}
    </div>
  );
}

export function InvoicePrint({ doc, items, settings }: { doc: Doc; items: Item[]; settings: Settings }) {
  const c = doc.customer_snapshot || {};
  return (
    <div className="print-doc bg-white text-slate-900 max-w-[820px] mx-auto p-10 text-[13px]">
      <div className="text-center border-b-2 border-slate-800 pb-2">
        <div className="text-3xl font-black uppercase tracking-wide">{settings.company_name}</div>
        <div className="text-[12px] mt-1">{settings.address}</div>
        <div className="text-[12px]">Tel: {settings.phone} {settings.email && <>· {settings.email}</>}</div>
      </div>
      <div className="text-center mt-3 text-[13px]">NTN NO. {settings.ntn}{settings.strn && <> · STRN {settings.strn}</>}</div>
      <div className="text-center mt-4">
        <span className="text-xl font-bold underline underline-offset-4">SALES TAX INVOICE</span>
      </div>

      <table className="w-full mt-5 border border-slate-800 border-collapse text-[12px]">
        <tbody>
          <tr>
            <td className="border border-slate-800 p-2 w-16 font-bold">M/S:</td>
            <td className="border border-slate-800 p-2 font-semibold">{c.company || c.name || "-"}</td>
            <td className="border border-slate-800 p-2 w-24 font-bold">Invoice #</td>
            <td className="border border-slate-800 p-2 text-center font-semibold">{doc.number}</td>
          </tr>
          <tr>
            <td className="border border-slate-800 p-2 font-bold" rowSpan={3}></td>
            <td className="border border-slate-800 p-2" rowSpan={3}>
              {c.address}<br />{[c.city, c.country].filter(Boolean).join(", ")}
              {(c.ntn || c.strn) && <><br />{c.ntn && <>NTN: {c.ntn}  </>}{c.strn && <>STRN: {c.strn}</>}</>}
            </td>
            <td className="border border-slate-800 p-2 font-bold">Date:</td>
            <td className="border border-slate-800 p-2 text-center">{new Date(doc.date).toLocaleDateString("en-GB")}</td>
          </tr>
          <tr>
            <td className="border border-slate-800 p-2 font-bold">P.O #</td>
            <td className="border border-slate-800 p-2 text-center">{doc.po_number || "-"}</td>
          </tr>
          <tr>
            <td className="border border-slate-800 p-2 font-bold">Due:</td>
            <td className="border border-slate-800 p-2 text-center">{doc.due_date ? new Date(doc.due_date).toLocaleDateString("en-GB") : "-"}</td>
          </tr>
        </tbody>
      </table>

      <table className="w-full mt-4 border border-slate-800 border-collapse text-[12px]">
        <thead>
          <tr className="bg-slate-100">
            <th className="border border-slate-800 p-2 w-12">Sr. No.</th>
            <th className="border border-slate-800 p-2 text-left">DESCRIPTION</th>
            <th className="border border-slate-800 p-2 w-20">Quantity</th>
            <th className="border border-slate-800 p-2 w-24">Unit Price (Rs.)</th>
            <th className="border border-slate-800 p-2 w-24">Value for Sales Tax (Rs.)</th>
            <th className="border border-slate-800 p-2 w-20">Sales Tax {doc.tax_rate}%</th>
            <th className="border border-slate-800 p-2 w-28">Value Including Sales Tax</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it, i) => {
            const line = Number(it.amount || 0);
            const tax = +(line * (doc.tax_rate / 100)).toFixed(2);
            return (
              <tr key={i} className="align-top">
                <td className="border border-slate-800 p-2 text-center">{i + 1}</td>
                <td className="border border-slate-800 p-2">
                  <div className="font-semibold">{it.description}</div>
                  {it.detail && <div className="text-[11px] text-slate-600 whitespace-pre-wrap">{it.detail}</div>}
                </td>
                <td className="border border-slate-800 p-2 text-center">{it.quantity}</td>
                <td className="border border-slate-800 p-2 text-right">{Number(it.unit_price).toLocaleString()}</td>
                <td className="border border-slate-800 p-2 text-right">{line.toLocaleString()}</td>
                <td className="border border-slate-800 p-2 text-right">{tax.toLocaleString()}</td>
                <td className="border border-slate-800 p-2 text-right">{(line + tax).toLocaleString()}</td>
              </tr>
            );
          })}
          {Array.from({ length: Math.max(0, 6 - items.length) }).map((_, i) => (
            <tr key={`e${i}`}><td className="border border-slate-800 p-3"></td><td className="border border-slate-800"></td><td className="border border-slate-800"></td><td className="border border-slate-800"></td><td className="border border-slate-800"></td><td className="border border-slate-800"></td><td className="border border-slate-800"></td></tr>
          ))}
          <tr className="bg-slate-100 font-bold">
            <td className="border border-slate-800 p-2 text-center" colSpan={2}>TOTAL =</td>
            <td className="border border-slate-800 p-2 text-center">{items.reduce((s, it) => s + Number(it.quantity || 0), 0)}</td>
            <td className="border border-slate-800 p-2"></td>
            <td className="border border-slate-800 p-2 text-right">{doc.subtotal.toLocaleString()}</td>
            <td className="border border-slate-800 p-2 text-right">{doc.tax_amount.toLocaleString()}</td>
            <td className="border border-slate-800 p-2 text-right">{doc.total.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>

      {settings.bank_details && (
        <div className="mt-4 text-[12px]">
          <div className="font-bold">Bank Details:</div>
          <div className="whitespace-pre-wrap">{settings.bank_details}</div>
        </div>
      )}

      <div className="mt-10 flex justify-between text-[12px]">
        <div><span className="font-bold">Signature & Stamp</span></div>
        <div className="text-right">For {settings.company_name}</div>
      </div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex justify-between py-0.5">
      <span className="text-slate-600">{label}</span>
      <span className={bold ? "font-bold" : ""}>{value}</span>
    </div>
  );
}