import Link from "next/link";
import { XCircle } from "lucide-react";

export default function CheckoutFailPage({ searchParams }: { searchParams: { reason?: string } }) {
  const reasons: Record<string, string> = {
    "3ds_failed": "3D Secure doğrulaması başarısız oldu.",
    "payment_failed": "Ödeme işlemi tamamlanamadı.",
    "server_error": "Bir sunucu hatası oluştu.",
  };
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-5">
      <div className="text-center animate-fade-in">
        <XCircle size={64} className="mx-auto mb-6 text-[#c1121f]" />
        <h1 className="font-serif text-3xl mb-3">Ödeme Başarısız</h1>
        <p className="text-sm text-taupe mb-8 max-w-md mx-auto">
          {reasons[searchParams.reason || ""] || "Ödeme işlemi sırasında bir sorun oluştu."} Lütfen tekrar deneyin veya farklı bir ödeme yöntemi kullanın.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/sepet" className="px-8 py-3 bg-[#1a1a1a] text-white text-xs tracking-wide2 uppercase hover:bg-[#333]">Sepete Dön</Link>
          <Link href="/" className="px-8 py-3 border border-[#1a1a1a] text-xs tracking-wide2 uppercase hover:bg-[#1a1a1a] hover:text-white transition-all">Ana Sayfa</Link>
        </div>
      </div>
    </div>
  );
}
