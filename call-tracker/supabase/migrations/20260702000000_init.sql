create table if not exists calls (
  id uuid primary key default gen_random_uuid(),
  google_event_id text unique not null,
  title text,
  start_time timestamptz not null,
  end_time timestamptz,
  attendees jsonb not null default '[]'::jsonb,
  no_show boolean not null default false,
  hubspot_contact_id text,
  claap_recording_url text,
  created_at timestamptz not null default now()
);

create index if not exists calls_start_time_idx on calls (start_time desc);

create table if not exists google_auth (
  id int primary key default 1,
  refresh_token text not null,
  updated_at timestamptz not null default now(),
  constraint google_auth_single_row check (id = 1)
);
