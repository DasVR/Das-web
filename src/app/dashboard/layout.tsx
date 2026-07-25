import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard · Arriq",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {children}
    </div>
  );
}
