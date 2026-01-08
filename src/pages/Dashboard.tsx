import { useState } from "react";
import { useAuth, ProtectedRoute } from "@/hooks/useAuth";
import { useFinancialData } from "@/hooks/useFinancialData";
import { useTrialStatus } from "@/hooks/useTrialStatus";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import BalanceCard from "@/components/dashboard/BalanceCard";
import WalletCards from "@/components/dashboard/WalletCards";
import ExpenseChart from "@/components/dashboard/ExpenseChart";
import IncomeExpenseChart from "@/components/dashboard/IncomeExpenseChart";
import GoalsSection from "@/components/dashboard/GoalsSection";
import { DebtsSection } from "@/components/dashboard/DebtsSection";
import AlertsSection from "@/components/dashboard/AlertsSection";
import FloatingActionButton from "@/components/dashboard/FloatingActionButton";
import TrialBanner from "@/components/dashboard/TrialBanner";
import UpgradeDialog from "@/components/dashboard/UpgradeDialog";
import LockedFeature from "@/components/dashboard/LockedFeature";
import { Loader2 } from "lucide-react";

const DashboardContent = () => {
  const { user } = useAuth();
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const {
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
    refetch,
  } = useFinancialData();

  const trialStatus = useTrialStatus(profile);

  if (loading || trialStatus.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const currency = profile?.currency || "MZN";
  const { hasFullAccess, status, daysRemaining } = trialStatus;

  return (
    <div className="min-h-screen bg-background pb-24">
      <DashboardHeader userName={profile?.name || "Usuário"} />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Trial Banner */}
        <TrialBanner
          status={status}
          daysRemaining={daysRemaining}
          onUpgrade={() => setUpgradeOpen(true)}
        />

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
        <LockedFeature
          isLocked={!hasFullAccess}
          message="Alertas Inteligentes"
          onUnlock={() => setUpgradeOpen(true)}
        >
          <AlertsSection
            monthlyIncome={monthlyIncome}
            monthlyExpenses={monthlyExpenses}
            totalBalance={totalBalance}
            goals={goals}
          />
        </LockedFeature>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LockedFeature
            isLocked={!hasFullAccess}
            message="Gráfico de Despesas"
            onUnlock={() => setUpgradeOpen(true)}
          >
            <ExpenseChart
              transactions={transactions}
              categories={categories}
              currency={currency}
            />
          </LockedFeature>
          <LockedFeature
            isLocked={!hasFullAccess}
            message="Receita vs Despesa"
            onUnlock={() => setUpgradeOpen(true)}
          >
            <IncomeExpenseChart
              transactions={transactions}
              currency={currency}
            />
          </LockedFeature>
        </div>

        {/* Goals */}
        <LockedFeature
          isLocked={!hasFullAccess}
          message="Metas Financeiras"
          onUnlock={() => setUpgradeOpen(true)}
        >
          <GoalsSection goals={goals} currency={currency} onUpdate={refetch} />
        </LockedFeature>

        {/* Debts */}
        <LockedFeature
          isLocked={!hasFullAccess}
          message="Gestão de Dívidas"
          onUnlock={() => setUpgradeOpen(true)}
        >
          <DebtsSection debts={debts} onUpdate={refetch} />
        </LockedFeature>
      </main>

      {/* FAB */}
      <FloatingActionButton
        onActionComplete={refetch}
        wallets={wallets}
        categories={categories}
        hasFullAccess={hasFullAccess}
        onUpgradeClick={() => setUpgradeOpen(true)}
      />

      {/* Upgrade Dialog */}
      <UpgradeDialog open={upgradeOpen} onOpenChange={setUpgradeOpen} />
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
