import { Tables } from "@/integrations/supabase/types";
import { AlertTriangle, TrendingDown, Target, CheckCircle } from "lucide-react";

type Goal = Tables<"goals">;

interface AlertsSectionProps {
  monthlyIncome: number;
  monthlyExpenses: number;
  totalBalance: number;
  goals: Goal[];
}

interface Alert {
  type: "warning" | "danger" | "success";
  icon: React.ReactNode;
  message: string;
}

const AlertsSection = ({
  monthlyIncome,
  monthlyExpenses,
  totalBalance,
  goals,
}: AlertsSectionProps) => {
  const alerts: Alert[] = [];

  // Check if expenses > income
  if (monthlyExpenses > monthlyIncome && monthlyIncome > 0) {
    alerts.push({
      type: "danger",
      icon: <TrendingDown className="w-4 h-4" />,
      message: "Seus gastos estão maiores que suas entradas este mês.",
    });
  }

  // Calculate days remaining and daily average
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const dayOfMonth = now.getDate();
  const daysRemaining = daysInMonth - dayOfMonth;

  if (daysRemaining > 0 && monthlyExpenses > 0) {
    const dailyAverage = monthlyExpenses / dayOfMonth;
    const projectedExpenses = dailyAverage * daysInMonth;
    
    if (projectedExpenses > totalBalance && totalBalance > 0) {
      const daysUntilEmpty = Math.floor(totalBalance / dailyAverage);
      if (daysUntilEmpty < daysRemaining) {
        alerts.push({
          type: "warning",
          icon: <AlertTriangle className="w-4 h-4" />,
          message: `Se continuar assim, o dinheiro acaba em ${daysUntilEmpty} dias.`,
        });
      }
    }
  }

  // Check completed goals
  const completedGoals = goals.filter(
    (g) => g.status === "active" && Number(g.current_amount) >= Number(g.target_amount)
  );
  
  if (completedGoals.length > 0) {
    alerts.push({
      type: "success",
      icon: <CheckCircle className="w-4 h-4" />,
      message: `Parabéns! Você alcançou ${completedGoals.length} meta${completedGoals.length > 1 ? "s" : ""}!`,
    });
  }

  // Check if saving more this month
  if (monthlyIncome > monthlyExpenses && monthlyIncome > 0) {
    const savingRate = ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100;
    if (savingRate >= 10) {
      alerts.push({
        type: "success",
        icon: <Target className="w-4 h-4" />,
        message: `Você está poupando ${savingRate.toFixed(0)}% das suas entradas este mês!`,
      });
    }
  }

  if (alerts.length === 0) return null;

  return (
    <div className="space-y-3">
      {alerts.map((alert, index) => (
        <div
          key={index}
          className={`flex items-center gap-3 p-4 rounded-xl border ${
            alert.type === "danger"
              ? "bg-destructive/10 border-destructive/20 text-destructive"
              : alert.type === "warning"
              ? "bg-warning/10 border-warning/20 text-warning"
              : "bg-success/10 border-success/20 text-success"
          }`}
        >
          {alert.icon}
          <p className="text-sm font-medium">{alert.message}</p>
        </div>
      ))}
    </div>
  );
};

export default AlertsSection;
