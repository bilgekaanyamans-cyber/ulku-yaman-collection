import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white pt-16 pb-8 px-5 md:px-10 mt-20">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <h3 className="font-serif text-xl tracking-luxury uppercase mb-4">Ülkü Yaman</h3>
          <p className="text-sm leading-relaxed text-white/50 max-w-[300px]">
            Türkiye&apos;nin en seçkin lüks sandaletler koleksiyonu. El işçiliği, premium malzeme ve zamansız tasarım.
          </p>
        </div>

        <div>
          <h4 className="text-[10px] font-medium tracking-wide2 uppercase mb-5 text-white/40">Mağaza</h4>
          <ul className="space-y-2.5">
            <FooterLink href="/sayfa">Sandaletler</FooterLink>
            <FooterLink href="/sayfa?sort=newest">Yeni Gelenler</FooterLink>
            <FooterLink href="/sayfa?sort=popular">En Çok Satanlar</FooterLink>
          </ul>
        </div>

        <div>
          <h4 className="text-[10px] font-medium tracking-wide2 uppercase mb-5 text-white/40">Bilgi</h4>
          <ul className="space-y-2.5">
            <FooterLink href="/hakkimizda">Hakkımızda</FooterLink>
            <FooterLink href="/kargo-iade">Kargo & İade</FooterLink>
            <FooterLink href="/beden-rehberi">Beden Rehberi</FooterLink>
            <FooterLink href="/kvkk">KVKK Aydınlatma</FooterLink>
            <FooterLink href="/mesafeli-satis">Mesafeli Satış Sözleşmesi</FooterLink>
          </ul>
        </div>

        <div>
          <h4 className="text-[10px] font-medium tracking-wide2 uppercase mb-5 text-white/40">İletişim</h4>
          <ul className="space-y-2.5">
            <li className="text-sm text-white/70">info@ulkuyaman.com</li>
            <li className="text-sm text-white/70">+90 212 555 00 00</li>
            <FooterLink href="https://instagram.com/ulkuyaman">Instagram</FooterLink>
            <FooterLink href="https://wa.me/902125550000">WhatsApp</FooterLink>
          </ul>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto mt-10 pt-6 border-t border-white/10 text-center text-[11px] text-white/30">
        © 2026 Ülkü Yaman Collection. Tüm hakları saklıdır.
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-sm text-white/70 hover:text-white transition-colors">
        {children}
      </Link>
    </li>
  );
}
