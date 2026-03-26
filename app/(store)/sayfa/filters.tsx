"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, ChevronUp, X, SlidersHorizontal } from "lucide-react";

type Props = {
  colors: { color: string; name: string }[];
  sizes: number[];
  minPrice: number;
  maxPrice: number;
  currentFilters: Record<string, string | undefined>;
};

export function FilterSidebar({ colors, sizes, minPrice, maxPrice, currentFilters }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSections, setOpenSections] = useState({ color: true, size: true, price: true });

  const activeColor = currentFilters.color || "";
  const activeSize = currentFilters.size || "";
  const activeMin = currentFilters.minPrice || "";
  const activeMax = currentFilters.maxPrice || "";
  const hasFilters = !!(activeColor || activeSize || activeMin || activeMax);

  const applyFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    router.push(`/sayfa?${params.toString()}`);
  };

  const clearAll = () => router.push("/sayfa");

  const toggleSection = (s: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [s]: !prev[s] }));
  };

  const sidebar = (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-[#8b7d6b]" />
          <span className="text-[11px] tracking-[2px] uppercase font-medium">Filtreler</span>
        </div>
        {hasFilters && (
          <button onClick={clearAll} className="text-[11px] text-[#c1121f] underline hover:no-underline">
            Temizle
          </button>
        )}
      </div>

      {/* Active filters */}
      {hasFilters && (
        <div className="flex flex-wrap gap-2 mb-6 pb-6 border-b border-black/[0.08]">
          {activeColor && (
            <button onClick={() => applyFilter("color", "")} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f5f0eb] text-[11px] tracking-wide hover:bg-[#e8e0d6] transition-colors">
              {activeColor} <X size={12} />
            </button>
          )}
          {activeSize && (
            <button onClick={() => applyFilter("size", "")} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f5f0eb] text-[11px] tracking-wide hover:bg-[#e8e0d6] transition-colors">
              Beden: {activeSize} <X size={12} />
            </button>
          )}
          {(activeMin || activeMax) && (
            <button onClick={() => { applyFilter("minPrice", ""); applyFilter("maxPrice", ""); }} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f5f0eb] text-[11px] tracking-wide hover:bg-[#e8e0d6] transition-colors">
              Fiyat filtresi <X size={12} />
            </button>
          )}
        </div>
      )}

      {/* ── Renk ── */}
      <div className="border-b border-black/[0.08] pb-5 mb-5">
        <button onClick={() => toggleSection("color")} className="flex items-center justify-between w-full mb-4">
          <span className="text-[11px] tracking-[2px] uppercase font-medium">Renk</span>
          {openSections.color ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {openSections.color && (
          <div className="space-y-2.5">
            {colors.map(c => (
              <button
                key={c.name}
                onClick={() => applyFilter("color", activeColor === c.name ? "" : c.name)}
                className={`flex items-center gap-3 w-full text-left py-1 group transition-colors ${activeColor === c.name ? "font-medium" : ""}`}
              >
                <span
                  className={`w-5 h-5 rounded-full border-[1.5px] flex-shrink-0 transition-all ${
                    activeColor === c.name
                      ? "ring-2 ring-white ring-offset-2 ring-offset-[#1a1a1a] border-transparent"
                      : "border-black/15 group-hover:border-black/40"
                  }`}
                  style={{ backgroundColor: c.color }}
                />
                <span className="text-sm">{c.name}</span>
                {activeColor === c.name && <span className="ml-auto text-[10px] text-[#8b7d6b]">✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Beden ── */}
      <div className="border-b border-black/[0.08] pb-5 mb-5">
        <button onClick={() => toggleSection("size")} className="flex items-center justify-between w-full mb-4">
          <span className="text-[11px] tracking-[2px] uppercase font-medium">Beden</span>
          {openSections.size ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {openSections.size && (
          <div className="grid grid-cols-4 gap-2">
            {sizes.map(s => (
              <button
                key={s}
                onClick={() => applyFilter("size", activeSize === String(s) ? "" : String(s))}
                className={`py-2.5 text-sm border transition-all ${
                  activeSize === String(s)
                    ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                    : "border-black/15 hover:border-black/40"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Fiyat ── */}
      <div className="pb-5">
        <button onClick={() => toggleSection("price")} className="flex items-center justify-between w-full mb-4">
          <span className="text-[11px] tracking-[2px] uppercase font-medium">Fiyat Aralığı</span>
          {openSections.price ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {openSections.price && (
          <div>
            <div className="flex gap-3 mb-3">
              <div className="flex-1">
                <label className="text-[10px] text-[#8b7d6b] mb-1 block">Min (₺)</label>
                <input
                  type="number"
                  placeholder={String(minPrice)}
                  defaultValue={activeMin}
                  onBlur={e => applyFilter("minPrice", e.target.value)}
                  className="w-full px-3 py-2 border border-black/15 text-sm outline-none focus:border-[#1a1a1a] bg-transparent"
                />
              </div>
              <div className="flex items-end pb-2 text-[#8b7d6b]">—</div>
              <div className="flex-1">
                <label className="text-[10px] text-[#8b7d6b] mb-1 block">Max (₺)</label>
                <input
                  type="number"
                  placeholder={String(maxPrice)}
                  defaultValue={activeMax}
                  onBlur={e => applyFilter("maxPrice", e.target.value)}
                  className="w-full px-3 py-2 border border-black/15 text-sm outline-none focus:border-[#1a1a1a] bg-transparent"
                />
              </div>
            </div>
            {/* Quick price filters */}
            <div className="space-y-1.5 mt-3">
              {[
                { l: "₺5.000 altı", min: "", max: "5000" },
                { l: "₺5.000 — ₺10.000", min: "5000", max: "10000" },
                { l: "₺10.000 — ₺15.000", min: "10000", max: "15000" },
                { l: "₺15.000 üzeri", min: "15000", max: "" },
              ].map(p => (
                <button
                  key={p.l}
                  onClick={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    if (p.min) params.set("minPrice", p.min); else params.delete("minPrice");
                    if (p.max) params.set("maxPrice", p.max); else params.delete("maxPrice");
                    params.delete("page");
                    router.push(`/sayfa?${params.toString()}`);
                  }}
                  className="block w-full text-left text-sm py-1.5 text-[#8b7d6b] hover:text-[#1a1a1a] transition-colors"
                >
                  {p.l}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-[240px] flex-shrink-0">
        {sidebar}
      </aside>

      {/* Mobile filter button + drawer */}
      <div className="lg:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 px-6 py-3 bg-[#1a1a1a] text-white text-[11px] tracking-[2px] uppercase shadow-lg flex items-center gap-2"
        >
          <SlidersHorizontal size={14} /> Filtreler {hasFilters && `(${[activeColor, activeSize, activeMin || activeMax].filter(Boolean).length})`}
        </button>

        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
            <div className="relative bg-white w-[300px] max-w-[85vw] h-full overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-6">
                <span className="font-medium text-sm">Filtreler</span>
                <button onClick={() => setMobileOpen(false)}><X size={20} /></button>
              </div>
              {sidebar}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
