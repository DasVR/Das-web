import { SectionHeader } from "@/components/SectionHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { RepoCard } from "@/components/RepoCard";
import { getLabRepos } from "@/lib/github";
import { LabStudies } from "./LabStudies";

export const metadata = {
  title: "Lab",
  description:
    "Craft studies and open-source repositories — motion, tooling, and interaction experiments in public.",
};

export default async function LabPage() {
  const repos = await getLabRepos();
  const live = repos.filter((repo) => !repo.stale).length;

  return (
    <main className="min-h-screen">
      <section className="px-6 pb-16 pt-32 md:px-12 md:pb-20 md:pt-40 lg:px-24">
        <SectionHeader
          label="Lab"
          index="03"
          title="Personal lab — craft studies and code in public."
          meta={
            <>
              <span className="text-neutral-300">
                {repos.length} repos · 6 studies
              </span>
              <span>Pulled from GitHub at build time</span>
              <span>No WebGL — transform &amp; opacity only</span>
            </>
          }
        />

        <div className="mb-6 flex items-baseline justify-between gap-4 border-b border-neutral-900 pb-4">
          <h3 className="font-mono text-xs tracking-widest text-neutral-400">
            / REPOSITORIES
          </h3>
          <p className="font-mono text-[10px] tracking-widest text-neutral-600">
            {live > 0 ? "LIVE FROM GITHUB" : "CACHED"}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
          {repos.map((repo, i) => (
            <RepoCard key={repo.fullName} repo={repo} index={i} />
          ))}
        </div>
      </section>

      <section className="px-6 pb-20 md:px-12 md:pb-32 lg:px-24">
        <div className="mb-6 flex items-baseline justify-between gap-4 border-b border-neutral-900 pb-4">
          <h3 className="font-mono text-xs tracking-widest text-neutral-400">
            / INTERFACE STUDIES
          </h3>
          <p className="font-mono text-[10px] tracking-widest text-neutral-600">
            SHIPPED INTO THIS SITE
          </p>
        </div>
        <LabStudies />
      </section>

      <SiteFooter />
    </main>
  );
}
