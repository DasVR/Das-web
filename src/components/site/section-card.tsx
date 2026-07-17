import { ReactNode } from "react";

type SectionCardProps = {
  children: ReactNode;
  eyebrow: string;
  title: string;
};

export function SectionCard({ children, eyebrow, title }: SectionCardProps) {
  return (
    <section
      className="terminal-card liquid-panel glass-filtered relative overflow-hidden p-6 sm:p-7"
      style={{ filter: "url(#liquid-glass-filter)" }}
    >
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-[#7adca8]">
        {eyebrow}
      </p>
      <h2 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-[#ecfff4]">
        {title}
      </h2>
      <div className="mt-6 text-[#a3c4b3]">{children}</div>
    </section>
  );
}
