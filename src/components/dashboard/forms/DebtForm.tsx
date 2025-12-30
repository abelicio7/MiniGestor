import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface DebtFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const DebtForm = ({ onSuccess, onCancel }: DebtFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [creditor, setCreditor] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState("");
  const [dueDay, setDueDay] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    if (!creditor.trim() || !totalAmount) {
      toast({
        title: "Erro",
        description: "Preencha o credor e o valor total.",
        variant: "destructive",
      });
      return;
    }

    const numericTotal = parseFloat(totalAmount.replace(/[^\d.,]/g, "").replace(",", "."));
    
    if (isNaN(numericTotal) || numericTotal <= 0) {
      toast({
        title: "Erro",
        description: "Digite um valor válido.",
        variant: "destructive",
      });
      return;
    }

    const numericMonthly = monthlyPayment
      ? parseFloat(monthlyPayment.replace(/[^\d.,]/g, "").replace(",", "."))
      : null;

    const numericDueDay = dueDay ? parseInt(dueDay) : null;

    setIsLoading(true);

    try {
      const { error } = await supabase.from("debts").insert({
        user_id: user.id,
        creditor: creditor.trim(),
        total_amount: numericTotal,
        remaining_amount: numericTotal,
        monthly_payment: numericMonthly,
        due_day: numericDueDay,
        status: "active",
      });

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Dívida registrada.",
      });

      onSuccess();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível registrar a dívida.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="creditor">Credor *</Label>
        <Input
          id="creditor"
          type="text"
          placeholder="Ex: Banco, Amigo, Loja, etc."
          value={creditor}
          onChange={(e) => setCreditor(e.target.value)}
          disabled={isLoading}
          autoFocus
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="totalAmount">Valor Total *</Label>
        <Input
          id="totalAmount"
          type="text"
          placeholder="0,00"
          value={totalAmount}
          onChange={(e) => setTotalAmount(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="monthlyPayment">Prestação Mensal (opcional)</Label>
        <Input
          id="monthlyPayment"
          type="text"
          placeholder="0,00"
          value={monthlyPayment}
          onChange={(e) => setMonthlyPayment(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dueDay">Dia de Vencimento (opcional)</Label>
        <Input
          id="dueDay"
          type="number"
          placeholder="Ex: 15"
          min="1"
          max="31"
          value={dueDay}
          onChange={(e) => setDueDay(e.target.value)}
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
              Salvando...
            </>
          ) : (
            "Registrar Dívida"
          )}
        </Button>
      </div>
    </form>
  );
};

export default DebtForm;
