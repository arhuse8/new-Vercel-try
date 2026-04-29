# Supabase Schema Setup

To use this application with Supabase, you need to create the following tables in your Supabase project.

## 1. Profiles Table
This table stores user profile information.

```sql
create table public.profiles (
  id uuid references auth.users not null primary key,
  name text,
  email text,
  role text default 'user',
  mobile text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);
```

## 2. Matches Table
This table stores match information and real-time scores.

```sql
create table public.matches (
  id uuid default gen_random_uuid() primary key,
  team_a text not null,
  team_b text not null,
  format text default 'T20',
  overs integer default 20,
  status text default 'upcoming',
  created_by uuid references auth.users not null,
  score jsonb default '{"runs": 0, "wickets": 0, "overs": 0, "balls": 0, "recentBalls": []}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.matches enable row level security;

create policy "Matches are viewable by everyone." on public.matches
  for select using (true);

create policy "Wait, matches can be created by authenticated users." on public.matches
  for insert with check (auth.uid() = created_by);

create policy "Matches can be updated by the creator." on public.matches
  for update using (auth.uid() = created_by);
```

## 3. Real-time Setup
Make sure to enable replication for the `matches` table to support real-time score updates:
1. Go to **Database** -> **Replication**.
2. Click on the **supabase_realtime** publication.
3. Toggle the **matches** table to **ON**.

## 4. Authentication Settings (CRITICAL)

To avoid registration errors, you **MUST** configure your Supabase Authentication settings as follows:

1.  **Enable Email Provider:**
    *   Go to **Authentication** -> **Providers** -> **Email**.
    *   Ensure **Enable Email Signup** is toggled **ON**.
    *   Ensure **Confirm email** is toggled **OFF** (to skip verification for dummy/optional emails).
    *   Click **Save**.

2.  **Rate Limiting (Optional):**
    *   If you get "Email rate limit exceeded", you may need to wait or adjust rate limits in **Project Settings** -> **Auth** -> **Rate Limits**, though basic testing shouldn't hit this unless many accounts are created per hour.

3.  **Site URL:**
    *   In **Authentication** -> **URL Configuration**, ensure the **Site URL** is set to your application's domain.

If "Enable Email Signup" is OFF, the app will show "Email signups are disabled".
If "Confirm email" is ON, users won't be able to log in until they verify an email (which doesn't exist for dummy accounts).
