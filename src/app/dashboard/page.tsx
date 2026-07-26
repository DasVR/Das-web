import { pageMetadata } from "@/lib/site";
import { DashboardContent } from "./DashboardContent";

export const metadata = pageMetadata({
  title: "Client Dashboard",
  description: "Your DasDev projects, updates, files, and care plan.",
  path: "/dashboard",
  noIndex: true,
});

export default function DashboardPage() {
  return <DashboardContent />;
}
