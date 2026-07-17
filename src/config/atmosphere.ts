export const atmosphere = {
  colors: {
    background: "#05080b",
    backgroundSoft: "#0c1217",
    panel: "rgba(7, 18, 15, 0.58)",
    panelStrong: "rgba(10, 26, 21, 0.72)",
    panelBorder: "rgba(120, 255, 191, 0.18)",
    glow: "#6dffb0",
    glowSoft: "#a3ffd1",
    glowMuted: "#4bc18a",
    amber: "#d3a85c",
    text: "#ddffe9",
    textMuted: "#8ebba2",
    danger: "#7dffbe",
    vignette: "rgba(0, 0, 0, 0.56)",
  },
  heroAscii: [
    "      .---.                     ",
    "   .-' .-. '-.    signal_room  ",
    "  /   /   \\   \\   boot: ready  ",
    " |   |  _  |   |  mode: liminal",
    " |   | (_) |   |  glow: active ",
    "  \\   \\   /   /                ",
    "   '-. `-' .-'   > enter       ",
    "      `---'                     ",
  ],
  bootLines: [
    "[ok] cold boot vector mounted",
    "[ok] matrix bus linked",
    "[ok] scanline compositor armed",
    "[ok] dither field tuned",
    "[ok] liquid shell pressurized",
    "[ok] playlist rail online",
    "[ok] terminal overlay attached",
  ],
  skills: [
    "Design systems with taste",
    "Motion direction with restraint",
    "Shader-backed atmospheres",
    "Terminal / editorial hybrids",
  ],
  projects: [
    {
      title: "Signal Room",
      label: "Creative Direction",
      description:
        "A liminal hero system where ASCII, dither, scanlines, and liquid glass sit in the same atmosphere without fighting each other.",
    },
    {
      title: "CRT Cards",
      label: "UI System",
      description:
        "Terminal cards reimagined with refraction, soft highlights, and depth-aware blur rather than flat neon boxes.",
    },
    {
      title: "Photo Transmission",
      label: "Image Language",
      description:
        "Photography becomes processed light and mood through quantization, grain, and controlled degradation.",
    },
  ],
} as const;
