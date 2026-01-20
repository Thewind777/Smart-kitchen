-- 🧑‍🍳 PERSONALIZATION SCHEMA
-- Run this in Supabase SQL Editor to enable User Profiles and Smart Lists.

-- 1. Create Profiles Table (Linked to Supabase Auth)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  first_name text,
  family_members integer default 1,
  dietary_restrictions text[], -- Array: ['keto', 'gluten_free', 'vegan']
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Enable RLS (Security)
alter table public.profiles enable row level security;

-- 3. Policies
-- Allow users to read/update ONLY their own data
create policy "Users can view own profile" 
on public.profiles for select 
using (auth.uid() = id);

create policy "Users can update own profile" 
on public.profiles for update 
using (auth.uid() = id);

create policy "Users can insert own profile" 
on public.profiles for insert 
with check (auth.uid() = id);

-- 4. Auto-create profile on signup (Optional Trigger)
-- This is sophisticated: it auto-creates a row in public.profiles whenever a user signs up.
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, first_name)
  values (new.id, new.email, new.raw_user_meta_data->>'first_name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
