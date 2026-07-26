import { pageMetadata } from "@/lib/site";
import { AdminMessages } from "./AdminMessages";

export const metadata = pageMetadata({
  title: "Contact Clients",
  description: "Message DasDev clients.",
  path: "/admin/messages",
  noIndex: true,
});

export default function AdminMessagesPage() {
  return <AdminMessages />;
}
