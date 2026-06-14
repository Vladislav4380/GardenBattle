create schema if not exists identity;
create schema if not exists garden;
create schema if not exists battle;
create schema if not exists reward;
create schema if not exists tournament;
create schema if not exists market;
create schema if not exists payment;
create schema if not exists integration;

create table identity.players (
    player_id uuid primary key,
    telegram_id bigint not null unique,
    first_name text not null,
    avatar_code text not null default 'gardener_01',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table identity.player_currencies (
    player_id uuid primary key references identity.players(player_id),
    seeds integer not null default 1000,
    stars integer not null default 0,
    tournament_tokens integer not null default 10,
    updated_at timestamptz not null default now()
);

create table garden.crop_types (
    crop_type_id uuid primary key,
    code text not null unique,
    name text not null,
    hp integer not null,
    attack integer not null,
    defense integer not null,
    ability_code text not null,
    ability_name text not null,
    growth_seconds integer not null
);

create table garden.gardens (
    garden_id uuid primary key,
    player_id uuid not null unique references identity.players(player_id),
    created_at timestamptz not null default now()
);

create table garden.garden_plots (
    plot_id uuid primary key,
    garden_id uuid not null references garden.gardens(garden_id),
    plot_index integer not null,
    is_unlocked boolean not null default false,
    is_greenhouse boolean not null default false,
    unlocked_at timestamptz,
    unique (garden_id, plot_index)
);

create table garden.player_crops (
    player_crop_id uuid primary key,
    player_id uuid not null references identity.players(player_id),
    crop_type_id uuid not null references garden.crop_types(crop_type_id),
    plot_id uuid references garden.garden_plots(plot_id),
    status text not null,
    planted_at timestamptz,
    ready_at timestamptz,
    harvested_at timestamptz,
    created_at timestamptz not null default now()
);

create table garden.player_team_slots (
    player_id uuid not null references identity.players(player_id),
    slot integer not null check (slot between 1 and 3),
    player_crop_id uuid not null references garden.player_crops(player_crop_id),
    primary key (player_id, slot)
);

create table battle.battles (
    battle_id uuid primary key,
    battle_type text not null,
    status text not null,
    left_player_id uuid not null references identity.players(player_id),
    right_player_id uuid not null references identity.players(player_id),
    started_at timestamptz,
    finished_at timestamptz,
    created_at timestamptz not null default now()
);

create table battle.battle_units (
    battle_unit_id uuid primary key,
    battle_id uuid not null references battle.battles(battle_id),
    player_id uuid not null references identity.players(player_id),
    player_crop_id uuid not null references garden.player_crops(player_crop_id),
    slot integer not null check (slot between 1 and 3),
    crop_code text not null,
    base_hp integer not null,
    base_attack integer not null,
    base_defense integer not null
);

create table battle.battle_results (
    battle_result_id uuid primary key,
    battle_id uuid not null unique references battle.battles(battle_id),
    winner_player_id uuid not null references identity.players(player_id),
    seeds_reward integer not null default 0,
    rating_delta integer not null default 0,
    chest_reward text,
    created_at timestamptz not null default now()
);

create table reward.player_chests (
    chest_id uuid primary key,
    player_id uuid not null references identity.players(player_id),
    chest_type text not null,
    status text not null,
    granted_at timestamptz not null default now(),
    opened_at timestamptz
);

create table reward.player_rewards (
    reward_id uuid primary key,
    player_id uuid not null references identity.players(player_id),
    source_type text not null,
    reward_type text not null,
    reward_code text not null,
    quantity integer not null default 1,
    created_at timestamptz not null default now()
);

create table tournament.tournaments (
    tournament_id uuid primary key,
    code text not null unique,
    starts_at timestamptz not null,
    ends_at timestamptz not null,
    status text not null
);

create table tournament.player_ratings (
    tournament_id uuid not null references tournament.tournaments(tournament_id),
    player_id uuid not null references identity.players(player_id),
    rating integer not null default 1000,
    wins integer not null default 0,
    losses integer not null default 0,
    primary key (tournament_id, player_id)
);

create table market.lots (
    lot_id uuid primary key,
    code text not null unique,
    name text not null,
    price_seeds integer not null default 0,
    price_stars integer not null default 0,
    is_active boolean not null default true
);

create table market.transactions (
    transaction_id uuid primary key,
    player_id uuid not null references identity.players(player_id),
    lot_id uuid not null references market.lots(lot_id),
    currency text not null,
    amount integer not null,
    created_at timestamptz not null default now()
);

create table payment.telegram_star_payments (
    payment_id uuid primary key,
    player_id uuid not null references identity.players(player_id),
    invoice_id text not null unique,
    product_code text not null,
    stars integer not null,
    status text not null,
    created_at timestamptz not null default now(),
    paid_at timestamptz
);

create table integration.outbox_messages (
    outbox_message_id uuid primary key,
    event_type text not null,
    payload jsonb not null,
    occurred_at timestamptz not null default now(),
    processed_at timestamptz,
    error text
);

insert into garden.crop_types (crop_type_id, code, name, hp, attack, defense, ability_code, ability_name, growth_seconds)
values
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'potato', 'Potato', 140, 14, 8, 'earth_shield', 'Earth Shield', 60),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'cucumber', 'Cucumber', 95, 18, 4, 'slippery_maneuver', 'Slippery Maneuver', 45),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'tomato', 'Tomato', 105, 22, 5, 'tomato_bomb', 'Tomato Bomb', 75)
on conflict (code) do nothing;
