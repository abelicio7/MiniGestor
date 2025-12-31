-- Add trial fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS trial_start timestamp with time zone DEFAULT now(),
ADD COLUMN IF NOT EXISTS trial_end timestamp with time zone DEFAULT (now() + interval '30 days'),
ADD COLUMN IF NOT EXISTS is_pro boolean DEFAULT false;

-- Update existing profiles to have trial dates if they don't have them
UPDATE public.profiles 
SET 
  trial_start = COALESCE(trial_start, created_at),
  trial_end = COALESCE(trial_end, created_at + interval '30 days'),
  is_pro = false
WHERE trial_start IS NULL;

-- Create function to check if user trial is active
CREATE OR REPLACE FUNCTION public.is_trial_active(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = user_id
      AND plan = 'free'
      AND trial_end > now()
  )
$$;

-- Create function to check if user has full access (trial active OR pro)
CREATE OR REPLACE FUNCTION public.has_full_access(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = user_id
      AND (
        plan = 'pro' 
        OR (plan = 'free' AND trial_end > now())
      )
  )
$$;

-- Create function to get days remaining in trial
CREATE OR REPLACE FUNCTION public.get_trial_days_remaining(user_id uuid)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT GREATEST(0, EXTRACT(DAY FROM (trial_end - now()))::integer)
  FROM public.profiles
  WHERE id = user_id
$$;