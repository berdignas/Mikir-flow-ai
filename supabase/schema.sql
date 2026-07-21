-- ================================================
-- MIKIR FLOW AI - SUPABASE DATABASE SCHEMA SQL
-- ================================================

-- 1. Table Users
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('pm', 'developer', 'client')),
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Table Projects
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  client_name TEXT DEFAULT 'PT Javas',
  prd_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Table Flow Nodes
CREATE TABLE IF NOT EXISTS public.nodes (
  id TEXT PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('rootNode', 'featureNode', 'subfeatureNode')),
  position_x FLOAT NOT NULL DEFAULT 0,
  position_y FLOAT NOT NULL DEFAULT 0,
  title TEXT NOT NULL,
  subtitle TEXT,
  phase TEXT,
  status TEXT,
  goals TEXT,
  user_story TEXT,
  acceptance_criteria TEXT,
  dependencies TEXT,
  items JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Table Flow Edges
CREATE TABLE IF NOT EXISTS public.edges (
  id TEXT PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  source TEXT NOT NULL,
  target TEXT NOT NULL,
  type TEXT DEFAULT 'deletableEdge',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Table Discussions
CREATE TABLE IF NOT EXISTS public.discussions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  node_id TEXT REFERENCES public.nodes(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_role TEXT NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS (Row Level Security) Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussions ENABLE ROW LEVEL SECURITY;

-- Allow Public Access (Anon key) for Demo Workspace
CREATE POLICY "Allow public read users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update users" ON public.users FOR ALL USING (true);

CREATE POLICY "Allow public read projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update projects" ON public.projects FOR ALL USING (true);

CREATE POLICY "Allow public read nodes" ON public.nodes FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update nodes" ON public.nodes FOR ALL USING (true);

CREATE POLICY "Allow public read edges" ON public.edges FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update edges" ON public.edges FOR ALL USING (true);

CREATE POLICY "Allow public read discussions" ON public.discussions FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update discussions" ON public.discussions FOR ALL USING (true);
