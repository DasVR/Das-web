import { pageMetadata } from "@/lib/site";
import { ResetContent } from "./ResetContent";

export const metadata = pageMetadata({
  title: "Reset Access Key",
  description: "Set a new access key for the DasDev client portal.",
  path: "/dashboard/reset",
  noIndex: true,
});

export default function ResetPage() {
  return <ResetContent />;
}
