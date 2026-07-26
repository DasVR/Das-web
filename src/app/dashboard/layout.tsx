import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client Dashboard",
  description: "Private client workspace for DasDev projects and care plans.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white antialiased">
      {children}
    </div>
  );
}
