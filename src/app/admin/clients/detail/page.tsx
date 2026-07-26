import { pageMetadata } from "@/lib/site";
import { AdminClientDetail } from "./AdminClientDetail";

export const metadata = pageMetadata({
  title: "Client Record",
  description: "Full DasDev client record.",
  path: "/admin/clients/detail",
  noIndex: true,
});

export default function AdminClientDetailPage() {
  return <AdminClientDetail />;
}
