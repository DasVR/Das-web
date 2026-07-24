import { AsciiDivider } from "@/components/AsciiDivider";
import { CustomCursor } from "@/components/CustomCursor";
import { GrainOverlay } from "@/components/GrainOverlay";
import { SmoothScroll } from "@/components/SmoothScroll";
import { About } from "./sections/About";
import { Contact } from "./sections/Contact";
import { CTA } from "./sections/CTA";
import { Experiments } from "./sections/Experiments";
import { Gap } from "./sections/Gap";
import { Hero } from "./sections/Hero";
import { Method } from "./sections/Method";
import { Services } from "./sections/Services";
import { Stats } from "./sections/Stats";
import { Work } from "./sections/Work";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <SmoothScroll />
      <GrainOverlay />
      <CustomCursor />
      <Hero />
      <AsciiDivider />
      <Work />
      <AsciiDivider />
      <Experiments />
      <AsciiDivider />
      <About />
      <AsciiDivider />
      <Gap />
      <AsciiDivider />
      <Method />
      <AsciiDivider />
      <Services />
      <Stats />
      <CTA />
      <Contact />
    </main>
  );
}
