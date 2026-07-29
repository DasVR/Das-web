create type review_feedback_status as enum ('open', 'resolved', 'wontfix');

create table review_feedback (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references project_reviews (id) on delete cascade,
  -- Who left it (null = anonymous/guest review)
  author_name text,
  author_email text,
  body text not null,
  status review_feedback_status not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index review_feedback_review_idx on review_feedback (review_id, created_at desc);

create trigger review_feedback_touch before update on review_feedback
  for each row execute function public.touch_updated_at();
