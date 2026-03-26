"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { MapPin, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const { data: session } = useSession();

  const load = () => fetch("/api/addresses").then(r => r.json()).then(setAddresses);
  useEffect(() => { if (session) load(); }, [session]);

  const handleDelete = async (id: string) => {
    if (!confirm("Bu adresi silmek istiyor musunuz?")) return;
    await fetch("/api/addresses", { method: "DELETE", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ addressId: id }) });
    toast.success("Adres silindi");
    load();
  };

  return (
    <div className="max-w-[800px] mx-auto px-5 md:px-10 py-16 animate-fade-in">
      <Link href="/hesabim" className="text-xs text-taupe hover:text-[#1a1a1a] tracking-wide">&larr; Hesabım</Link>
      <h1 className="font-serif text-4xl mt-4 mb-10">Adreslerim</h1>
      {addresses.length === 0 ? (
        <p className="text-taupe text-center py-12">Henüz kayıtlı adresiniz yok. Sipariş verirken adres otomatik kaydedilir.</p>
      ) : (
        <div className="grid gap-4">
          {addresses.map((a: any) => (
            <div key={a.id} className="border border-black/[0.08] p-5 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-2"><MapPin size={14} className="text-taupe" /><span className="font-medium text-sm">{a.title}</span>{a.isDefault && <span className="text-[10px] bg-green-50 text-green-800 px-2 py-0.5">Varsayılan</span>}</div>
                <p className="text-sm">{a.firstName} {a.lastName}</p>
                <p className="text-sm text-taupe">{a.address}</p>
                <p className="text-sm text-taupe">{a.district}, {a.city} {a.zipCode}</p>
                <p className="text-sm text-taupe">{a.phone}</p>
              </div>
              <button onClick={() => handleDelete(a.id)} className="text-taupe hover:text-[#c1121f]"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
