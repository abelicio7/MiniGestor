import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface GoalFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const GoalForm = ({ onSuccess, onCancel }: GoalFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    if (!name.trim() || !targetAmount) {
      toast({
        title: "Erro",
        description: "Preencha o nome e o valor da meta.",
        variant: "destructive",
      });
      return;
    }

    const numericAmount = parseFloat(targetAmount.replace(/[^\d.,]/g, "").replace(",", "."));
    
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast({
        title: "Erro",
        description: "Digite um valor válido.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.from("goals").insert({
        user_id: user.id,
        name: name.trim(),
        target_amount: numericAmount,
        current_amount: 0,
        deadline: deadline || null,
        status: "active",
      });

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Meta criada.",
      });

      onSuccess();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível criar a meta.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome da Meta *</Label>
        <Input
          id="name"
          type="text"
          placeholder="Ex: Fundo de emergência, Viagem, etc."
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
          autoFocus
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="targetAmount">Valor Objetivo *</Label>
        <Input
          id="targetAmount"
          type="text"
          placeholder="0,00"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="deadline">Prazo (opcional)</Label>
        <Input
          id="deadline"
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Criando...
            </>
          ) : (
            "Criar Meta"
          )}
        </Button>
      </div>
    </form>
  );
};

export default GoalForm;
