import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;
type Wallet = Tables<"wallets">;
type Transaction = Tables<"transactions">;
type Category = Tables<"categories">;
type Goal = Tables<"goals">;
type Debt = Tables<"debts">;

export interface FinancialData {
  profile: Profile | null;
  wallets: Wallet[];
  transactions: Transaction[];
  categories: Category[];
  goals: Goal[];
  debts: Debt[];
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useFinancialData = (): FinancialData => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const [
        profileRes,
        walletsRes,
        transactionsRes,
        categoriesRes,
        goalsRes,
        debtsRes,
      ] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
        supabase.from("wallets").select("*").order("created_at", { ascending: true }),
        supabase.from("transactions").select("*").order("date", { ascending: false }),
        supabase.from("categories").select("*").order("name", { ascending: true }),
        supabase.from("goals").select("*").order("created_at", { ascending: false }),
        supabase.from("debts").select("*").order("created_at", { ascending: false }),
      ]);

      if (profileRes.error) throw profileRes.error;
      if (walletsRes.error) throw walletsRes.error;
      if (transactionsRes.error) throw transactionsRes.error;
      if (categoriesRes.error) throw categoriesRes.error;
      if (goalsRes.error) throw goalsRes.error;
      if (debtsRes.error) throw debtsRes.error;

      setProfile(profileRes.data);
      setWallets(walletsRes.data || []);
      setTransactions(transactionsRes.data || []);
      setCategories(categoriesRes.data || []);
      setGoals(goalsRes.data || []);
      setDebts(debtsRes.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // Calculate totals
  const totalBalance = wallets.reduce((sum, wallet) => sum + Number(wallet.balance), 0);

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0];

  const monthlyTransactions = transactions.filter(
    (t) => t.date >= startOfMonth && t.date <= endOfMonth
  );

  const monthlyIncome = monthlyTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const monthlyExpenses = monthlyTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  return {
    profile,
    wallets,
    transactions,
    categories,
    goals,
    debts,
    totalBalance,
    monthlyIncome,
    monthlyExpenses,
    loading,
    error,
    refetch: fetchData,
  };
};
