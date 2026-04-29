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

## 4. Authentication Settings (CRITICAL - PLEASE READ)

To avoid registration being stuck in "Processing...", you **MUST** configure your Supabase Authentication settings exactly like this:

1.  **Email Provider Configuration:**
    *   Go to **Authentication** -> **Providers** -> **Email**.
    *   **Enable Email Signup:** Set to **ON**.
    *   **Confirm email:** Set to **OFF**. (If this is ON, registration will appear to hang because users can't log in without verification).
    *   **Secure email change:** Set to **OFF** (optional but recommended for dev).
    *   Click **Save**.

2.  **External Redirect URLs (Redirection Error Fix):**
    *   Go to **Authentication** -> **URL Configuration**.
    *   **Site URL:** Set to your application's domain (e.g., `https://your-app.vercel.app`).
    *   **Redirect URLs:** Add `http://localhost:3000` for local development.

3.  **User Trigger (Automatic Profile Creation):**
    *   If registration still feels slow, verify your `profiles` table permissions.
    *   The app attempts to create a profile automatically, but if you want true reliability, add a Postgres trigger in Supabase:
    ```sql
    -- Create profile on signup automatically
    create function public.handle_new_user()
    returns trigger as $$
    begin
      insert into public.profiles (id, name, email, role)
      values (new.id, new.raw_user_meta_data->>'full_name', new.email, new.raw_user_meta_data->>'role');
      return new;
    end;
    $$ language plpgsql security definer;

    create trigger on_auth_user_created
      after insert on auth.users
      for each row execute procedure public.handle_new_user();
    ```

If "Confirm email" is ON, the app will create the user but won't log them in, causing the registration page to stay on an error or "stuck" state.
