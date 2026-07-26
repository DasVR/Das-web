import { pageMetadata } from "@/lib/site";
import { ScrambleDemoContent } from "./ScrambleDemoContent";

// Raw interaction demo: crawlable so /lab links resolve, but kept out of the
// index because the page is a motion sandbox rather than real content.
export const metadata = pageMetadata({
  title: "Text Scramble Demo",
  description:
    "Interaction study — scroll-triggered text scramble variants used across the DasDev site.",
  path: "/lab/text-scramble-demo",
  noIndex: true,
});

export default function TextScrambleDemoPage() {
  return <ScrambleDemoContent />;
}
