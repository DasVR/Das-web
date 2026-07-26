import { pageMetadata } from "@/lib/site";
import { AdminOverview } from "./AdminOverview";

export const metadata = pageMetadata({
  title: "Admin Overview",
  description: "DasDev admin dashboard.",
  path: "/admin",
  noIndex: true,
});

export default function AdminPage() {
  return <AdminOverview />;
}
