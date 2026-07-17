import { cn } from "@/lib/cn";

type VineProps = {
  className?: string;
  flip?: boolean;
};

export function Vine({ className, flip = false }: VineProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 180 420"
      className={cn("vine", flip && "-scale-x-100", className)}
      fill="none"
    >
      <path
        d="M25 0c-8 69 57 86 31 147-19 44-5 79 35 111 43 34 40 91 15 162"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M48 112c-32-3-39 16-35 37 25 2 40-10 35-37Z" fill="currentColor" />
      <path d="M58 173c33-9 47 7 50 28-24 9-43 1-50-28Z" fill="currentColor" />
      <path d="M82 247c-35-2-44 18-39 42 27 1 44-14 39-42Z" fill="currentColor" />
      <path d="M113 319c31-8 46 9 48 30-24 8-42-1-48-30Z" fill="currentColor" />
      <path d="M102 370c-28 4-36 23-25 43 24-4 36-19 25-43Z" fill="currentColor" />
    </svg>
  );
}
