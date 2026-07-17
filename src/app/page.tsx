import { TextFallback } from "@/components/site/text-fallback";
import { PortfolioShell } from "@/components/site/portfolio-shell";

type HomeProps = {
  searchParams: Promise<{
    text?: string;
  }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const resolvedSearchParams = await searchParams;

  if (resolvedSearchParams.text === "1") {
    return <TextFallback />;
  }

  return <PortfolioShell />;
}
