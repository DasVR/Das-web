import { Hero } from "./sections/Hero";
import { Work } from "./sections/Work";
import { Method } from "./sections/Method";
import { Services } from "./sections/Services";
import { Contact } from "./sections/Contact";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <Hero />
      <Work />
      <Method />
      <Services />
      <Contact />
    </main>
  );
}
