-- Create goal_contributions table to track individual contributions
CREATE TABLE public.goal_contributions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  goal_id UUID NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  amount NUMERIC NOT NULL,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.goal_contributions ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own contributions"
ON public.goal_contributions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own contributions"
ON public.goal_contributions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own contributions"
ON public.goal_contributions FOR DELETE
USING (auth.uid() = user_id);

-- Trigger to automatically update goal current_amount
CREATE OR REPLACE FUNCTION public.update_goal_current_amount()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.goals 
    SET current_amount = current_amount + NEW.amount, updated_at = now() 
    WHERE id = NEW.goal_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.goals 
    SET current_amount = current_amount - OLD.amount, updated_at = now() 
    WHERE id = OLD.goal_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER on_contribution_change
  AFTER INSERT OR DELETE ON public.goal_contributions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_goal_current_amount();