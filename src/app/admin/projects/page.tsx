import { pageMetadata } from "@/lib/site";
import { AdminProjects } from "./AdminProjects";

export const metadata = pageMetadata({
  title: "Admin Projects",
  description: "Cross-client project board.",
  path: "/admin/projects",
  noIndex: true,
});

export default function AdminProjectsPage() {
  return <AdminProjects />;
}
