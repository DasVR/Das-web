export function CrtOverlay() {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-30 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02)_0,rgba(255,255,255,0.02)_1px,transparent_1px,transparent_3px)] opacity-25 mix-blend-screen"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-30 bg-[radial-gradient(circle_at_center,transparent_42%,rgba(0,0,0,0.3)_100%)]"
      />
    </>
  );
}
