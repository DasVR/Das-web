import { pageMetadata } from "@/lib/site";
import { AdminLeads } from "./AdminLeads";

export const metadata = pageMetadata({
  title: "Admin Leads",
  description: "Inbound leads and access requests.",
  path: "/admin/leads",
  noIndex: true,
});

export default function AdminLeadsPage() {
  return <AdminLeads />;
}
