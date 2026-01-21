-- User Profiles Table (stores persona and preferences)
create table if not exists user_profiles (
  id uuid references auth.users on delete cascade primary key,
  persona text check (persona in ('family-first', 'keto-warrior', 'gym-rat', 'old-money', 'budget-hero')) default 'family-first',
  family_size integer default 4,
  dietary_restrictions text[] default array[]::text[],
  budget_weekly numeric(10,2) default 100.00,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table user_profiles enable row level security;

-- RLS Policies: Users can only see/update their own profile
drop policy if exists "Users can view own profile" on user_profiles;
create policy "Users can view own profile"
  on user_profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on user_profiles;
create policy "Users can insert own profile"
  on user_profiles for insert
  with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on user_profiles;
create policy "Users can update own profile"
  on user_profiles for update
  using (auth.uid() = id);

-- Auto-create profile on signup (drop and recreate)
drop function if exists public.handle_new_user() cascade;
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_profiles (id, persona, family_size)
  values (new.id, 'family-first', 4);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on new user (drop and recreate)
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
