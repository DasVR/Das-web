import { ReactNode } from "react";

type SectionCardProps = {
  children: ReactNode;
  eyebrow: string;
  title: string;
};

export function SectionCard({ children, eyebrow, title }: SectionCardProps) {
  return (
    <section className="weathered-card relative overflow-hidden p-7 sm:p-9">
      <div aria-hidden="true" className="absolute top-0 left-0 h-14 w-28 bg-[radial-gradient(ellipse_at_top_left,rgba(116,132,78,0.35),transparent_70%)]" />
      <p className="relative text-[0.64rem] uppercase tracking-[0.3em] text-[#c9bea1]/60">
        {eyebrow}
      </p>
      <h2 className="relative mt-5 max-w-2xl font-serif text-3xl leading-tight tracking-[-0.025em] text-[#e8e2d4] sm:text-4xl">
        {title}
      </h2>
      <div className="relative mt-7 text-[#bcb7aa]">{children}</div>
    </section>
  );
}
