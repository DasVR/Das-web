import { atmosphere } from "@/config/atmosphere";
import { playlist } from "@/config/playlist";

export function TextFallback() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-8 px-6 py-16 font-mono text-sm text-[#dbffe9]">
      <header className="space-y-2">
        <p>Das.web / text mode</p>
        <p>dark liminal terminal portfolio fallback</p>
      </header>

      <section className="space-y-3">
        <p>A hand-built terminal world softened by liquid glass, scanlines, and cinematic silence.</p>
        <p>
          This fallback disables the matrix rain, refraction lens, and animated
          dither layers while preserving structure and content.
        </p>
      </section>

      <section className="space-y-2">
        <p>Projects</p>
        {atmosphere.projects.map((project) => (
          <div key={project.title}>
            <p>{project.title}</p>
            <p>{project.description}</p>
          </div>
        ))}
      </section>

      <section className="space-y-2">
        <p>Playlist</p>
        {playlist.tracks.map((track) => (
          <p key={track.title}>
            {track.title} — {track.artist} ({track.mood})
          </p>
        ))}
      </section>

      <section className="space-y-2">
        <p>Contact</p>
        <p>hello@dasvr.dev</p>
        <p>github.com/DasVR</p>
      </section>
    </main>
  );
}
