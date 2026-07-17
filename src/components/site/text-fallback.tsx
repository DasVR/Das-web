import { atmosphere } from "@/config/atmosphere";

export function TextFallback() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-10 px-6 py-16 text-sm leading-7 text-[#d9d3c5]">
      <header className="space-y-2">
        <p className="font-serif text-3xl">Das.web</p>
        <p>quiet work / living archive</p>
      </header>

      <section className="space-y-3">
        <p>Beautiful things grow back.</p>
        <p>
          A portfolio built like an abandoned room after rain—soft light on old
          surfaces, nature at the edges, and careful details waiting to be found.
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
        <p>Contact</p>
        <p>hello@dasvr.dev</p>
        <p>github.com/DasVR</p>
      </section>
    </main>
  );
}
