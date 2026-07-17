-- Migration: Create followers table for Instagram-like follow system
-- Date: 2024-07-16

-- Create followers table
CREATE TABLE IF NOT EXISTS public.followers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    follower_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    -- Ensure a user can't follow themselves
    CONSTRAINT no_self_follow CHECK (follower_id != following_id),
    
    -- Unique constraint: prevent duplicate follows
    CONSTRAINT unique_follow UNIQUE (follower_id, following_id)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_followers_follower_id ON public.followers(follower_id);
CREATE INDEX IF NOT EXISTS idx_followers_following_id ON public.followers(following_id);

-- Enable Row Level Security
ALTER TABLE public.followers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first to avoid conflicts
DROP POLICY IF EXISTS "Users can view followers of any profile" ON public.followers;
DROP POLICY IF EXISTS "Users can follow other profiles" ON public.followers;
DROP POLICY IF EXISTS "Users can unfollow (delete their own follows)" ON public.followers;

-- Create policies
CREATE POLICY "Users can view followers of any profile"
    ON public.followers FOR SELECT
    USING (true);

CREATE POLICY "Users can follow other profiles"
    ON public.followers FOR INSERT
    WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow (delete their own follows)"
    ON public.followers FOR DELETE
    USING (auth.uid() = follower_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_followers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger and view if they exist
DROP TRIGGER IF EXISTS update_followers_updated_at ON public.followers;
DROP VIEW IF EXISTS public.follower_stats;

-- Create trigger for updated_at
CREATE TRIGGER update_followers_updated_at
    BEFORE UPDATE ON public.followers
    FOR EACH ROW
    EXECUTE FUNCTION public.update_followers_updated_at();

-- Create RPC functions for easier querying
CREATE OR REPLACE FUNCTION public.get_followers_count(user_id UUID)
RETURNS BIGINT AS $$
    SELECT COUNT(*) FROM public.followers WHERE following_id = user_id;
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION public.get_following_count(user_id UUID)
RETURNS BIGINT AS $$
    SELECT COUNT(*) FROM public.followers WHERE follower_id = user_id;
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION public.is_following(follower_id UUID, following_id UUID)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.followers 
        WHERE follower_id = $1 AND following_id = $2
    );
$$ LANGUAGE sql STABLE;

-- Create a function to get mutual follows
CREATE OR REPLACE FUNCTION public.get_mutual_follows(user_id UUID, other_id UUID)
RETURNS TABLE(
    mutual_followers BIGINT
) AS $$
    SELECT COUNT(*) as mutual_followers
    FROM public.followers f1
    JOIN public.followers f2 ON f1.follower_id = f2.following_id
    WHERE f1.following_id = $1 AND f2.follower_id = $2;
$$ LANGUAGE sql STABLE;

-- Create view for follower stats
CREATE OR REPLACE VIEW public.follower_stats AS
SELECT 
    p.id as profile_id,
    p.username,
    p.full_name,
    p.avatar_url,
    (SELECT COUNT(*) FROM public.followers WHERE following_id = p.id) as follower_count,
    (SELECT COUNT(*) FROM public.followers WHERE follower_id = p.id) as following_count,
    p.created_at as profile_created_at
FROM public.profiles p;

-- Grant access
GRANT ALL ON public.followers TO authenticated;
GRANT SELECT ON public.follower_stats TO authenticated;