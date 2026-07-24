import { AsciiDivider } from "@/components/AsciiDivider";
import { CustomCursor } from "@/components/CustomCursor";
import { About } from "./sections/About";
import { Contact } from "./sections/Contact";
import { Hero } from "./sections/Hero";
import { Method } from "./sections/Method";
import { Services } from "./sections/Services";
import { Work } from "./sections/Work";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <CustomCursor />
      <Hero />
      <AsciiDivider />
      <Work />
      <AsciiDivider />
      <About />
      <AsciiDivider />
      <Method />
      <AsciiDivider />
      <Services />
      <AsciiDivider />
      <Contact />
    </main>
  );
}
