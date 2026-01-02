import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

type Goal = Tables<"goals">;

interface GoalContributionFormProps {
  goal: Goal;
  currency: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const GoalContributionForm = ({ goal, currency, onSuccess, onCancel }: GoalContributionFormProps) => {
  const { user } = useAuth();
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const remaining = Number(goal.target_amount) - Number(goal.current_amount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Você precisa estar logado");
      return;
    }

    const contributionAmount = parseFloat(amount.replace(",", "."));
    if (isNaN(contributionAmount) || contributionAmount <= 0) {
      toast.error("Insira um valor válido");
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.from("goal_contributions").insert({
      goal_id: goal.id,
      user_id: user.id,
      amount: contributionAmount,
      note: note.trim() || null,
    });

    setIsLoading(false);

    if (error) {
      console.error("Error adding contribution:", error);
      toast.error("Erro ao registrar contribuição");
      return;
    }

    toast.success("Contribuição registrada com sucesso!");
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="amount">Valor da Contribuição ({currency})</Label>
        <Input
          id="amount"
          type="text"
          inputMode="decimal"
          placeholder={`Máximo: ${remaining.toLocaleString("pt-MZ")}`}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <p className="text-xs text-muted-foreground">
          Faltam {remaining.toLocaleString("pt-MZ")} {currency} para atingir a meta
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="note">Nota (opcional)</Label>
        <Textarea
          id="note"
          placeholder="Ex: Depósito mensal"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Registrar"}
        </Button>
      </div>
    </form>
  );
};

export default GoalContributionForm;
