-- Create debt_payments table for tracking payment history
CREATE TABLE public.debt_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  debt_id UUID NOT NULL REFERENCES public.debts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  amount NUMERIC NOT NULL,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.debt_payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own debt payments"
ON public.debt_payments
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own debt payments"
ON public.debt_payments
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own debt payments"
ON public.debt_payments
FOR DELETE
USING (auth.uid() = user_id);

-- Trigger to update remaining_amount when payment is made
CREATE OR REPLACE FUNCTION public.update_debt_remaining_amount()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.debts 
    SET remaining_amount = remaining_amount - NEW.amount, updated_at = now() 
    WHERE id = NEW.debt_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.debts 
    SET remaining_amount = remaining_amount + OLD.amount, updated_at = now() 
    WHERE id = OLD.debt_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER update_debt_on_payment
AFTER INSERT OR DELETE ON public.debt_payments
FOR EACH ROW
EXECUTE FUNCTION public.update_debt_remaining_amount();