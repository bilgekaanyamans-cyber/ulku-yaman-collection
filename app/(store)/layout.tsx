import { AuthProvider } from "@/components/providers/auth-provider";
import { Navbar } from "@/components/store/navbar";
import { Footer } from "@/components/store/footer";
import { WhatsAppButton } from "@/components/store/whatsapp-button";
import { CookieBanner } from "@/components/store/cookie-banner";
import { GoogleAnalytics } from "@/components/store/google-analytics";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <GoogleAnalytics />
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <WhatsAppButton />
      <CookieBanner />
    </AuthProvider>
  );
}
