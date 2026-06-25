create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.leagues (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete set null,
  name text not null,
  slug text not null unique,
  city text not null,
  state text not null,
  sport text not null check (sport in ('soccer','flag','basketball','baseball','volleyball','other')),
  category text not null check (category in ('varonil','femenil','mixto','infantil','juvenil','libre')),
  season text not null,
  description text,
  logo_url text,
  banner_url text,
  primary_color text not null default '#39FF14',
  secondary_color text not null default '#101010',
  accent_color text not null default '#FFD600',
  visual_style text not null default 'upper_deck' check (visual_style in ('modern','upper_deck','urban','minimal','classic')),
  public_profiles_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  league_id uuid not null references public.leagues(id) on delete cascade,
  name text not null,
  logo_url text,
  primary_color text,
  secondary_color text,
  coach_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  league_id uuid not null references public.leagues(id) on delete cascade,
  team_id uuid references public.teams(id) on delete set null,
  auth_user_id uuid references auth.users(id) on delete set null,
  full_name text not null,
  nickname text,
  number text not null,
  position text not null,
  birth_date date,
  photo_url text,
  status text not null default 'active' check (status in ('active','pending','suspended')),
  credential_code text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.player_stats (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.players(id) on delete cascade,
  league_id uuid not null references public.leagues(id) on delete cascade,
  season text not null,
  games int not null default 0,
  points int not null default 0,
  touchdowns int not null default 0,
  goals int not null default 0,
  assists int not null default 0,
  tackles int not null default 0,
  interceptions int not null default 0,
  mvp_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(player_id, league_id, season)
);

create table if not exists public.card_templates (
  id uuid primary key default gen_random_uuid(),
  league_id uuid not null references public.leagues(id) on delete cascade,
  name text not null,
  template_type text not null,
  background_style text not null,
  layout_json jsonb not null default '{}'::jsonb,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.player_cards (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.players(id) on delete cascade,
  league_id uuid not null references public.leagues(id) on delete cascade,
  template_id uuid references public.card_templates(id) on delete set null,
  image_url text,
  card_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.credential_requests (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.players(id) on delete cascade,
  league_id uuid not null references public.leagues(id) on delete cascade,
  email text not null,
  phone text,
  status text not null default 'pending' check (status in ('pending','accepted','expired','cancelled')),
  invitation_token text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists leagues_owner_id_idx on public.leagues(owner_id);
create index if not exists teams_league_id_idx on public.teams(league_id);
create index if not exists players_league_id_idx on public.players(league_id);
create index if not exists players_team_id_idx on public.players(team_id);
create index if not exists players_auth_user_id_idx on public.players(auth_user_id);
create index if not exists player_stats_player_id_idx on public.player_stats(player_id);
create index if not exists card_templates_league_id_idx on public.card_templates(league_id);
create index if not exists player_cards_player_id_idx on public.player_cards(player_id);
create index if not exists credential_requests_token_idx on public.credential_requests(invitation_token);

drop trigger if exists leagues_set_updated_at on public.leagues;
create trigger leagues_set_updated_at before update on public.leagues
for each row execute function public.set_updated_at();

drop trigger if exists players_set_updated_at on public.players;
create trigger players_set_updated_at before update on public.players
for each row execute function public.set_updated_at();

drop trigger if exists player_stats_set_updated_at on public.player_stats;
create trigger player_stats_set_updated_at before update on public.player_stats
for each row execute function public.set_updated_at();

drop trigger if exists player_cards_set_updated_at on public.player_cards;
create trigger player_cards_set_updated_at before update on public.player_cards
for each row execute function public.set_updated_at();

create or replace function public.is_league_owner(target_league_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.leagues
    where id = target_league_id
      and owner_id = auth.uid()
  );
$$;

create or replace function public.is_player_self(target_player_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.players
    where id = target_player_id
      and auth_user_id = auth.uid()
  );
$$;

alter table public.leagues enable row level security;
alter table public.teams enable row level security;
alter table public.players enable row level security;
alter table public.player_stats enable row level security;
alter table public.card_templates enable row level security;
alter table public.player_cards enable row level security;
alter table public.credential_requests enable row level security;

drop policy if exists "Public can read leagues" on public.leagues;
create policy "Public can read leagues"
on public.leagues for select
using (true);

drop policy if exists "Authenticated users create leagues" on public.leagues;
create policy "Authenticated users create leagues"
on public.leagues for insert
with check (auth.uid() is not null and (owner_id = auth.uid() or owner_id is null));

drop policy if exists "Owners update leagues" on public.leagues;
create policy "Owners update leagues"
on public.leagues for update
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

drop policy if exists "Public can read teams" on public.teams;
create policy "Public can read teams"
on public.teams for select
using (true);

drop policy if exists "Owners manage teams" on public.teams;
create policy "Owners manage teams"
on public.teams for all
using (public.is_league_owner(league_id))
with check (public.is_league_owner(league_id));

drop policy if exists "Public can read active public players" on public.players;
create policy "Public can read active public players"
on public.players for select
using (
  exists (
    select 1 from public.leagues
    where leagues.id = players.league_id
      and leagues.public_profiles_enabled = true
  )
  or auth_user_id = auth.uid()
  or public.is_league_owner(league_id)
);

drop policy if exists "Owners manage players" on public.players;
create policy "Owners manage players"
on public.players for all
using (public.is_league_owner(league_id))
with check (public.is_league_owner(league_id));

drop policy if exists "Players update own basic profile" on public.players;
create policy "Players update own basic profile"
on public.players for update
using (auth_user_id = auth.uid())
with check (auth_user_id = auth.uid());

drop policy if exists "Public can read stats" on public.player_stats;
create policy "Public can read stats"
on public.player_stats for select
using (
  exists (
    select 1 from public.leagues
    where leagues.id = player_stats.league_id
      and leagues.public_profiles_enabled = true
  )
  or public.is_league_owner(league_id)
);

drop policy if exists "Owners manage stats" on public.player_stats;
create policy "Owners manage stats"
on public.player_stats for all
using (public.is_league_owner(league_id))
with check (public.is_league_owner(league_id));

drop policy if exists "Public can read templates" on public.card_templates;
create policy "Public can read templates"
on public.card_templates for select
using (true);

drop policy if exists "Owners manage templates" on public.card_templates;
create policy "Owners manage templates"
on public.card_templates for all
using (public.is_league_owner(league_id))
with check (public.is_league_owner(league_id));

drop policy if exists "Public can read player cards" on public.player_cards;
create policy "Public can read player cards"
on public.player_cards for select
using (
  exists (
    select 1 from public.leagues
    where leagues.id = player_cards.league_id
      and leagues.public_profiles_enabled = true
  )
  or public.is_league_owner(league_id)
);

drop policy if exists "Owners manage player cards" on public.player_cards;
create policy "Owners manage player cards"
on public.player_cards for all
using (public.is_league_owner(league_id))
with check (public.is_league_owner(league_id));

drop policy if exists "Owners manage credential requests" on public.credential_requests;
create policy "Owners manage credential requests"
on public.credential_requests for all
using (public.is_league_owner(league_id))
with check (public.is_league_owner(league_id));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('league-assets', 'league-assets', true, 8388608, array['image/jpeg','image/png','image/webp']),
  ('player-photos', 'player-photos', true, 8388608, array['image/jpeg','image/png','image/webp']),
  ('generated-cards', 'generated-cards', true, 8388608, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public read league assets" on storage.objects;
create policy "Public read league assets"
on storage.objects for select
using (bucket_id in ('league-assets','player-photos','generated-cards'));

drop policy if exists "Authenticated upload league assets" on storage.objects;
create policy "Authenticated upload league assets"
on storage.objects for insert
to authenticated
with check (bucket_id in ('league-assets','player-photos','generated-cards'));

drop policy if exists "Authenticated update own generated assets" on storage.objects;
create policy "Authenticated update own generated assets"
on storage.objects for update
to authenticated
using (bucket_id in ('league-assets','player-photos','generated-cards'));
