import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { LayoutGrid, Package, Layers, Wrench, Plus, Pencil, Trash2, X, Search, Upload, ChevronLeft, FolderOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Evertech" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

type Category = { slug: string; name: string; short_name: string; tagline: string; intro: string; image_url: string | null; icon: string; brands: string[]; use_cases: string[]; sort_order: number };
type Product = { id: string; category_slug: string; name: string; brand: string; highlight: string; description: string; specs: string[]; price: string | null; price_note: string | null; billing_period: string | null; min_months: number | null; max_months: number | null; in_stock: boolean; stock: number; featured: boolean; image_url: string | null; sort_order: number };
type Service = { slug: string; name: string; short_name: string; tagline: string; intro: string; image_url: string | null; icon: string; included: string[]; process: { step: string; title: string; desc: string }[]; industries: string[]; sort_order: number };

type Tab = "products" | "categories" | "services";

function AdminPage() {
  const [tab, setTab] = useState<Tab>("products");

  return (
    <div className="min-h-screen bg-[#050914] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#070d1c]">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-md bg-sky-500/10 border border-sky-500/30 flex items-center justify-center">
              <LayoutGrid className="h-6 w-6 text-sky-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Evertech Admin</h1>
              <p className="text-xs text-white/50">Manage catalog · draft-safe workspace</p>
            </div>
          </div>
          <div className="text-xs px-3 py-2 rounded-full border border-sky-500/40 text-sky-300 bg-sky-500/5">
            Auth pending · secure before launch
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-6 mt-8">
        <div className="inline-flex bg-[#0b1428] rounded-md p-1.5 gap-1 border border-white/5">
          <TabBtn active={tab === "products"} onClick={() => setTab("products")} icon={<Package className="h-4 w-4" />}>Products</TabBtn>
          <TabBtn active={tab === "categories"} onClick={() => setTab("categories")} icon={<Layers className="h-4 w-4" />}>Categories</TabBtn>
          <TabBtn active={tab === "services"} onClick={() => setTab("services")} icon={<Wrench className="h-4 w-4" />}>Services</TabBtn>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {tab === "products" && <ProductsPanel />}
        {tab === "categories" && <CategoriesPanel />}
        {tab === "services" && <ServicesPanel />}
      </main>
    </div>
  );
}

function TabBtn({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition ${active ? "bg-white/10 text-white" : "text-white/60 hover:text-white"}`}>
      {icon} {children}
    </button>
  );
}

// ==================== PRODUCTS ====================
function ProductsPanel() {
  const [rows, setRows] = useState<Product[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const [p, c] = await Promise.all([
      supabase.from("products").select("*").order("sort_order").order("name"),
      supabase.from("product_categories").select("*").order("sort_order"),
    ]);
    if (p.error) toast.error(p.error.message);
    if (c.error) toast.error(c.error.message);
    setRows(((p.data as unknown) as Product[]) ?? []);
    setCats(((c.data as unknown) as Category[]) ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => rows.filter(r => !q || r.name.toLowerCase().includes(q.toLowerCase()) || r.brand.toLowerCase().includes(q.toLowerCase())), [rows, q]);
  const scoped = useMemo(
    () => (selectedCat ? filtered.filter((r) => r.category_slug === selectedCat) : filtered),
    [filtered, selectedCat],
  );
  const currentCat = selectedCat ? cats.find((c) => c.slug === selectedCat) : null;

  async function del(id: string) {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted"); load();
  }

  // Category-first view: no category selected → show category tiles.
  if (!selectedCat) {
    const counts = new Map<string, number>();
    rows.forEach((r) => counts.set(r.category_slug, (counts.get(r.category_slug) ?? 0) + 1));
    return (
      <div className="rounded-md bg-[#0b1428] border border-white/5 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold">Choose a category</h2>
            <p className="text-sm text-white/50 mt-1">Click a category to manage only its products.</p>
          </div>
        </div>
        {loading ? (
          <div className="py-10 text-center text-white/40 text-sm">Loading…</div>
        ) : cats.length === 0 ? (
          <div className="py-10 text-center text-white/40 text-sm">No categories yet. Add one from the Categories tab.</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cats.map((c) => (
              <button
                key={c.slug}
                onClick={() => setSelectedCat(c.slug)}
                className="group text-left rounded-md bg-[#050914]/60 border border-white/10 hover:border-sky-500/40 hover:bg-[#050914] transition p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="h-11 w-11 rounded-md bg-sky-500/10 border border-sky-500/30 flex items-center justify-center shrink-0">
                    <FolderOpen className="h-5 w-5 text-sky-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold truncate">{c.name}</div>
                    <div className="text-xs text-white/50 mt-0.5 truncate">{c.tagline || `/${c.slug}`}</div>
                    <div className="mt-3 inline-flex text-[11px] px-2 py-1 rounded bg-white/5 border border-white/10 text-white/70">
                      {counts.get(c.slug) ?? 0} product{(counts.get(c.slug) ?? 0) === 1 ? "" : "s"}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md bg-[#0b1428] border border-white/5 p-6">
        <div className="flex items-center justify-between mb-5">
          <button onClick={() => { setSelectedCat(null); setQ(""); }} className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white">
            <ChevronLeft className="h-4 w-4" /> All categories
          </button>
          <div className="text-sm">
            <span className="text-white/40">Category:</span>{" "}
            <span className="font-semibold text-white">{currentCat?.name ?? selectedCat}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products…" className="w-full bg-[#050914] border border-white/10 rounded-md pl-10 pr-4 py-3 text-sm" />
          </div>
          <button onClick={() => setEditing({ category_slug: selectedCat, specs: [], in_stock: true, stock: 0, featured: false, sort_order: 0 })} className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white rounded-md px-5 py-3 text-sm font-semibold">
            <Plus className="h-4 w-4" /> Add Product
          </button>
        </div>

        <div className="mt-6 grid grid-cols-[minmax(220px,2fr)_120px_180px_140px_100px_80px] gap-4 text-[10px] uppercase tracking-[0.2em] text-white/40 font-semibold px-3 pb-3 border-b border-white/10">
          <div>Product</div><div>Price</div><div>Category</div><div>Stock</div><div>Featured</div><div className="text-right">Actions</div>
        </div>

        {loading ? <div className="py-10 text-center text-white/40 text-sm">Loading…</div> : scoped.length === 0 ? <div className="py-10 text-center text-white/40 text-sm">No products in this category yet. Click Add Product.</div> : (
          <div className="divide-y divide-white/5">
            {scoped.map((r) => (
              <div key={r.id} className="grid grid-cols-[minmax(220px,2fr)_120px_180px_140px_100px_80px] gap-4 items-center px-3 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                    {r.image_url ? <img src={r.image_url} alt="" className="h-full w-full object-cover" /> : <Package className="h-5 w-5 text-white/30" />}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{r.name}</div>
                    <div className="text-xs text-white/40">{r.brand || "—"}</div>
                  </div>
                </div>
                <div className="font-semibold text-sm">{r.price ?? "—"}</div>
                <div className="text-sm text-white/70">{cats.find(c => c.slug === r.category_slug)?.name ?? r.category_slug}</div>
                <div>{r.in_stock ? <span className="text-xs px-2.5 py-1 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">In Stock ({r.stock})</span> : <span className="text-xs px-2.5 py-1 rounded bg-red-500/15 text-red-300 border border-red-500/30">Out of stock</span>}</div>
                <div className="text-white/60 text-sm">{r.featured ? "★" : "—"}</div>
                <div className="flex justify-end gap-2">
                  <button onClick={() => setEditing(r)} className="text-sky-400 hover:text-sky-300"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => del(r.id)} className="text-red-400 hover:text-red-300"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editing && <ProductModal draft={editing} cats={cats} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
    </>
  );
}

function ProductModal({ draft, cats, onClose, onSaved }: { draft: Partial<Product>; cats: Category[]; onClose: () => void; onSaved: () => void }) {
  const [f, setF] = useState<Partial<Product>>(draft);
  const [specsText, setSpecsText] = useState((draft.specs ?? []).join("\n"));
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function save() {
    setSaving(true);
    const payload: any = {
      category_slug: f.category_slug,
      name: (f.name ?? "").trim(),
      brand: (f.brand ?? "").trim(),
      highlight: (f.highlight ?? "").trim(),
      description: (f.description ?? "").trim(),
      specs: specsText.split("\n").map(s => s.trim()).filter(Boolean),
      price: (f.price ?? "").trim() || null,
      price_note: (f.price_note ?? "").trim() || null,
      billing_period: f.billing_period || null,
      min_months: f.min_months ?? null,
      max_months: f.max_months ?? null,
      in_stock: !!f.in_stock,
      stock: Number(f.stock ?? 0),
      featured: !!f.featured,
      image_url: (f.image_url ?? "").trim() || null,
      sort_order: Number(f.sort_order ?? 0),
    };
    if (!payload.name || !payload.category_slug) { toast.error("Name and category are required"); setSaving(false); return; }

    const res = f.id
      ? await supabase.from("products").update(payload).eq("id", f.id)
      : await supabase.from("products").insert(payload);
    setSaving(false);
    if (res.error) return toast.error(res.error.message);
    toast.success(f.id ? "Updated" : "Created");
    onSaved();
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = () => setF({ ...f, image_url: reader.result as string });
      reader.readAsDataURL(file);
    } finally { setUploading(false); }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-[#0b1428] border border-white/10 rounded-md w-full max-w-2xl my-8">
        <div className="flex items-start justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-xl font-bold">{f.id ? "Edit Product" : "Add Product"}</h2>
            <p className="text-sm text-white/50 mt-1">Changes save immediately and reflect on the live website.</p>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white"><X className="h-5 w-5" /></button>
        </div>

        <div className="p-6 space-y-5">
          <FieldA label="Product Name *"><input value={f.name ?? ""} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="Latitude 5550" className={inp} /></FieldA>

          <div className="grid grid-cols-2 gap-4">
            <FieldA label="Brand"><input value={f.brand ?? ""} onChange={(e) => setF({ ...f, brand: e.target.value })} placeholder="Dell" className={inp} /></FieldA>
            <FieldA label="Category *">
              <select value={f.category_slug ?? ""} onChange={(e) => setF({ ...f, category_slug: e.target.value })} className={inp}>
                {cats.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </select>
            </FieldA>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <FieldA label="Price (display)"><input value={f.price ?? ""} onChange={(e) => setF({ ...f, price: e.target.value })} placeholder="$150 / user / year" className={inp} /></FieldA>
            <FieldA label="Billing Period">
              <select value={f.billing_period ?? ""} onChange={(e) => setF({ ...f, billing_period: e.target.value || null })} className={inp}>
                <option value="">— none —</option>
                <option value="one-time">One-time</option>
                <option value="per-month">Per month</option>
                <option value="per-year">Per year</option>
                <option value="per-user-per-year">Per user / year</option>
                <option value="per-user-per-month">Per user / month</option>
              </select>
            </FieldA>
            <FieldA label="Sort order"><input type="number" value={f.sort_order ?? 0} onChange={(e) => setF({ ...f, sort_order: Number(e.target.value) })} className={inp} /></FieldA>
          </div>

          {(f.billing_period === "per-month" || f.billing_period === "per-user-per-month" || f.billing_period === "per-user-per-year") && (
            <div className="grid grid-cols-2 gap-4">
              <FieldA label="Min months (subscription)"><input type="number" value={f.min_months ?? 1} onChange={(e) => setF({ ...f, min_months: Number(e.target.value) })} className={inp} /></FieldA>
              <FieldA label="Max months"><input type="number" value={f.max_months ?? 12} onChange={(e) => setF({ ...f, max_months: Number(e.target.value) })} className={inp} /></FieldA>
            </div>
          )}

          <FieldA label="Price note (small text under price)"><input value={f.price_note ?? ""} onChange={(e) => setF({ ...f, price_note: e.target.value })} placeholder="Single seat. 2+ seats: request quotation." className={inp} /></FieldA>

          <div className="grid grid-cols-[1fr_1fr_1fr] gap-4 items-end">
            <FieldA label="Stock"><input type="number" value={f.stock ?? 0} onChange={(e) => setF({ ...f, stock: Number(e.target.value) })} className={inp} /></FieldA>
            <Toggle label="In Stock" on={!!f.in_stock} set={(v) => setF({ ...f, in_stock: v })} />
            <Toggle label="Featured" on={!!f.featured} set={(v) => setF({ ...f, featured: v })} />
          </div>

          <FieldA label="Short Spec (one-line summary)"><input value={f.highlight ?? ""} onChange={(e) => setF({ ...f, highlight: e.target.value })} placeholder="2U enterprise server · Dual Xeon · 512GB DDR5 ECC" className={inp} /></FieldA>

          <FieldA label="Description"><textarea rows={3} value={f.description ?? ""} onChange={(e) => setF({ ...f, description: e.target.value })} placeholder="Full description shown on product page…" className={inp} /></FieldA>

          <FieldA label="Highlights (one per line — shown as ticked bullets on the card)">
            <textarea rows={5} value={specsText} onChange={(e) => setSpecsText(e.target.value)} placeholder={"Intel Core i7 (14th Gen)\n16 GB DDR5 RAM\n512 GB NVMe SSD"} className={inp} />
          </FieldA>

          <FieldA label="Product Image (optional)">
            <div className="border-2 border-dashed border-white/15 rounded-md p-6 text-center bg-[#050914]/40">
              {f.image_url ? (
                <div className="space-y-3">
                  <img src={f.image_url} alt="" className="mx-auto max-h-40 rounded" />
                  <button type="button" onClick={() => setF({ ...f, image_url: null })} className="text-xs text-red-400 hover:text-red-300">Remove image</button>
                </div>
              ) : (
                <div>
                  <div className="mx-auto h-11 w-11 rounded-full bg-sky-500/10 border border-sky-500/30 flex items-center justify-center mb-3">
                    <Upload className="h-5 w-5 text-sky-400" />
                  </div>
                  <label className="cursor-pointer text-sky-400 font-semibold text-sm hover:text-sky-300">
                    Click to upload
                    <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
                  </label>
                  <div className="text-[11px] text-white/40 mt-1">JPG · PNG · WebP · Max 5MB</div>
                  <div className="text-[11px] text-white/40 mt-4 mb-2">or paste URL</div>
                  <input value={f.image_url ?? ""} onChange={(e) => setF({ ...f, image_url: e.target.value })} placeholder="https://…" className={inp} />
                </div>
              )}
              {uploading && <div className="text-xs text-white/50 mt-2">Loading…</div>}
            </div>
          </FieldA>

          <div className="flex justify-end gap-3 pt-2">
            <button onClick={onClose} className="px-5 py-2.5 rounded-md border border-white/15 text-white/80 text-sm font-semibold hover:bg-white/5">Cancel</button>
            <button disabled={saving} onClick={save} className="px-5 py-2.5 rounded-md bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold disabled:opacity-50">{saving ? "Saving…" : f.id ? "Save Changes" : "Create Product"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== CATEGORIES ====================
function CategoriesPanel() {
  const [rows, setRows] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Partial<Category> | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase.from("product_categories").select("*").order("sort_order");
    if (error) toast.error(error.message);
    setRows(((data as unknown) as Category[]) ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function del(slug: string) {
    if (!confirm("Delete category and all its products?")) return;
    const { error } = await supabase.from("product_categories").delete().eq("slug", slug);
    if (error) return toast.error(error.message);
    toast.success("Deleted"); load();
  }

  return (
    <>
      <div className="rounded-md bg-[#0b1428] border border-white/5 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold">Product Categories</h2>
          <button onClick={() => setEditing({ brands: [], use_cases: [], sort_order: rows.length + 1 })} className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-400 rounded-md px-5 py-3 text-sm font-semibold"><Plus className="h-4 w-4" /> Add Category</button>
        </div>
        {loading ? <div className="py-10 text-center text-white/40 text-sm">Loading…</div> : (
          <div className="grid gap-3">
            {rows.map((c) => (
              <div key={c.slug} className="grid grid-cols-[1fr_auto] items-center gap-4 p-4 bg-[#050914]/50 border border-white/5 rounded-md">
                <div>
                  <div className="font-semibold">{c.name} <span className="text-xs text-white/40 ml-2">/{c.slug}</span></div>
                  <div className="text-sm text-white/60 mt-1">{c.tagline}</div>
                  <div className="text-xs text-white/40 mt-1">Brands: {c.brands.join(", ") || "—"}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditing(c)} className="text-sky-400"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => del(c.slug)} className="text-red-400"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {editing && <CategoryModal draft={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
    </>
  );
}

function CategoryModal({ draft, onClose, onSaved }: { draft: Partial<Category>; onClose: () => void; onSaved: () => void }) {
  const isEdit = !!draft.slug;
  const [f, setF] = useState<Partial<Category>>(draft);
  const [brandsText, setBrandsText] = useState((draft.brands ?? []).join("\n"));
  const [useCasesText, setUseCasesText] = useState((draft.use_cases ?? []).join("\n"));
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    const payload: any = {
      slug: (f.slug ?? "").trim().toLowerCase().replace(/\s+/g, "-"),
      name: (f.name ?? "").trim(),
      short_name: (f.short_name ?? f.name ?? "").trim(),
      tagline: (f.tagline ?? "").trim(),
      intro: (f.intro ?? "").trim(),
      icon: (f.icon ?? "Box").trim(),
      image_url: (f.image_url ?? "").trim() || null,
      brands: brandsText.split("\n").map(s => s.trim()).filter(Boolean),
      use_cases: useCasesText.split("\n").map(s => s.trim()).filter(Boolean),
      sort_order: Number(f.sort_order ?? 0),
    };
    if (!payload.slug || !payload.name) { toast.error("Slug and name required"); setSaving(false); return; }
    const res = isEdit
      ? await supabase.from("product_categories").update(payload).eq("slug", draft.slug!)
      : await supabase.from("product_categories").insert(payload);
    setSaving(false);
    if (res.error) return toast.error(res.error.message);
    toast.success("Saved"); onSaved();
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-[#0b1428] border border-white/10 rounded-md w-full max-w-2xl my-8">
        <div className="flex items-start justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-bold">{isEdit ? "Edit Category" : "Add Category"}</h2>
          <button onClick={onClose} className="text-white/60"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <FieldA label="Slug (URL) *"><input value={f.slug ?? ""} onChange={(e) => setF({ ...f, slug: e.target.value })} placeholder="laptops-desktops" className={inp} disabled={isEdit} /></FieldA>
            <FieldA label="Sort order"><input type="number" value={f.sort_order ?? 0} onChange={(e) => setF({ ...f, sort_order: Number(e.target.value) })} className={inp} /></FieldA>
          </div>
          <FieldA label="Name *"><input value={f.name ?? ""} onChange={(e) => setF({ ...f, name: e.target.value })} className={inp} /></FieldA>
          <FieldA label="Short name (menu)"><input value={f.short_name ?? ""} onChange={(e) => setF({ ...f, short_name: e.target.value })} className={inp} /></FieldA>
          <FieldA label="Tagline"><input value={f.tagline ?? ""} onChange={(e) => setF({ ...f, tagline: e.target.value })} className={inp} /></FieldA>
          <FieldA label="Intro (long text)"><textarea rows={3} value={f.intro ?? ""} onChange={(e) => setF({ ...f, intro: e.target.value })} className={inp} /></FieldA>
          <FieldA label="Icon (lucide name — e.g. Laptop, Server, Router)"><input value={f.icon ?? ""} onChange={(e) => setF({ ...f, icon: e.target.value })} className={inp} /></FieldA>
          <FieldA label="Image URL (optional)"><input value={f.image_url ?? ""} onChange={(e) => setF({ ...f, image_url: e.target.value })} className={inp} /></FieldA>
          <FieldA label="Brands (one per line)"><textarea rows={4} value={brandsText} onChange={(e) => setBrandsText(e.target.value)} className={inp} /></FieldA>
          <FieldA label="Use cases (one per line)"><textarea rows={4} value={useCasesText} onChange={(e) => setUseCasesText(e.target.value)} className={inp} /></FieldA>
          <div className="flex justify-end gap-3">
            <button onClick={onClose} className="px-5 py-2.5 rounded-md border border-white/15 text-sm font-semibold">Cancel</button>
            <button disabled={saving} onClick={save} className="px-5 py-2.5 rounded-md bg-sky-500 hover:bg-sky-400 text-sm font-semibold">{saving ? "Saving…" : "Save"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== SERVICES ====================
function ServicesPanel() {
  const [rows, setRows] = useState<Service[]>([]);
  const [editing, setEditing] = useState<Partial<Service> | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase.from("services").select("*").order("sort_order");
    if (error) toast.error(error.message);
    setRows(((data as unknown) as Service[]) ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function del(slug: string) {
    if (!confirm("Delete this service?")) return;
    const { error } = await supabase.from("services").delete().eq("slug", slug);
    if (error) return toast.error(error.message);
    toast.success("Deleted"); load();
  }

  return (
    <>
      <div className="rounded-md bg-[#0b1428] border border-white/5 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold">Services</h2>
          <button onClick={() => setEditing({ included: [], process: [], industries: [], sort_order: rows.length + 1 })} className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-400 rounded-md px-5 py-3 text-sm font-semibold"><Plus className="h-4 w-4" /> Add Service</button>
        </div>
        {loading ? <div className="py-10 text-center text-white/40 text-sm">Loading…</div> : (
          <div className="grid gap-3">
            {rows.map((s) => (
              <div key={s.slug} className="grid grid-cols-[1fr_auto] items-center gap-4 p-4 bg-[#050914]/50 border border-white/5 rounded-md">
                <div>
                  <div className="font-semibold">{s.name} <span className="text-xs text-white/40 ml-2">/{s.slug}</span></div>
                  <div className="text-sm text-white/60 mt-1">{s.tagline}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditing(s)} className="text-sky-400"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => del(s.slug)} className="text-red-400"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {editing && <ServiceModal draft={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
    </>
  );
}

function ServiceModal({ draft, onClose, onSaved }: { draft: Partial<Service>; onClose: () => void; onSaved: () => void }) {
  const isEdit = !!draft.slug;
  const [f, setF] = useState<Partial<Service>>(draft);
  const [includedText, setIncludedText] = useState((draft.included ?? []).join("\n"));
  const [industriesText, setIndustriesText] = useState((draft.industries ?? []).join("\n"));
  const [processText, setProcessText] = useState(JSON.stringify(draft.process ?? [], null, 2));
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    let process: any = [];
    try { process = JSON.parse(processText || "[]"); }
    catch { toast.error("Process JSON is invalid"); setSaving(false); return; }

    const payload: any = {
      slug: (f.slug ?? "").trim().toLowerCase().replace(/\s+/g, "-"),
      name: (f.name ?? "").trim(),
      short_name: (f.short_name ?? f.name ?? "").trim(),
      tagline: (f.tagline ?? "").trim(),
      intro: (f.intro ?? "").trim(),
      icon: (f.icon ?? "Wrench").trim(),
      image_url: (f.image_url ?? "").trim() || null,
      included: includedText.split("\n").map(s => s.trim()).filter(Boolean),
      industries: industriesText.split("\n").map(s => s.trim()).filter(Boolean),
      process,
      sort_order: Number(f.sort_order ?? 0),
    };
    if (!payload.slug || !payload.name) { toast.error("Slug and name required"); setSaving(false); return; }
    const res = isEdit
      ? await supabase.from("services").update(payload).eq("slug", draft.slug!)
      : await supabase.from("services").insert(payload);
    setSaving(false);
    if (res.error) return toast.error(res.error.message);
    toast.success("Saved"); onSaved();
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-[#0b1428] border border-white/10 rounded-md w-full max-w-2xl my-8">
        <div className="flex items-start justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-bold">{isEdit ? "Edit Service" : "Add Service"}</h2>
          <button onClick={onClose} className="text-white/60"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <FieldA label="Slug (URL) *"><input value={f.slug ?? ""} onChange={(e) => setF({ ...f, slug: e.target.value })} className={inp} disabled={isEdit} /></FieldA>
            <FieldA label="Sort order"><input type="number" value={f.sort_order ?? 0} onChange={(e) => setF({ ...f, sort_order: Number(e.target.value) })} className={inp} /></FieldA>
          </div>
          <FieldA label="Name *"><input value={f.name ?? ""} onChange={(e) => setF({ ...f, name: e.target.value })} className={inp} /></FieldA>
          <FieldA label="Short name"><input value={f.short_name ?? ""} onChange={(e) => setF({ ...f, short_name: e.target.value })} className={inp} /></FieldA>
          <FieldA label="Tagline"><input value={f.tagline ?? ""} onChange={(e) => setF({ ...f, tagline: e.target.value })} className={inp} /></FieldA>
          <FieldA label="Intro"><textarea rows={3} value={f.intro ?? ""} onChange={(e) => setF({ ...f, intro: e.target.value })} className={inp} /></FieldA>
          <FieldA label="Icon (lucide name — Video, Network, Wrench, Building2)"><input value={f.icon ?? ""} onChange={(e) => setF({ ...f, icon: e.target.value })} className={inp} /></FieldA>
          <FieldA label="Image URL"><input value={f.image_url ?? ""} onChange={(e) => setF({ ...f, image_url: e.target.value })} className={inp} /></FieldA>
          <FieldA label="What's included (one per line)"><textarea rows={5} value={includedText} onChange={(e) => setIncludedText(e.target.value)} className={inp} /></FieldA>
          <FieldA label="Industries served (one per line)"><textarea rows={4} value={industriesText} onChange={(e) => setIndustriesText(e.target.value)} className={inp} /></FieldA>
          <FieldA label='Process (JSON: [{"step":"01","title":"...","desc":"..."}])'><textarea rows={7} value={processText} onChange={(e) => setProcessText(e.target.value)} className={`${inp} font-mono text-xs`} /></FieldA>
          <div className="flex justify-end gap-3">
            <button onClick={onClose} className="px-5 py-2.5 rounded-md border border-white/15 text-sm font-semibold">Cancel</button>
            <button disabled={saving} onClick={save} className="px-5 py-2.5 rounded-md bg-sky-500 hover:bg-sky-400 text-sm font-semibold">{saving ? "Saving…" : "Save"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== helpers ====================
const inp = "w-full bg-[#050914] border border-white/10 rounded-md px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-sky-500";
function FieldA({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><div className="text-xs font-semibold text-white/70 mb-1.5">{label}</div>{children}</label>;
}
function Toggle({ label, on, set }: { label: string; on: boolean; set: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => set(!on)} className={`flex items-center gap-3 px-4 py-2.5 rounded-md border ${on ? "bg-sky-500/10 border-sky-500/40" : "bg-[#050914] border-white/10"}`}>
      <span className={`relative h-5 w-9 rounded-full transition ${on ? "bg-sky-500" : "bg-white/15"}`}>
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition ${on ? "left-4" : "left-0.5"}`} />
      </span>
      <span className="text-sm font-semibold">{label}</span>
    </button>
  );
}