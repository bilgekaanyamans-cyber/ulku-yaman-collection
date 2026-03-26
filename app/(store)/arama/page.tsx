"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { ProductCard } from "@/components/store/product-card";
import Link from "next/link";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const [query, setQuery] = useState(q);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    setLoading(true);
    const timer = setTimeout(() => {
      fetch(`/api/products?search=${encodeURIComponent(query)}&limit=20`)
        .then(r => r.json())
        .then(d => setResults(d.products || []))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-16 animate-fade-in">
      <div className="max-w-xl mx-auto mb-12">
        <div className="flex items-center gap-3 border-b-2 border-[#1a1a1a] pb-3">
          <Search size={20} className="text-taupe" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Ürün, renk veya kategori ara..."
            className="flex-1 text-xl font-serif outline-none bg-transparent"
            autoFocus
          />
        </div>
      </div>

      {loading && <p className="text-center text-taupe">Aranıyor...</p>}

      {!loading && query && results.length === 0 && (
        <div className="text-center py-16">
          <p className="text-lg text-taupe mb-2">&ldquo;{query}&rdquo; için sonuç bulunamadı</p>
          <p className="text-sm text-taupe">Farklı anahtar kelimeler deneyin</p>
        </div>
      )}

      {results.length > 0 && (
        <>
          <p className="text-sm text-taupe mb-8">{results.length} sonuç bulundu</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
            {results.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </>
      )}

      {!query && (
        <div className="text-center py-16">
          <p className="text-taupe mb-4">Ne aramak istiyorsunuz?</p>
          <div className="flex flex-wrap justify-center gap-3">
            {["Deri Sandaletler","Gladyatör","Metalik","Süet","El Yapımı"].map(t => (
              <button key={t} onClick={() => setQuery(t)} className="px-4 py-2 border border-black/15 text-sm hover:border-black transition-colors">{t}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
