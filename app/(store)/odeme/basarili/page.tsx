import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function CheckoutSuccessPage({ searchParams }: { searchParams: { order?: string } }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-5">
      <div className="text-center animate-fade-in">
        <CheckCircle size={64} className="mx-auto mb-6 text-[#2d6a4f]" />
        <h1 className="font-serif text-3xl mb-3">Siparişiniz Alındı!</h1>
        {searchParams.order && (
          <p className="text-taupe mb-2">Sipariş numaranız: <strong className="text-[#1a1a1a]">{searchParams.order}</strong></p>
        )}
        <p className="text-sm text-taupe mb-8 max-w-md mx-auto">
          Siparişinizin onay bilgileri e-posta adresinize gönderildi. Hesabınızdan sipariş durumunuzu takip edebilirsiniz.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/hesabim/siparisler" className="px-8 py-3 bg-[#1a1a1a] text-white text-xs tracking-wide2 uppercase hover:bg-[#333]">
            Siparişlerim
          </Link>
          <Link href="/sayfa" className="px-8 py-3 border border-[#1a1a1a] text-xs tracking-wide2 uppercase hover:bg-[#1a1a1a] hover:text-white transition-all">
            Alışverişe Devam
          </Link>
        </div>
      </div>
    </div>
  );
}
