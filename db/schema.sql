-- ════════════════════════════════════════════════════════
-- FLOWI APP — DATABASE SCHEMA
-- Ejecuta esto en: Supabase Dashboard → SQL Editor → New query
-- ════════════════════════════════════════════════════════

-- ── 1. PROFILES ─────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid references auth.users on delete cascade primary key,
  name        text,
  avatar_url  text,
  currency    text default 'USD',
  theme       text default 'dark',
  monthly_income numeric(12,2) default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Trigger: crear perfil automáticamente al registrarse
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── 2. CATEGORIES ────────────────────────────────────────
create table if not exists public.categories (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users on delete cascade not null,
  name        text not null,
  icon        text not null default '📦',
  color       text not null default '#888888',
  type        text check (type in ('income','expense','both')) default 'both',
  is_default  boolean default false,
  created_at  timestamptz default now()
);

-- ── 3. TRANSACTIONS ──────────────────────────────────────
create table if not exists public.transactions (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users on delete cascade not null,
  type        text check (type in ('income','expense')) not null,
  amount      numeric(12,2) not null check (amount > 0),
  description text not null,
  category_id uuid references public.categories on delete set null,
  date        date not null default current_date,
  notes       text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ── 4. SAVINGS GOALS ────────────────────────────────────
create table if not exists public.savings_goals (
  id             uuid default gen_random_uuid() primary key,
  user_id        uuid references auth.users on delete cascade not null,
  name           text not null,
  icon           text default '🎯',
  target_amount  numeric(12,2) not null check (target_amount > 0),
  current_amount numeric(12,2) default 0 check (current_amount >= 0),
  target_date    date,
  color          text default '#C8F44D',
  completed      boolean default false,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

-- ── 5. BUDGETS ──────────────────────────────────────────
create table if not exists public.budgets (
  id           uuid default gen_random_uuid() primary key,
  user_id      uuid references auth.users on delete cascade not null,
  category_id  uuid references public.categories on delete cascade not null,
  month        int not null check (month between 1 and 12),
  year         int not null,
  limit_amount numeric(12,2) not null check (limit_amount > 0),
  created_at   timestamptz default now(),
  unique(user_id, category_id, month, year)
);

-- ════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS) — Datos privados por usuario
-- ════════════════════════════════════════════════════════
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.transactions enable row level security;
alter table public.savings_goals enable row level security;
alter table public.budgets enable row level security;

-- Profiles
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Categories
create policy "Users own categories" on public.categories for all using (auth.uid() = user_id);

-- Transactions
create policy "Users own transactions" on public.transactions for all using (auth.uid() = user_id);

-- Savings Goals
create policy "Users own savings goals" on public.savings_goals for all using (auth.uid() = user_id);

-- Budgets
create policy "Users own budgets" on public.budgets for all using (auth.uid() = user_id);

-- ════════════════════════════════════════════════════════
-- INDEXES — Performance
-- ════════════════════════════════════════════════════════
create index if not exists idx_transactions_user_date on public.transactions(user_id, date desc);
create index if not exists idx_transactions_user_type on public.transactions(user_id, type);
create index if not exists idx_categories_user on public.categories(user_id);
create index if not exists idx_budgets_user_month on public.budgets(user_id, year, month);

-- ════════════════════════════════════════════════════════
-- FUNCIÓN: insertar categorías default al crear usuario
-- ════════════════════════════════════════════════════════
create or replace function public.create_default_categories()
returns trigger language plpgsql security definer as $$
begin
  insert into public.categories (user_id, name, icon, color, type, is_default) values
    (new.id, 'Salario',          '💼', '#C8F44D', 'income',  true),
    (new.id, 'Freelance',        '💻', '#7BE8D5', 'income',  true),
    (new.id, 'Inversiones',      '📈', '#FFE66D', 'income',  true),
    (new.id, 'Comida',           '🍔', '#FF6B6B', 'expense', true),
    (new.id, 'Transporte',       '🚌', '#4ECDC4', 'expense', true),
    (new.id, 'Entretenimiento',  '🎮', '#B8B8FF', 'expense', true),
    (new.id, 'Salud',            '💊', '#A8E6CF', 'expense', true),
    (new.id, 'Compras',          '🛍️', '#FF8B94', 'expense', true),
    (new.id, 'Servicios',        '💡', '#FFA07A', 'expense', true),
    (new.id, 'Ahorro',           '🏦', '#98D8C8', 'expense', true),
    (new.id, 'Educación',        '📚', '#DDA0DD', 'expense', true),
    (new.id, 'Otros',            '📦', '#888888', 'both',    true);
  return new;
end;
$$;

drop trigger if exists on_profile_created on public.profiles;
create trigger on_profile_created
  after insert on public.profiles
  for each row execute procedure public.create_default_categories();

-- ════════════════════════════════════════════════════════
-- VISTA: resumen mensual por usuario
-- ════════════════════════════════════════════════════════
create or replace view public.monthly_summary as
select
  user_id,
  date_trunc('month', date) as month,
  sum(case when type = 'income' then amount else 0 end) as total_income,
  sum(case when type = 'expense' then amount else 0 end) as total_expenses,
  sum(case when type = 'income' then amount else -amount end) as balance,
  count(*) as transaction_count
from public.transactions
group by user_id, date_trunc('month', date);
