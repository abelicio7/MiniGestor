-- Add columns for plan types
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_lifetime boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS subscription_end timestamp with time zone;

-- Update has_full_access function to include lifetime check
CREATE OR REPLACE FUNCTION public.has_full_access(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = user_id
      AND (
        is_lifetime = true
        OR plan = 'pro' 
        OR (plan = 'free' AND trial_end > now())
        OR (subscription_end IS NOT NULL AND subscription_end > now())
      )
  )
$$;