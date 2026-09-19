-- ==============================================================================
-- MBG (Matematika Bergaya Game) - Supabase Database Schema
-- Jalankan skrip ini di: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Tabel Users
CREATE TABLE IF NOT EXISTS users (
  uid TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_normalized TEXT NOT NULL UNIQUE,
  login_code TEXT NOT NULL,
  login_code_hash TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'user',
  active BOOLEAN NOT NULL DEFAULT true,
  status TEXT NOT NULL DEFAULT 'active',
  account_status TEXT NOT NULL DEFAULT 'active',
  disabled_message TEXT DEFAULT '',
  disabled_at TIMESTAMPTZ,
  disabled_by TEXT,
  xp BIGINT NOT NULL DEFAULT 0,
  score BIGINT NOT NULL DEFAULT 0,
  coins BIGINT NOT NULL DEFAULT 0,
  life INT NOT NULL DEFAULT 3,
  level INT NOT NULL DEFAULT 1,
  unlocked_level INT NOT NULL DEFAULT 1,
  selected_character TEXT NOT NULL DEFAULT 'hero',
  all_maps_unlocked BOOLEAN NOT NULL DEFAULT false,
  unlocked_levels JSONB DEFAULT '[]'::jsonb,
  completed_materials JSONB DEFAULT '[]'::jsonb,
  completed_practice JSONB DEFAULT '[]'::jsonb,
  game_progress JSONB DEFAULT '{}'::jsonb,
  progress JSONB DEFAULT '{}'::jsonb,
  last_login TIMESTAMPTZ,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by TEXT
);

-- 2. Tabel Sessions
CREATE TABLE IF NOT EXISTS sessions (
  session_id TEXT PRIMARY KEY,
  uid TEXT NOT NULL REFERENCES users(uid) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'user',
  name TEXT,
  device_name TEXT,
  browser TEXT,
  platform TEXT,
  user_agent TEXT,
  login_at TIMESTAMPTZ DEFAULT NOW(),
  last_active_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'active',
  revoked_at TIMESTAMPTZ,
  revoked_by TEXT
);

-- 3. Tabel Admin Logs
CREATE TABLE IF NOT EXISTS admin_logs (
  id BIGSERIAL PRIMARY KEY,
  admin_uid TEXT NOT NULL,
  action TEXT NOT NULL,
  target_uid TEXT,
  values JSONB,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Index Performa
CREATE INDEX IF NOT EXISTS idx_users_login_code_hash ON users(login_code_hash);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_sessions_uid ON sessions(uid);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);

-- 5. Row Level Security (RLS)
-- Mengamankan tabel agar tidak bisa diakses langsung dari public anon key tanpa backend.
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;
