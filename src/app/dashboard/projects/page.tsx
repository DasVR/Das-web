import { pageMetadata } from "@/lib/site";
import { ProjectDetailContent } from "./ProjectDetailContent";

export const metadata = pageMetadata({
  title: "Project Details",
  description: "Full project spec for DasDev clients.",
  path: "/dashboard/projects",
  noIndex: true,
});

export default function DashboardProjectPage() {
  return <ProjectDetailContent />;
}
