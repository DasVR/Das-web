export const atmosphere = {
  colors: {
    background: "#171b16",
    backgroundSoft: "#24291f",
    stone: "#78796b",
    moss: "#6f7c4e",
    fern: "#879563",
    light: "#e3d6b3",
    rust: "#9a6f4d",
    text: "#eee9dc",
    textMuted: "#bab5a7",
  },
  heroAscii: [
    "             .       *       .       ",
    "       .          _/\\_               ",
    "              ___/    \\___           ",
    "       ______/            \\_____     ",
    "      |  broken glass / soft rain |  ",
    "      |        .     .             |  ",
    "      |    ivy remembers the wall  |  ",
    "      |____________________________|  ",
    "        / / / /        \\ \\ \\ \\       ",
  ],
  skills: [
    "Atmospheric art direction",
    "Editorial interface systems",
    "Organic motion with restraint",
    "Photography-led composition",
  ],
  projects: [
    {
      title: "The room after rain",
      label: "Atmospheric direction",
      description:
        "A quiet digital ruin composed with the same care as a photograph: light first, then shape, texture, and silence.",
    },
    {
      title: "Window studies",
      label: "Interface system",
      description:
        "Frosted, refractive surfaces feel like old glass still holding the reflection of a world growing back.",
    },
    {
      title: "Things that remain",
      label: "Image language",
      description:
        "Faded typography and ASCII traces act like abandoned signage—evidence of people, softened by moss and time.",
    },
  ],
} as const;
