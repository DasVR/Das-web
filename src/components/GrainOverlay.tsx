/** A24 cinematic grain — subtle animated position for living texture */
export function GrainOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[60] opacity-[0.05] mix-blend-soft-light"
      aria-hidden="true"
    >
      <div className="grain-anim h-full w-full">
        <svg className="h-[200%] w-[200%]" xmlns="http://www.w3.org/2000/svg">
          <filter id="grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.85"
              numOctaves="4"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain)" />
        </svg>
      </div>
    </div>
  );
}
