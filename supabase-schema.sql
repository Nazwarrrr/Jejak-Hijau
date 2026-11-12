-- ==============================================================================
-- JejakHijau Database Schema & Security Policies
-- ==============================================================================
-- Database schema for Supabase: User profiles, carbon emission logs,
-- challenges, leaderboards, and Row Level Security (RLS).
-- ==============================================================================

-- 1. EXTENSIONS
-- Enable necessary cryptographic and UUID functions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. TABLE: PROFILES
-- Stores extended user profile information linked to Supabase auth.users
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  daily_limit NUMERIC(5, 2) NOT NULL DEFAULT 5.0 CHECK (daily_limit > 0),
  total_trees INTEGER NOT NULL DEFAULT 0 CHECK (total_trees >= 0),
  streak_days INTEGER NOT NULL DEFAULT 0 CHECK (streak_days >= 0),
  points INTEGER NOT NULL DEFAULT 0 CHECK (points >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Comment on profiles
COMMENT ON TABLE public.profiles IS 'Profil pengguna JejakHijau yang terhubung dengan akun auth.users';

-- ==============================================================================
-- 3. TABLE: CARBON_LOGS
-- Stores emission logs entered by users (transportation, electricity, etc.)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.carbon_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  activity TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('transportasi', 'listrik')),
  amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
  unit TEXT NOT NULL,
  emissions NUMERIC(10, 2) NOT NULL CHECK (emissions >= 0),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast user activity lookups by date
CREATE INDEX IF NOT EXISTS idx_carbon_logs_user_date ON public.carbon_logs(user_id, date);
CREATE INDEX IF NOT EXISTS idx_carbon_logs_created_at ON public.carbon_logs(created_at DESC);

-- Comment on carbon_logs
COMMENT ON TABLE public.carbon_logs IS 'Catatan jejak karbon aktivitas harian pengguna';

-- ==============================================================================
-- 4. TABLE: USER_CHALLENGES
-- Stores challenge progress and completion for users
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.user_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  challenge_id TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'failed')),
  CONSTRAINT unique_user_challenge_start UNIQUE (user_id, challenge_id, started_at)
);

-- Index on user_challenges
CREATE INDEX IF NOT EXISTS idx_user_challenges_user ON public.user_challenges(user_id, status);

-- Comment on user_challenges
COMMENT ON TABLE public.user_challenges IS 'Pelacakan tantangan ramah lingkungan yang diambil pengguna';

-- ==============================================================================
-- 5. VIEW: LEADERBOARD_WEEKLY
-- Aggregates weekly emissions and ranks users (lowest emission ranked highest)
-- ==============================================================================
CREATE OR REPLACE VIEW public.leaderboard_weekly AS
SELECT
  cl.user_id,
  p.full_name,
  p.avatar_url,
  ROUND(SUM(cl.emissions)::numeric, 2) AS total_emissions,
  COUNT(cl.id) AS total_logs,
  RANK() OVER (ORDER BY SUM(cl.emissions) ASC) AS rank
FROM public.carbon_logs cl
JOIN public.profiles p ON cl.user_id = p.id
WHERE cl.date >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY cl.user_id, p.full_name, p.avatar_url;

-- ==============================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carbon_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_challenges ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- PROFILES POLICIES
-- ------------------------------------------------------------------------------

-- Allow users to select their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Allow all authenticated users to read names and avatars for leaderboards/social
CREATE POLICY "Authenticated users can view public profile info"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- ------------------------------------------------------------------------------
-- CARBON_LOGS POLICIES
-- ------------------------------------------------------------------------------

-- Users can view their own carbon logs
CREATE POLICY "Users can view own carbon logs"
  ON public.carbon_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own carbon logs
CREATE POLICY "Users can insert own carbon logs"
  ON public.carbon_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own carbon logs
CREATE POLICY "Users can update own carbon logs"
  ON public.carbon_logs
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own carbon logs
CREATE POLICY "Users can delete own carbon logs"
  ON public.carbon_logs
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- USER_CHALLENGES POLICIES
-- ------------------------------------------------------------------------------

-- Users can view their own challenges
CREATE POLICY "Users can view own challenges"
  ON public.user_challenges
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own challenges
CREATE POLICY "Users can insert own challenges"
  ON public.user_challenges
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own challenges
CREATE POLICY "Users can update own challenges"
  ON public.user_challenges
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own challenges
CREATE POLICY "Users can delete own challenges"
  ON public.user_challenges
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ==============================================================================
-- 7. AUTOMATIC PROFILE CREATION TRIGGER
-- When a user registers via Supabase Auth, automatically insert a row in profiles
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    full_name,
    avatar_url,
    daily_limit,
    total_trees,
    streak_days,
    points
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NULL),
    5.0,
    0,
    1,
    0
  )
  ON CONFLICT (id) DO UPDATE
  SET full_name = EXCLUDED.full_name;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-create trigger safely
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
