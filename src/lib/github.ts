/**
 * Curated GitHub repos for the Lab page.
 *
 * Data is fetched at BUILD time (the site is a static export), so visitors
 * never hit the GitHub API. Edit `LAB_REPOS` to choose what shows up —
 * `blurb` overrides the repo description when you want tighter copy.
 *
 * Set GITHUB_TOKEN in the build environment to lift the 60 req/hr
 * unauthenticated limit. Fetch failures fall back to the local config so a
 * build never breaks on a rate limit or offline runner.
 */

export type LabRepoConfig = {
  /** owner/name */
  repo: string;
  /** Display name override */
  title?: string;
  /** Copy override — beats GitHub's description */
  blurb?: string;
  /** Pin to the front of the grid */
  featured?: boolean;
};

export const LAB_REPOS: LabRepoConfig[] = [
  {
    repo: "DasVR/RouteSim",
    title: "RouteSim",
    blurb:
      "Route-based iOS location simulation for developer testing — walk, bike, drive, and transit modes with a MapKit route editor.",
    featured: true,
  },
  {
    repo: "DasVR/macos-iso-builder",
    title: "macOS ISO Builder",
    blurb:
      "Builds bootable macOS installer images straight from Apple's servers via GitHub Actions — no Mac required.",
    featured: true,
  },
  {
    repo: "DasVR/Project-Zomboid-Web-Panel",
    title: "Zomboid Web Panel",
    blurb:
      "Browser-based control panel for dedicated game servers — start, stop, and monitor from anywhere.",
  },
  {
    repo: "DasVR/Nexus-Education",
    title: "Nexus Education",
    blurb: "An educational AI assistant built to teach rather than answer.",
  },
  {
    repo: "DasVR/Modpack-Designer",
    title: "Modpack Designer",
    blurb:
      "Local-first Minecraft modpack generator wired into the Modrinth and CurseForge APIs.",
  },
  {
    repo: "DasVR/Das-web",
    title: "This site",
    blurb:
      "The portfolio you're reading — Next.js, Tailwind, and Framer Motion, shipped in public.",
  },
];

export type LabRepo = {
  name: string;
  fullName: string;
  url: string;
  description: string;
  language: string | null;
  stars: number;
  forks: number;
  topics: string[];
  pushedAt: string | null;
  /** Commits per week, oldest → newest. Empty when unavailable. */
  activity: number[];
  /** True when GitHub data was unavailable and config copy is showing */
  stale: boolean;
};

const API = "https://api.github.com";
const WEEKS = 26;

function headers(): HeadersInit {
  const base: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "dasdev-portfolio-build",
  };
  const token = process.env.GITHUB_TOKEN;
  return token ? { ...base, Authorization: `Bearer ${token}` } : base;
}

function fallback(config: LabRepoConfig): LabRepo {
  const name = config.repo.split("/")[1] ?? config.repo;
  return {
    name: config.title ?? name,
    fullName: config.repo,
    url: `https://github.com/${config.repo}`,
    description: config.blurb ?? "",
    language: null,
    stars: 0,
    forks: 0,
    topics: [],
    pushedAt: null,
    activity: [],
    stale: true,
  };
}

/** Bucket recent commits into weekly counts for the dot-matrix sparkline */
function bucketCommits(commits: { commit?: { author?: { date?: string } } }[]) {
  const now = Date.now();
  const week = 7 * 24 * 60 * 60 * 1000;
  const buckets = new Array<number>(WEEKS).fill(0);

  for (const commit of commits) {
    const raw = commit?.commit?.author?.date;
    if (!raw) continue;
    const age = now - new Date(raw).getTime();
    const index = WEEKS - 1 - Math.floor(age / week);
    if (index >= 0 && index < WEEKS) buckets[index] += 1;
  }

  return buckets;
}

async function fetchActivity(repo: string): Promise<number[]> {
  try {
    const since = new Date(
      Date.now() - WEEKS * 7 * 24 * 60 * 60 * 1000
    ).toISOString();
    const res = await fetch(
      `${API}/repos/${repo}/commits?per_page=100&since=${since}`,
      { headers: headers() }
    );
    if (!res.ok) return [];
    const commits = (await res.json()) as {
      commit?: { author?: { date?: string } };
    }[];
    if (!Array.isArray(commits)) return [];
    const buckets = bucketCommits(commits);
    // A row of empty dots reads as broken — show nothing for dormant repos
    return buckets.some((count) => count > 0) ? buckets : [];
  } catch {
    return [];
  }
}

async function fetchRepo(config: LabRepoConfig): Promise<LabRepo> {
  try {
    const res = await fetch(`${API}/repos/${config.repo}`, {
      headers: headers(),
    });
    if (!res.ok) return fallback(config);

    const data = (await res.json()) as {
      name: string;
      full_name: string;
      html_url: string;
      description: string | null;
      language: string | null;
      stargazers_count: number;
      forks_count: number;
      topics?: string[];
      pushed_at: string | null;
    };

    return {
      name: config.title ?? data.name,
      fullName: data.full_name,
      url: data.html_url,
      description: config.blurb ?? data.description ?? "",
      language: data.language,
      stars: data.stargazers_count ?? 0,
      forks: data.forks_count ?? 0,
      topics: (data.topics ?? []).slice(0, 4),
      pushedAt: data.pushed_at,
      activity: await fetchActivity(config.repo),
      stale: false,
    };
  } catch {
    return fallback(config);
  }
}

export async function getLabRepos(): Promise<LabRepo[]> {
  const repos = await Promise.all(LAB_REPOS.map(fetchRepo));
  const order = (repo: LabRepo) =>
    LAB_REPOS.find((c) => c.repo === repo.fullName)?.featured ? 0 : 1;
  return repos.sort((a, b) => order(a) - order(b));
}

/** Rough brand-safe language colors — GitHub's palette, dimmed for dark UI */
export const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Swift: "#F05138",
  C: "#555555",
  Java: "#b07219",
  Shell: "#89e051",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Go: "#00ADD8",
  Rust: "#dea584",
};

export function relativeTime(iso: string | null): string {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const day = 24 * 60 * 60 * 1000;
  const days = Math.floor(diff / day);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}
