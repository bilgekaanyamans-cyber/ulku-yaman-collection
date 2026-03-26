import { AuthProvider } from "@/components/providers/auth-provider";

export default function KayitLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
