import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tables } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Plus, Trash2, CheckCircle, Target, Calendar, Loader2 } from "lucide-react";
import GoalContributionForm from "./forms/GoalContributionForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Goal = Tables<"goals">;

interface GoalContribution {
  id: string;
  amount: number;
  note: string | null;
  created_at: string;
}

interface GoalDetailDialogProps {
  goal: Goal | null;
  currency: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

const formatCurrency = (value: number, currency: string) => {
  return new Intl.NumberFormat("pt-MZ", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value) + " " + currency;
};

const GoalDetailDialog = ({ goal, currency, open, onOpenChange, onUpdate }: GoalDetailDialogProps) => {
  const { user } = useAuth();
  const [showContributionForm, setShowContributionForm] = useState(false);
  const [contributions, setContributions] = useState<GoalContribution[]>([]);
  const [loadingContributions, setLoadingContributions] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    if (goal && open) {
      fetchContributions();
    }
  }, [goal, open]);

  const fetchContributions = async () => {
    if (!goal) return;
    setLoadingContributions(true);
    const { data, error } = await supabase
      .from("goal_contributions")
      .select("*")
      .eq("goal_id", goal.id)
      .order("created_at", { ascending: false });

    setLoadingContributions(false);
    if (!error && data) {
      setContributions(data);
    }
  };

  const handleContributionSuccess = () => {
    setShowContributionForm(false);
    fetchContributions();
    onUpdate();
  };

  const handleDeleteGoal = async () => {
    if (!goal) return;
    setIsDeleting(true);
    const { error } = await supabase.from("goals").delete().eq("id", goal.id);
    setIsDeleting(false);
    setShowDeleteAlert(false);

    if (error) {
      toast.error("Erro ao excluir meta");
      return;
    }

    toast.success("Meta excluída com sucesso");
    onOpenChange(false);
    onUpdate();
  };

  const handleCompleteGoal = async () => {
    if (!goal) return;
    setIsCompleting(true);
    const { error } = await supabase
      .from("goals")
      .update({ status: "completed" })
      .eq("id", goal.id);
    setIsCompleting(false);

    if (error) {
      toast.error("Erro ao completar meta");
      return;
    }

    toast.success("Parabéns! Meta concluída! 🎉");
    onOpenChange(false);
    onUpdate();
  };

  if (!goal) return null;

  const current = Number(goal.current_amount);
  const target = Number(goal.target_amount);
  const progress = target > 0 ? Math.min((current / target) * 100, 100) : 0;
  const isComplete = progress >= 100;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              {goal.name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Progress Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Progresso</span>
                <span className={`text-sm font-medium ${isComplete ? "text-green-600" : ""}`}>
                  {progress.toFixed(0)}%
                </span>
              </div>
              <Progress value={progress} className="h-3" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Atual: <span className="text-foreground font-medium">{formatCurrency(current, currency)}</span>
                </span>
                <span className="text-muted-foreground">
                  Meta: <span className="text-foreground font-medium">{formatCurrency(target, currency)}</span>
                </span>
              </div>
              {goal.deadline && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  Prazo: {new Date(goal.deadline).toLocaleDateString("pt-BR")}
                </div>
              )}
            </div>

            {/* Contribution Form */}
            {showContributionForm ? (
              <GoalContributionForm
                goal={goal}
                currency={currency}
                onSuccess={handleContributionSuccess}
                onCancel={() => setShowContributionForm(false)}
              />
            ) : (
              <Button
                onClick={() => setShowContributionForm(true)}
                className="w-full"
                disabled={isComplete}
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Contribuição
              </Button>
            )}

            {/* Contributions History */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Histórico de Contribuições</h4>
              {loadingContributions ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
              ) : contributions.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhuma contribuição ainda
                </p>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {contributions.map((c) => (
                    <div key={c.id} className="flex items-center justify-between bg-muted/50 rounded-lg p-3">
                      <div>
                        <p className="text-sm font-medium">{formatCurrency(c.amount, currency)}</p>
                        {c.note && <p className="text-xs text-muted-foreground">{c.note}</p>}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(c.created_at).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2 border-t">
              {isComplete && goal.status === "active" && (
                <Button
                  variant="default"
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={handleCompleteGoal}
                  disabled={isCompleting}
                >
                  {isCompleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Concluir Meta
                    </>
                  )}
                </Button>
              )}
              <Button
                variant="destructive"
                onClick={() => setShowDeleteAlert(true)}
                className={isComplete && goal.status === "active" ? "" : "flex-1"}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Meta</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a meta "{goal.name}"? 
              Esta ação não pode ser desfeita e todo o histórico de contribuições será perdido.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteGoal}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default GoalDetailDialog;
