import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AuthProvider } from "@/components/providers/auth-provider";
import { AdminSidebar } from "@/components/admin/sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") redirect("/giris");

  return (
    <AuthProvider>
      <div className="flex min-h-screen bg-[#f4f3f1]">
        <AdminSidebar user={session.user} />
        <main className="flex-1 ml-[250px] p-8 max-md:ml-[60px] max-md:p-4">{children}</main>
      </div>
    </AuthProvider>
  );
}
