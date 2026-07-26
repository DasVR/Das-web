export type ProjectKind = "personal" | "client" | "cta";

export type Project = {
  name: string;
  tag: string;
  /** Right-side label — honest status, not fake conversion metrics */
  label: string;
  result: string;
  kind: ProjectKind;
  href?: string;
  indexLabel?: string;
  image?: string;
  imageAlt?: string;
};

export const projects: Project[] = [
  {
    name: "DasDev — Portfolio",
    tag: "Personal Project",
    label: "Live",
    result:
      "This site — personal brand, portfolio, and services for small businesses. Built with Next.js, Tailwind, and Framer Motion.",
    kind: "personal",
    href: "/",
    indexLabel: "SS /01",
  },
  {
    name: "Dot Matrix Studies",
    tag: "Experiment",
    label: "Lab",
    result:
      "Computational wordmark experiments — SVG bitmaps, flicker timing, and editorial type as interface.",
    kind: "personal",
    href: "/lab",
    indexLabel: "SS /02",
  },
  {
    name: "Your project here",
    tag: "Open slot",
    label: "Hire",
    result:
      "Case studies arriving as real work ships. Want to be next? Tell me about your business.",
    kind: "cta",
    href: "/contact",
    indexLabel: "SS /03",
  },
];

export const featuredProjects = projects.slice(0, 2);
