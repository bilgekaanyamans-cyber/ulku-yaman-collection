"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Upload, X, Search } from "lucide-react";
import { toast } from "sonner";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [search, setSearch] = useState("");

  const load = () => fetch("/api/products?limit=100").then(r => r.json()).then(d => setProducts(d.products)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleDelete = async (slug: string) => {
    if (!confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;
    await fetch(`/api/products/${slug}`, { method: "DELETE" });
    toast.success("Ürün silindi");
    load();
  };

  const handleToggle = async (slug: string, active: boolean) => {
    await fetch(`/api/products/${slug}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    });
    toast.success(active ? "Ürün pasife alındı" : "Ürün aktif edildi");
    load();
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="animate-fade-in">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div><h1 className="font-serif text-3xl">Ürünler</h1><p className="text-xs text-taupe mt-1">{products.length} ürün</p></div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 bg-white border border-black/10 px-3 py-2">
            <Search size={14} className="text-taupe" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Ürün ara..." className="text-sm outline-none bg-transparent w-40" />
          </div>
          <button onClick={() => { setEditing(null); setModal(true); }} className="px-5 py-2.5 bg-[#1a1a1a] text-white text-[11px] tracking-[1.5px] uppercase flex items-center gap-2 hover:bg-[#333]">
            <Plus size={14} /> Yeni Ürün
          </button>
        </div>
      </div>

      <div className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-[10px] tracking-[1.5px] uppercase text-taupe border-b border-black/[0.06]">
            <th className="text-left p-4">Ürün</th><th className="text-left p-4">Fiyat</th><th className="text-left p-4">Stok</th><th className="text-left p-4">Satış</th><th className="text-left p-4">Durum</th><th className="text-left p-4">İşlem</th>
          </tr></thead>
          <tbody>{filtered.map((p: any) => (
            <tr key={p.id} className="border-b border-black/[0.04] hover:bg-black/[0.01]">
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-16 relative bg-grey-light overflow-hidden flex-shrink-0">
                    {p.images[0] && <Image src={p.images[0].url} alt="" fill className="object-cover" sizes="48px" />}
                  </div>
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-[11px] text-taupe">{[...new Set(p.variants.map((v:any) => v.colorName))].join(", ")}</p>
                  </div>
                </div>
              </td>
              <td className="p-4">₺{p.price.toLocaleString("tr-TR")}</td>
              <td className="p-4"><span className={p.stock < 10 ? "text-[#c1121f] font-medium" : ""}>{p.stock}</span></td>
              <td className="p-4">{p.sales}</td>
              <td className="p-4">
                <button onClick={() => handleToggle(p.slug, p.active)} className={`px-2.5 py-1 text-[10px] tracking-wide uppercase font-medium cursor-pointer ${p.active ? "bg-green-50 text-green-800" : "bg-gray-100 text-gray-600"}`}>
                  {p.active ? "Aktif" : "Pasif"}
                </button>
              </td>
              <td className="p-4">
                <div className="flex gap-1">
                  <button onClick={() => { setEditing(p); setModal(true); }} className="p-1.5 text-taupe hover:text-[#1a1a1a]"><Pencil size={15} /></button>
                  <button onClick={() => handleDelete(p.slug)} className="p-1.5 text-taupe hover:text-[#c1121f]"><Trash2 size={15} /></button>
                </div>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>

      {modal && <ProductModal product={editing} onClose={() => { setModal(false); setEditing(null); }} onSaved={() => { setModal(false); setEditing(null); load(); }} />}
    </div>
  );
}

// ─── Product Modal with Cloudinary Upload ────────────────────

function ProductModal({ product, onClose, onSaved }: { product: any; onClose: () => void; onSaved: () => void }) {
  const [f, setF] = useState({
    name: product?.name || "", description: product?.description || "", price: product?.price || "",
    comparePrice: product?.comparePrice || "", badge: product?.badge || "", featured: product?.featured || false,
    category: product?.category || "sandalet",
  });
  const [images, setImages] = useState<{url:string;altText?:string}[]>(product?.images || []);
  const [variants, setVariants] = useState<string>(
    product?.variants ? [...new Set(product.variants.map((v:any) => `${v.colorName}:${v.color}:${v.size}:${v.stock}`))].join("\n") : ""
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (files: FileList) => {
    setUploading(true);
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (data.url) setImages(prev => [...prev, { url: data.url, altText: f.name }]);
      } catch { toast.error("Görsel yüklenemedi"); }
    }
    setUploading(false);
  };

  const handleSave = async () => {
    if (!f.name || !f.price || images.length === 0) { toast.error("Ad, fiyat ve en az 1 görsel zorunlu"); return; }

    // Parse variants: "Siyah:#1a1a1a:38:5" per line
    const parsedVariants = variants.split("\n").filter(Boolean).map(line => {
      const [colorName, color, size, stock] = line.split(":");
      const slug = f.name.toLowerCase().replace(/\s+/g, "-").substring(0, 10);
      return { colorName: colorName.trim(), color: color.trim(), size: parseInt(size), stock: parseInt(stock) || 0, sku: `UY-${slug}-${colorName.substring(0,3).toUpperCase()}-${size}` };
    });

    if (parsedVariants.length === 0) { toast.error("En az 1 varyant ekleyin"); return; }

    setSaving(true);
    try {
      if (product) {
        await fetch(`/api/products/${product.slug}`, {
          method: "PATCH", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...f, price: Number(f.price), comparePrice: f.comparePrice ? Number(f.comparePrice) : null }),
        });
        toast.success("Ürün güncellendi");
      } else {
        await fetch("/api/products", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...f, price: Number(f.price), comparePrice: f.comparePrice ? Number(f.comparePrice) : null, images, variants: parsedVariants }),
        });
        toast.success("Ürün eklendi");
      }
      onSaved();
    } catch (err: any) { toast.error(err.message || "Hata oluştu"); }
    setSaving(false);
  };

  const u = (k: string, v: any) => setF(p => ({ ...p, [k]: v }));

  return (
    <div className="fixed inset-0 bg-black/40 z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white w-[640px] max-w-full max-h-[90vh] overflow-y-auto p-8" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-serif text-2xl">{product ? "Ürün Düzenle" : "Yeni Ürün"}</h2>
          <button onClick={onClose}><X size={22} /></button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <Inp label="Ürün Adı *" value={f.name} onChange={v => u("name", v)} />
          <Inp label="Fiyat (₺) *" value={f.price} onChange={v => u("price", v)} type="number" />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Inp label="Eski Fiyat (₺)" value={f.comparePrice} onChange={v => u("comparePrice", v)} type="number" />
          <Inp label="Etiket" value={f.badge} onChange={v => u("badge", v)} placeholder="Yeni Sezon, En Çok Satan..." />
        </div>

        <div className="mb-4">
          <label className="block text-[11px] tracking-[1.5px] uppercase text-taupe mb-2">Açıklama</label>
          <textarea value={f.description} onChange={e => u("description", e.target.value)} rows={3} className="w-full px-4 py-3 border border-black/15 text-sm outline-none focus:border-[#1a1a1a] resize-y bg-transparent" />
        </div>

        <label className="flex items-center gap-2 mb-6 cursor-pointer">
          <input type="checkbox" checked={f.featured} onChange={e => u("featured", e.target.checked)} className="accent-[#1a1a1a]" />
          <span className="text-sm">Öne çıkan ürün</span>
        </label>

        {/* Image upload */}
        <div className="mb-4">
          <label className="block text-[11px] tracking-[1.5px] uppercase text-taupe mb-2">Görseller *</label>
          <div className="flex flex-wrap gap-3 mb-3">
            {images.map((img, i) => (
              <div key={i} className="relative w-20 h-24 bg-grey-light overflow-hidden group">
                <Image src={img.url} alt="" fill className="object-cover" sizes="80px" />
                <button onClick={() => setImages(images.filter((_, j) => j !== i))} className="absolute top-1 right-1 w-5 h-5 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button>
              </div>
            ))}
            <button onClick={() => fileRef.current?.click()} disabled={uploading} className="w-20 h-24 border-2 border-dashed border-black/15 flex flex-col items-center justify-center gap-1 hover:border-black/30 transition-colors">
              <Upload size={16} className="text-taupe" />
              <span className="text-[10px] text-taupe">{uploading ? "..." : "Ekle"}</span>
            </button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={e => e.target.files && handleUpload(e.target.files)} />
        </div>

        {/* Variants */}
        <div className="mb-6">
          <label className="block text-[11px] tracking-[1.5px] uppercase text-taupe mb-2">Varyantlar (satır satır: RenkAdı:HexKod:Beden:Stok)</label>
          <textarea value={variants} onChange={e => setVariants(e.target.value)} rows={5} placeholder={"Siyah:#1a1a1a:36:5\nSiyah:#1a1a1a:37:5\nSiyah:#1a1a1a:38:5\nBej:#c4a882:37:3\nBej:#c4a882:38:3"} className="w-full px-4 py-3 border border-black/15 text-sm outline-none focus:border-[#1a1a1a] resize-y bg-transparent font-mono" />
        </div>

        <div className="flex gap-3">
          <button onClick={handleSave} disabled={saving} className="flex-1 py-4 bg-[#1a1a1a] text-white text-xs tracking-wide2 uppercase hover:bg-[#333] disabled:bg-[#ccc]">
            {saving ? "Kaydediliyor..." : product ? "Güncelle" : "Ürünü Kaydet"}
          </button>
          <button onClick={onClose} className="px-6 py-4 border border-black/15 text-xs tracking-wide2 uppercase hover:bg-grey-light">İptal</button>
        </div>
      </div>
    </div>
  );
}

function Inp({ label, value, onChange, type = "text", placeholder = "" }: any) {
  return (
    <div>
      <label className="block text-[11px] tracking-[1.5px] uppercase text-taupe mb-2">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full px-4 py-3 border border-black/15 text-sm outline-none focus:border-[#1a1a1a] bg-transparent" />
    </div>
  );
}
