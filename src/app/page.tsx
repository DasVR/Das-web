import { AsciiDivider } from "@/components/AsciiDivider";
import { CustomCursor } from "@/components/CustomCursor";
import { GrainOverlay } from "@/components/GrainOverlay";
import { About } from "./sections/About";
import { Contact } from "./sections/Contact";
import { CTA } from "./sections/CTA";
import { Gap } from "./sections/Gap";
import { Hero } from "./sections/Hero";
import { Method } from "./sections/Method";
import { Services } from "./sections/Services";
import { Stats } from "./sections/Stats";
import { Work } from "./sections/Work";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <GrainOverlay />
      <CustomCursor />
      <Hero />
      <Stats />
      <AsciiDivider />
      <Gap />
      <AsciiDivider />
      <Work />
      <AsciiDivider />
      <About />
      <AsciiDivider />
      <Method />
      <AsciiDivider />
      <Services />
      <CTA />
      <Contact />
    </main>
  );
}
