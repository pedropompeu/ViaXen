-- Sprint 2: histórico de rotas por usuário
-- Executar no SQL Editor do Supabase

create table if not exists route_history (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users not null,
  origin        text not null,
  destination   text not null,
  distance_km   numeric(8,2),
  duration_min  int,
  calculated_at timestamptz default now()
);

alter table route_history enable row level security;

-- Usuário só acessa suas próprias rotas
create policy "users_own_rows" on route_history
  for all using (auth.uid() = user_id);

-- Índice para listar histórico do usuário por data
create index if not exists route_history_user_date
  on route_history (user_id, calculated_at desc);
