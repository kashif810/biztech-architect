import { useEffect, useRef, useState } from "react";
import evertechLogo from "@/assets/evertech-logo.png";
import stampAsset from "@/assets/evertech-stamp.png.asset.json";
import signAsset from "@/assets/evertech-signature.png.asset.json";
import { fmtDate, fmtMoney, taxLabel } from "@/lib/accounting";

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

type Item = { description: string; detail?: string; quantity: number; unit_price: number; amount: number; tax_rate?: number | null };

const A4_W = 794; // A4 width @96dpi
const A4_H = 1123;

/** Renders an exact A4 sheet, scaled down to fit narrow screens (mobile/tablet). */
function A4Sheet({ children }: { children: React.ReactNode }) {
  const wrap = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [h, setH] = useState(A4_H);

  useEffect(() => {
    const measure = () => {
      const w = wrap.current?.clientWidth ?? A4_W;
      const s = Math.min(1, w / A4_W);
      setScale(s);
      const ih = inner.current?.scrollHeight ?? A4_H;
      setH(Math.max(A4_H, ih) * s);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (wrap.current) ro.observe(wrap.current);
    if (inner.current) ro.observe(inner.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={wrap} className="a4-wrap w-full" style={{ height: h }}>
      <div
        ref={inner}
        className="a4-sheet bg-white shadow-sm"
        style={{ width: A4_W, minHeight: A4_H, transform: `scale(${scale})`, transformOrigin: "top left" }}
      >
        {children}
      </div>
    </div>
  );
}

export function QuotationPrint({ doc, items, settings }: { doc: Doc; items: Item[]; settings: Settings }) {
  const c = doc.customer_snapshot || {};
  const company = settings.company_name || "Evertech Corporation";
  return (
    <A4Sheet>
    <div className="print-doc bg-white text-slate-900 p-10 text-[13px]">
      <div className="pdf-block flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-lg bg-[#0b1a3a] flex items-center justify-center">
            <img src={evertechLogo} alt="EverTech Corporation" className="h-11 w-11 object-contain" />
          </div>
          <div>
            <div className="text-2xl font-black tracking-tight text-[#0b1a3a] leading-none">{company}</div>
            <div className="text-[11px] tracking-[0.18em] text-slate-500 mt-1">DELIVERING FUTURE</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold text-[#0b1a3a]">QUOTATION</div>
          <div className="mt-3 text-[12px] leading-[1.5] text-slate-600">
            <div>Office #28, 4th Floor, Hafeez Centre, Gulberg III</div>
            <div>Lahore 54660, Pakistan</div>
            <div className="mt-1">+92 325 5024236</div>
            <div>sales@evertechcorp.com</div>
            <div>www.evertechcorp.com</div>
          </div>
        </div>
      </div>
      <div className="mt-4 h-1 rounded bg-gradient-to-r from-[#0b1a3a] via-[#2c78b8] to-[#3ba7d9]" />

      <div className="pdf-block mt-8 grid grid-cols-2 gap-8">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-slate-400">Bill To</div>
          <div className="mt-1 font-bold">{c.company || c.name || "-"}</div>
          {c.name && c.company && <div>{c.name}</div>}
          {c.address && <div>{c.address}</div>}
          {(c.city || c.country) && <div>{[c.city, c.country].filter(Boolean).join(", ")}</div>}
          {c.phone && <div>Ph: {c.phone}</div>}
        </div>
        <div className="text-sm justify-self-end">
          <div className="grid grid-cols-[auto_auto] gap-x-3 gap-y-1 items-baseline">
            <span className="text-right font-bold text-slate-700">Estimate Number:</span>
            <span className="text-left">{doc.number}</span>
            <span className="text-right font-bold text-slate-700">Estimate Date:</span>
            <span className="text-left">{fmtDate(doc.date)}</span>
            {doc.valid_until && (
              <>
                <span className="text-right font-bold text-slate-700">Valid Until:</span>
                <span className="text-left">{fmtDate(doc.valid_until)}</span>
              </>
            )}
            <span className="text-right font-bold text-slate-700 bg-slate-100 py-1.5 pl-2">Grand Total (PKR):</span>
            <span className="text-left font-bold bg-slate-100 py-1.5 pr-2">{fmtMoney(doc.total)}</span>
          </div>
        </div>
      </div>

      <table className="w-full mt-8 border-collapse">
        <thead>
          <tr className="bg-[#0b1a3a] text-white text-left">
            <th className="px-3 py-2.5 text-[12px] font-semibold w-52">Item</th>
            <th className="px-3 py-2.5 text-[12px] font-semibold">Description</th>
            <th className="px-3 py-2.5 text-[12px] font-semibold text-center w-20">Quantity</th>
            <th className="px-3 py-2.5 text-[12px] font-semibold text-right w-28">Price</th>
            <th className="px-3 py-2.5 text-[12px] font-semibold text-right w-32">Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it, i) => (
            <tr key={i} className="pdf-block border-b border-slate-200 align-top">
              <td className="px-3 py-3 font-bold">{it.description}</td>
              <td className="px-3 py-3 text-[12px] text-slate-600 whitespace-pre-wrap">{it.detail || "—"}</td>
              <td className="px-3 py-3 text-center">{it.quantity}</td>
              <td className="px-3 py-3 text-right">{fmtMoney(it.unit_price)}</td>
              <td className="px-3 py-3 text-right">{fmtMoney(it.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pdf-block mt-6 flex justify-end">
        <div className="w-72 text-sm">
          <div className="flex justify-between py-1"><span>Subtotal:</span><span className="font-semibold">{fmtMoney(doc.subtotal)}</span></div>
          {doc.tax_rate > 0 && <div className="flex justify-between py-1"><span>{taxLabel(doc.tax_rate)}:</span><span className="font-semibold">{fmtMoney(doc.tax_amount)}</span></div>}
          <div className="flex justify-between py-2 mt-1 border-t border-slate-300">
            <span className="font-bold">Grand Total (PKR):</span><span className="font-bold">{fmtMoney(doc.total)}</span>
          </div>
        </div>
      </div>

      {doc.terms && (
        <div className="pdf-block mt-8">
          <div className="font-bold text-slate-800">Notes / Terms</div>
          <div className="text-[12px] text-slate-600 whitespace-pre-wrap mt-1">{doc.terms}</div>
        </div>
      )}
    </div>
    </A4Sheet>
  );
}

export function InvoicePrint({ doc, items, settings }: { doc: Doc; items: Item[]; settings: Settings }) {
  const c = doc.customer_snapshot || {};
  const company = settings.company_name || "Evertech Corporation";
  return (
    <A4Sheet>
    <div className="print-doc bg-white text-slate-900 p-10 text-[13px]">
      <div className="pdf-block text-center text-black">
        <div className="text-[32px] font-black tracking-[0.12em] uppercase leading-tight">
          {company || "EVERTECH CORPORATION"}
        </div>
        <div className="mt-1 text-[12px] font-semibold">{settings.address || "Office #28, 4th Floor, Hafeez Centre, Gulberg III, Lahore 54660, Pakistan"}</div>
        <div className="text-[12px] font-semibold">Tel: {settings.phone}{settings.email && <>{"  "}Email: {settings.email}</>}</div>
        <div className="mt-3 text-[13px] font-bold">NTN NO. {settings.ntn}{settings.strn && <>{"   "}STRN {settings.strn}</>}</div>
        <div className="mt-3 text-[20px] font-bold uppercase border-b-2 border-black inline-block">SALES TAX INVOICE</div>
      </div>

      <table className="w-full mt-5 border border-slate-300 border-collapse text-[12px]">
        <tbody>
          <tr>
            <td className="border border-slate-300 p-2 w-16 font-bold bg-slate-50">M/S:</td>
            <td className="border border-slate-300 p-2 font-semibold">{c.company || c.name || "-"}</td>
            <td className="border border-slate-300 p-2 w-24 font-bold bg-slate-50">Invoice #</td>
            <td className="border border-slate-300 p-2 text-center font-semibold text-[#0b1a3a]">{doc.number}</td>
          </tr>
          <tr>
            <td className="border border-slate-300 p-2 font-bold bg-slate-50 align-top" rowSpan={3}></td>
            <td className="border border-slate-300 p-2 align-top" rowSpan={3}>
              {c.address}<br />{[c.city, c.country].filter(Boolean).join(", ")}
              {(c.ntn || c.strn) && <><br />{c.ntn && <>NTN: {c.ntn}  </>}{c.strn && <>STRN: {c.strn}</>}</>}
            </td>
            <td className="border border-slate-300 p-2 font-bold bg-slate-50">Date:</td>
            <td className="border border-slate-300 p-2 text-center">{new Date(doc.date).toLocaleDateString("en-GB")}</td>
          </tr>
          <tr>
            <td className="border border-slate-300 p-2 font-bold bg-slate-50">P.O #</td>
            <td className="border border-slate-300 p-2 text-center">{doc.po_number || "-"}</td>
          </tr>
          <tr>
            <td className="border border-slate-300 p-2 font-bold bg-slate-50">Due:</td>
            <td className="border border-slate-300 p-2 text-center">{doc.due_date ? new Date(doc.due_date).toLocaleDateString("en-GB") : "-"}</td>
          </tr>
        </tbody>
      </table>

      <table className="w-full mt-4 border border-slate-300 border-collapse text-[12px]">
        <thead>
          <tr className="bg-slate-100 text-black">
            <th className="border border-slate-400 p-2 w-12">Sr. No.</th>
            <th className="border border-slate-400 p-2 text-center">Description</th>
            <th className="border border-slate-400 p-2 w-16">Qty</th>
            <th className="border border-slate-400 p-2 w-24">Unit Price</th>
            <th className="border border-slate-400 p-2 w-24">Taxable Value</th>
            <th className="border border-slate-400 p-2 w-24">{taxName(Number(doc.tax_rate))}</th>
            <th className="border border-slate-400 p-2 w-28">Total Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it, i) => {
            const line = Number(it.amount || 0);
            const rate = it.tax_rate === null || it.tax_rate === undefined ? Number(doc.tax_rate) || 0 : Number(it.tax_rate) || 0;
            const tax = +(line * (rate / 100)).toFixed(2);
            return (
              <tr key={i} className="pdf-block align-top">
                <td className="border border-slate-300 p-2 text-center">{i + 1}</td>
                <td className="border border-slate-300 p-2">
                  <div className="font-semibold">{it.description}</div>
                  {it.detail && <div className="text-[11px] text-slate-600 whitespace-pre-wrap">{it.detail}</div>}
                </td>
                <td className="border border-slate-300 p-2 text-center">{it.quantity}</td>
                <td className="border border-slate-300 p-2 text-right">{Number(it.unit_price).toLocaleString()}</td>
                <td className="border border-slate-300 p-2 text-right">{line.toLocaleString()}</td>
                <td className="border border-slate-300 p-2 text-right">{tax.toLocaleString()}{rate !== Number(doc.tax_rate) && <span className="text-[10px] text-slate-500"> ({rate}%)</span>}</td>
                <td className="border border-slate-300 p-2 text-right">{(line + tax).toLocaleString()}</td>
              </tr>
            );
          })}
          {Array.from({ length: Math.max(0, 6 - items.length) }).map((_, i) => (
            <tr key={`e${i}`}><td className="border border-slate-300 p-3"></td><td className="border border-slate-300"></td><td className="border border-slate-300"></td><td className="border border-slate-300"></td><td className="border border-slate-300"></td><td className="border border-slate-300"></td><td className="border border-slate-300"></td></tr>
          ))}
          <tr className="pdf-block bg-slate-100 font-bold text-black">
            <td className="border border-slate-300 p-2 text-center" colSpan={2}>TOTAL =</td>
            <td className="border border-slate-300 p-2 text-center">{items.reduce((s, it) => s + Number(it.quantity || 0), 0)}</td>
            <td className="border border-slate-300 p-2 text-right">{items.reduce((s, it) => s + Number(it.unit_price || 0), 0).toLocaleString()}</td>
            <td className="border border-slate-300 p-2 text-right">{doc.subtotal.toLocaleString()}</td>
            <td className="border border-slate-300 p-2 text-right">{doc.tax_amount.toLocaleString()}</td>
            <td className="border border-slate-300 p-2 text-right">{doc.total.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>

      {settings.bank_details && (
        <div className="pdf-block mt-4 text-[12px]">
          <div className="font-bold">Bank Details:</div>
          <div className="whitespace-pre-wrap">{settings.bank_details}</div>
        </div>
      )}

      <div className="pdf-block mt-8 flex items-end gap-3 text-[12px]">
          <div className="text-center">
            <img src={signAsset.url} alt="Authorised signature" className="h-16 object-contain" />
            <div className="mt-1 border-t border-slate-400 pt-1 text-[11px]">Authorised Signatory</div>
          </div>
          <img src={stampAsset.url} alt="Evertech Corporation partner stamp" className="h-24 w-24 object-contain" />
      </div>
      <div className="pdf-block mt-6 text-[10.5px] text-slate-700 whitespace-nowrap">
        This is a computer-generated Sales Tax Invoice. It is valid without a handwritten signature or physical company stamp.
      </div>
    </div>
    </A4Sheet>
  );
}
