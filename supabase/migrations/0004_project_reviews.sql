-- Review links: time-limited client preview URLs for any project type.

create table project_reviews (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects (id) on delete cascade,
  -- Public token for the review URL (/review/:token)
  token text not null unique,
  -- Optional external URL (staging site, Figma, Drive, etc.)
  external_url text,
  -- When the link stops working
  expires_at timestamptz not null,
  -- Soft-disable without deleting
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, active) deferrable initially deferred
);

create index project_reviews_token_idx on project_reviews (token);
create index project_reviews_project_idx on project_reviews (project_id);
create index project_reviews_expiry_idx on project_reviews (expires_at) where active = true;

create trigger project_reviews_touch before update on project_reviews
  for each row execute function public.touch_updated_at();
