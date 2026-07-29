-- RLS policies for project_reviews and review_feedback.
-- Anonymous users can look up reviews by token and leave feedback.
-- Admin-only for management.

alter table project_reviews enable row level security;
alter table review_feedback enable row level security;

-- Anyone can read a review row (the token is the secret).
create policy "reviews_select_anon" on project_reviews
  for select to anon, authenticated
  using (true);

-- Only admin can create / manage review links.
create policy "reviews_insert_admin" on project_reviews
  for insert to authenticated
  with check (public.is_admin());

create policy "reviews_update_admin" on project_reviews
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "reviews_delete_admin" on project_reviews
  for delete to authenticated
  using (public.is_admin());

-- Anyone can leave feedback if the review is active and not expired.
create policy "feedback_insert_anon" on review_feedback
  for insert to anon, authenticated
  with check (
    exists (
      select 1 from public.project_reviews
      where public.project_reviews.id = review_feedback.review_id
        and public.project_reviews.active = true
        and public.project_reviews.expires_at > now()
    )
  );

-- Admin can read all feedback.
create policy "feedback_select_admin" on review_feedback
  for select to authenticated
  using (public.is_admin());

-- Admin can update feedback status.
create policy "feedback_update_admin" on review_feedback
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "feedback_delete_admin" on review_feedback
  for delete to authenticated
  using (public.is_admin());
