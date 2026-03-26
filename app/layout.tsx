import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Outfit({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ülkü Yaman Collection | Lüks El Yapımı Sandaletler",
  description: "Türkiye'nin en seçkin lüks sandaletler koleksiyonu. El işçiliği, premium malzeme ve zamansız tasarım.",
  keywords: ["lüks sandaletler", "el yapımı", "türk tasarım", "deri sandaletler", "kadın ayakkabı"],
  openGraph: {
    title: "Ülkü Yaman Collection",
    description: "El yapımı lüks sandaletler",
    type: "website",
    locale: "tr_TR",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${serif.variable} ${sans.variable}`}>
      <body>
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
