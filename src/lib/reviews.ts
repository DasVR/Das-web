import { getSupabase } from "./supabase";
import type { ProjectReviewRow, ReviewFeedbackRow } from "./database.types";

export type PublicReview = {
  review: ProjectReviewRow;
  projectName: string;
  clientName: string;
  feedback: ReviewFeedbackRow[];
};

const TOKEN_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789abcdefghijkmnopqrstuvwxyz";

export function generateToken(length = 12): string {
  let t = "";
  for (let i = 0; i < length; i++) {
    t += TOKEN_CHARS[Math.floor(Math.random() * TOKEN_CHARS.length)];
  }
  return t;
}

export function defaultExpiryDays(days = 7): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

/** Admin creates a review link. */
export async function createReviewLink(input: {
  project_id: string;
  external_url?: string;
  expires_at?: string;
}): Promise<ProjectReviewRow> {
  const supabase = getSupabase();
  const token = generateToken();
  const { data, error } = await supabase
    .from("project_reviews")
    .insert({
      project_id: input.project_id,
      token,
      external_url: input.external_url ?? null,
      expires_at: input.expires_at ?? defaultExpiryDays(),
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deactivateReviewLink(reviewId: string): Promise<void> {
  const { error } = await getSupabase()
    .from("project_reviews")
    .update({ active: false })
    .eq("id", reviewId);
  if (error) throw error;
}

/** Public fetch by token (no auth required). */
export async function fetchReviewByToken(
  token: string
): Promise<PublicReview | null> {
  const supabase = getSupabase();

  const { data: review, error: reviewError } = await supabase
    .from("project_reviews")
    .select("*, projects(name, client_id, clients(business_name))")
    .eq("token", token)
    .eq("active", true)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();

  if (reviewError) throw reviewError;
  if (!review) return null;

  // @ts-expect-error nested select shape
  const projectName: string = review.projects?.name ?? "Untitled";
  // @ts-expect-error nested select shape
  const clientName: string = review.projects?.clients?.business_name ?? "";

  const { data: feedback } = await supabase
    .from("review_feedback")
    .select("*")
    .eq("review_id", review.id)
    .order("created_at", { ascending: false });

  return {
    review,
    projectName,
    clientName,
    feedback: feedback ?? [],
  };
}

export async function submitFeedback(input: {
  review_id: string;
  body: string;
  author_name?: string;
  author_email?: string;
}): Promise<void> {
  const { error } = await getSupabase().from("review_feedback").insert({
    review_id: input.review_id,
    body: input.body,
    author_name: input.author_name ?? null,
    author_email: input.author_email ?? null,
  });
  if (error) throw error;
}

/** Admin fetches all review links for a project. */
export async function fetchProjectReviews(projectId: string): Promise<
  ProjectReviewRow[]
> {
  const { data, error } = await getSupabase()
    .from("project_reviews")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}
