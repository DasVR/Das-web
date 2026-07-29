import { pageMetadata } from "@/lib/site";
import { AdminInbox } from "./AdminInbox";

export const metadata = pageMetadata({
  title: "Admin Inbox",
  description: "DasDev admin dashboard.",
  path: "/admin",
  noIndex: true,
});

export default function AdminPage() {
  return <AdminInbox />;
}
