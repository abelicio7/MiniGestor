
-- Create function to insert default categories for new users
CREATE OR REPLACE FUNCTION public.create_default_categories()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Expense categories
  INSERT INTO public.categories (user_id, name, color, type) VALUES
    (NEW.id, 'Alimentação', '#EF4444', 'expense'),
    (NEW.id, 'Transporte', '#F97316', 'expense'),
    (NEW.id, 'Moradia', '#8B5CF6', 'expense'),
    (NEW.id, 'Saúde', '#EC4899', 'expense'),
    (NEW.id, 'Educação', '#3B82F6', 'expense'),
    (NEW.id, 'Lazer', '#10B981', 'expense'),
    (NEW.id, 'Vestuário', '#F59E0B', 'expense'),
    (NEW.id, 'Contas', '#6366F1', 'expense'),
    (NEW.id, 'Compras', '#14B8A6', 'expense'),
    (NEW.id, 'Outros', '#6B7280', 'expense');

  -- Income categories
  INSERT INTO public.categories (user_id, name, color, type) VALUES
    (NEW.id, 'Salário', '#22C55E', 'income'),
    (NEW.id, 'Freelance', '#3B82F6', 'income'),
    (NEW.id, 'Investimentos', '#8B5CF6', 'income'),
    (NEW.id, 'Vendas', '#F97316', 'income'),
    (NEW.id, 'Presentes', '#EC4899', 'income'),
    (NEW.id, 'Outros', '#6B7280', 'income');

  RETURN NEW;
END;
$$;

-- Create trigger to automatically create categories for new users
CREATE TRIGGER on_profile_created_add_categories
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.create_default_categories();
