import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin",
  description: "DasDev admin dashboard.",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#0a0a0a] text-white antialiased">
        {children}
      </div>
    </AuthProvider>
  );
}
