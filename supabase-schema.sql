-- ═══════════════════════════════════════════════════════════
-- Family inFluency — Supabase Schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ═══════════════════════════════════════════════════════════

-- Families (one row per family group)
CREATE TABLE families (
  code        TEXT PRIMARY KEY,
  name        TEXT NOT NULL DEFAULT 'Family',
  week_start  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- Players (one row per family member)
CREATE TABLE players (
  id               BIGINT PRIMARY KEY,
  family_code      TEXT NOT NULL REFERENCES families(code),
  name             TEXT NOT NULL,
  color_idx        INTEGER NOT NULL DEFAULT 0,
  langs            TEXT[] NOT NULL DEFAULT '{"spanish"}',
  paths            TEXT[] NOT NULL DEFAULT '{"travel"}',
  lang_diffs       JSONB NOT NULL DEFAULT '{}',
  diff             INTEGER NOT NULL DEFAULT 0,
  xp               INTEGER NOT NULL DEFAULT 0,
  week_xp          INTEGER NOT NULL DEFAULT 0,
  level            INTEGER NOT NULL DEFAULT 1,
  streak           INTEGER NOT NULL DEFAULT 0,
  last_active_date TEXT,
  pin              TEXT,
  start_date       TIMESTAMPTZ,
  sort_order       INTEGER NOT NULL DEFAULT 0,
  updated_at       TIMESTAMPTZ DEFAULT now(),
  deleted_at       TIMESTAMPTZ
);
CREATE INDEX idx_players_family ON players(family_code);

-- Daily words (one per player per day)
CREATE TABLE daily_words (
  family_code TEXT NOT NULL REFERENCES families(code),
  player_id   BIGINT NOT NULL REFERENCES players(id),
  date        TEXT NOT NULL,
  word        TEXT NOT NULL,
  prompt      TEXT,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (family_code, player_id, date)
);
CREATE INDEX idx_daily_words_family ON daily_words(family_code);

-- Row-level security (permissive for trusted family groups)
ALTER TABLE families ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_words ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_all" ON families FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON players FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON daily_words FOR ALL USING (true) WITH CHECK (true);
