import { useState } from "react";
import { Tables } from "@/integrations/supabase/types";
import { Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import GoalDetailDialog from "./GoalDetailDialog";

type Goal = Tables<"goals">;

interface GoalsSectionProps {
  goals: Goal[];
  currency: string;
  onUpdate: () => void;
}

const formatCurrency = (value: number, currency: string) => {
  return new Intl.NumberFormat("pt-MZ", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value) + " " + currency;
};

const GoalsSection = ({ goals, currency, onUpdate }: GoalsSectionProps) => {
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const activeGoals = goals.filter((g) => g.status === "active");

  const handleGoalClick = (goal: Goal) => {
    setSelectedGoal(goal);
    setDialogOpen(true);
  };

  if (activeGoals.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Metas Financeiras</h3>
        </div>
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
            <Target className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground mb-2">Nenhuma meta ainda</p>
          <p className="text-sm text-muted-foreground">
            Use o botão + para criar sua primeira meta
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Metas Financeiras</h3>
        </div>
        
        <div className="space-y-4">
          {activeGoals.slice(0, 3).map((goal) => {
            const current = Number(goal.current_amount);
            const target = Number(goal.target_amount);
            const progress = target > 0 ? Math.min((current / target) * 100, 100) : 0;
            const isComplete = progress >= 100;

            return (
              <div
                key={goal.id}
                className="space-y-2 p-3 -m-3 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleGoalClick(goal)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground text-sm">{goal.name}</span>
                  <span className={`text-xs ${isComplete ? "text-green-600 font-medium" : "text-muted-foreground"}`}>
                    {progress.toFixed(0)}%
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formatCurrency(current, currency)}</span>
                  <span>{formatCurrency(target, currency)}</span>
                </div>
                {goal.deadline && (
                  <p className="text-xs text-muted-foreground">
                    Prazo: {new Date(goal.deadline).toLocaleDateString("pt-BR")}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <GoalDetailDialog
        goal={selectedGoal}
        currency={currency}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onUpdate={onUpdate}
      />
    </>
  );
};

export default GoalsSection;
