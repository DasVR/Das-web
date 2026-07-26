#!/usr/bin/env python3
"""Generate DasDev brand assets (favicons, app icons, OG image) into public/.

The wordmark is drawn from the same 5x7 dot-matrix glyphs used by
src/components/DotMatrix.tsx, so the static assets match what renders on the
site. Static export cannot generate OG images at request time, so these are
built once and committed.

Run: python3 scripts/generate-brand-assets.py
Requires: Pillow
"""
from __future__ import annotations

import os

from PIL import Image, ImageDraw, ImageFilter, ImageFont

BG = (10, 10, 10)
FG = (245, 245, 245)
ACCENT = (249, 115, 22)
MUTED = (140, 140, 140)

PUBLIC = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public")

# 5x7 glyphs, mirrored from src/components/DotMatrix.tsx
GLYPHS: dict[str, list[str]] = {
    "A": ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
    "D": ["11110", "10001", "10001", "10001", "10001", "10001", "11110"],
    "E": ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
    "S": ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
    "V": ["10001", "10001", "10001", "10001", "10001", "01010", "00100"],
}

FONT_CANDIDATES = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
]
MONO_CANDIDATES = [
    "/usr/share/fonts/truetype/jetbrains-mono/JetBrainsMono-Regular.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf",
]


def load_font(candidates: list[str], size: int) -> ImageFont.FreeTypeFont:
    for path in candidates:
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def draw_wordmark(
    draw: ImageDraw.ImageDraw,
    text: str,
    origin: tuple[int, int],
    dot: int,
    gap: int,
    letter_gap: int,
    color: tuple[int, int, int] = FG,
) -> tuple[int, int]:
    """Draw text as dot matrix. Returns the drawn size."""
    x0, y0 = origin
    cursor = x0
    for char in text.upper():
        glyph = GLYPHS[char]
        for row, bits in enumerate(glyph):
            for col, bit in enumerate(bits):
                if bit != "1":
                    continue
                cx = cursor + col * (dot + gap)
                cy = y0 + row * (dot + gap)
                draw.ellipse([cx, cy, cx + dot, cy + dot], fill=color)
        cursor += 5 * (dot + gap) + letter_gap
    width = cursor - x0 - letter_gap
    height = 7 * (dot + gap) - gap
    return width, height


def wordmark_size(text: str, dot: int, gap: int, letter_gap: int) -> tuple[int, int]:
    width = len(text) * (5 * (dot + gap) + letter_gap) - letter_gap
    height = 7 * (dot + gap) - gap
    return width, height


def make_icon(size: int) -> Image.Image:
    """Square app icon: a single dot-matrix D, centered."""
    img = Image.new("RGB", (size, size), BG)
    draw = ImageDraw.Draw(img)

    # Scale the 5x7 grid to roughly 62% of the canvas.
    target = int(size * 0.62)
    unit = max(1, target // 7)
    dot = max(1, int(unit * 0.72))
    gap = max(0, unit - dot)

    w, h = wordmark_size("D", dot, gap, 0)
    draw_wordmark(draw, "D", ((size - w) // 2, (size - h) // 2), dot, gap, 0)
    return img


def make_og() -> Image.Image:
    """1200x630 social card."""
    w, h = 1200, 630
    img = Image.new("RGB", (w, h), BG)
    draw = ImageDraw.Draw(img)

    # Faint dot grid, echoing the site background.
    for y in range(0, h, 26):
        for x in range(0, w, 26):
            draw.ellipse([x, y, x + 2, y + 2], fill=(26, 26, 26))

    # Accent glow in the top-left, matching the hero radial gradient. Drawn at
    # low resolution and blurred so it falls off smoothly instead of showing a
    # hard ellipse edge.
    glow = Image.new("RGB", (w // 4, h // 4), BG)
    gdraw = ImageDraw.Draw(glow)
    gdraw.ellipse([-80, -105, 180, 80], fill=(74, 40, 16))
    glow = glow.filter(ImageFilter.GaussianBlur(38)).resize((w, h), Image.LANCZOS)
    img = Image.blend(img, glow, 0.7)
    draw = ImageDraw.Draw(img)

    mono_small = load_font(MONO_CANDIDATES, 22)
    body = load_font(FONT_CANDIDATES, 34)
    meta = load_font(MONO_CANDIDATES, 20)

    margin = 84

    draw.text((margin, 74), "BASED IN FLORIDA · WORKING WIDELY", font=mono_small, fill=MUTED)

    dot, gap, letter_gap = 13, 5, 15
    ww, wh = wordmark_size("DASDEV", dot, gap, letter_gap)
    draw_wordmark(draw, "DASDEV", (margin, 150), dot, gap, letter_gap)

    draw.text(
        (margin, 150 + wh + 60),
        "Websites that speak your brand's voice.",
        font=body,
        fill=FG,
    )
    draw.text(
        (margin, 150 + wh + 112),
        "Web design, branding, and ongoing care for small businesses.",
        font=body,
        fill=MUTED,
    )

    draw.line([margin, h - 108, w - margin, h - 108], fill=(38, 38, 38), width=1)
    draw.text((margin, h - 82), "dasdev.net", font=meta, fill=FG)

    right = "hello@dasdev.net"
    rw = draw.textlength(right, font=meta)
    draw.text((w - margin - rw, h - 82), right, font=meta, fill=ACCENT)

    return img


def make_favicon_svg() -> str:
    """Crisp scalable favicon: dot-matrix D on the brand background."""
    dot_r = 3.1
    step = 8
    pad = 8
    rows = GLYPHS["D"]
    circles = []
    for row, bits in enumerate(rows):
        for col, bit in enumerate(bits):
            if bit != "1":
                continue
            cx = pad + col * step + step / 2
            cy = pad + row * step + step / 2
            circles.append(
                f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{dot_r}" fill="#f5f5f5"/>'
            )
    body = "\n  ".join(circles)
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 72" width="64" height="72">\n'
        '  <rect width="64" height="72" fill="#0a0a0a"/>\n'
        f"  {body}\n"
        "</svg>\n"
    )


def main() -> None:
    os.makedirs(PUBLIC, exist_ok=True)

    with open(os.path.join(PUBLIC, "favicon.svg"), "w") as f:
        f.write(make_favicon_svg())

    ico = make_icon(64)
    ico.save(
        os.path.join(PUBLIC, "favicon.ico"),
        sizes=[(16, 16), (32, 32), (48, 48)],
    )

    make_icon(180).save(os.path.join(PUBLIC, "apple-touch-icon.png"))
    make_icon(192).save(os.path.join(PUBLIC, "icon-192.png"))
    make_icon(512).save(os.path.join(PUBLIC, "icon-512.png"))
    make_og().save(os.path.join(PUBLIC, "og.png"))

    print("Wrote favicon.svg, favicon.ico, apple-touch-icon.png, icon-192.png, icon-512.png, og.png")


if __name__ == "__main__":
    main()
