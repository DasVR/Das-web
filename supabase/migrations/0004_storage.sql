-- Private storage for client deliverables.
--
-- Objects are laid out as <client_id>/<filename>, so the first path segment is
-- the tenant key that every policy checks. The bucket is private: the browser
-- never gets a public URL, only a short-lived signed URL.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'client-files',
  'client-files',
  false,
  52428800, -- 50 MB
  array[
    'image/png', 'image/jpeg', 'image/webp', 'image/svg+xml',
    'application/pdf', 'application/zip',
    'text/plain', 'text/csv'
  ]
)
on conflict (id) do update
  set public = false,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- storage.objects already has RLS enabled by Supabase; these add our rules.

create policy "client reads own files"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'client-files'
    and (
      public.is_admin()
      -- storage.foldername() returns the path segments; [1] is the client id.
      or (storage.foldername(name))[1] = public.current_client_id()::text
    )
  );

-- Uploads and deletes are admin-only: clients receive deliverables, they do not
-- publish into the bucket. Removing this would let any authenticated user fill
-- storage under their own prefix.
create policy "admin writes files"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'client-files' and public.is_admin());

create policy "admin updates files"
  on storage.objects for update to authenticated
  using (bucket_id = 'client-files' and public.is_admin())
  with check (bucket_id = 'client-files' and public.is_admin());

create policy "admin deletes files"
  on storage.objects for delete to authenticated
  using (bucket_id = 'client-files' and public.is_admin());
