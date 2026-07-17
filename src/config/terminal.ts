export type TerminalCommand = {
  command: string;
  description: string;
  output: string[];
};

export const terminalCommands: TerminalCommand[] = [
  {
    command: "help",
    description: "List available commands",
    output: [
      "help      list command reference",
      "about     read the designer / engineer note",
      "play      open liminal playlist",
      "mood      print the visual direction",
      "projects  list current showcase areas",
      "contact   expose contact vector",
      "clear     wipe terminal output",
    ],
  },
  {
    command: "about",
    description: "Read the short profile",
    output: [
      "Das builds interfaces that feel photographed, not manufactured.",
      "Focus: frontend craft, interaction design, shader-backed atmosphere.",
    ],
  },
  {
    command: "play",
    description: "Open the playlist rail",
    output: [
      "playlist signal routed to right rail",
      "tip: use the vinyl chips to change tone",
    ],
  },
  {
    command: "mood",
    description: "Describe the art direction",
    output: [
      "dark liminal terminal",
      "quiet green glow",
      "refractive glass on critical surfaces",
      "ascii and dither where texture matters",
    ],
  },
  {
    command: "projects",
    description: "Showcase sections",
    output: [
      "signal-room  hero architecture",
      "crt-cards    component language",
      "transmission photography processing",
    ],
  },
  {
    command: "contact",
    description: "Show contact route",
    output: ["mailto:hello@dasvr.dev", "github.com/DasVR"],
  },
];
