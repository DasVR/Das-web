import { pageMetadata } from "@/lib/site";
import { AdminClients } from "./AdminClients";

export const metadata = pageMetadata({
  title: "Admin Clients",
  description: "Manage DasDev clients.",
  path: "/admin/clients",
  noIndex: true,
});

export default function AdminClientsPage() {
  return <AdminClients />;
}
