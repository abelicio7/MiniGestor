import { useAuth, ProtectedRoute } from "@/hooks/useAuth";
import { useFinancialData } from "@/hooks/useFinancialData";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import BalanceCard from "@/components/dashboard/BalanceCard";
import WalletCards from "@/components/dashboard/WalletCards";
import ExpenseChart from "@/components/dashboard/ExpenseChart";
import IncomeExpenseChart from "@/components/dashboard/IncomeExpenseChart";
import GoalsSection from "@/components/dashboard/GoalsSection";
import AlertsSection from "@/components/dashboard/AlertsSection";
import FloatingActionButton from "@/components/dashboard/FloatingActionButton";
import { Loader2 } from "lucide-react";

const DashboardContent = () => {
  const { user } = useAuth();
  const {
    profile,
    wallets,
    transactions,
    categories,
    goals,
    totalBalance,
    monthlyIncome,
    monthlyExpenses,
    loading,
    refetch,
  } = useFinancialData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const currency = profile?.currency || "MZN";

  return (
    <div className="min-h-screen bg-background pb-24">
      <DashboardHeader userName={profile?.name || "Usuário"} />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Total Balance */}
        <BalanceCard
          totalBalance={totalBalance}
          monthlyIncome={monthlyIncome}
          monthlyExpenses={monthlyExpenses}
          currency={currency}
        />

        {/* Wallet Cards */}
        <WalletCards wallets={wallets} currency={currency} />

        {/* Alerts */}
        <AlertsSection
          monthlyIncome={monthlyIncome}
          monthlyExpenses={monthlyExpenses}
          totalBalance={totalBalance}
          goals={goals}
        />

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ExpenseChart
            transactions={transactions}
            categories={categories}
            currency={currency}
          />
          <IncomeExpenseChart
            transactions={transactions}
            currency={currency}
          />
        </div>

        {/* Goals */}
        <GoalsSection goals={goals} currency={currency} />
      </main>

      {/* FAB */}
      <FloatingActionButton onActionComplete={refetch} wallets={wallets} categories={categories} />
    </div>
  );
};

const Dashboard = () => {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
};

export default Dashboard;
