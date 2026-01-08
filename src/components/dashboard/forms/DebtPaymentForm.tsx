import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface DebtPaymentFormProps {
  debtId: string;
  remainingAmount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export const DebtPaymentForm = ({
  debtId,
  remainingAmount,
  onSuccess,
  onCancel,
}: DebtPaymentFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const paymentAmount = parseFloat(amount);
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      toast({
        title: "Erro",
        description: "Insira um valor válido",
        variant: "destructive",
      });
      return;
    }

    if (paymentAmount > remainingAmount) {
      toast({
        title: "Erro",
        description: "O valor não pode exceder o saldo restante",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("debt_payments").insert({
        debt_id: debtId,
        user_id: user.id,
        amount: paymentAmount,
        note: note || null,
      });

      if (error) throw error;

      toast({
        title: "Pagamento registrado",
        description: `Pagamento de ${paymentAmount.toLocaleString("pt-MZ")} MT registrado com sucesso`,
      });
      onSuccess();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível registrar o pagamento",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="amount">Valor do Pagamento (MT)</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          min="0.01"
          max={remainingAmount}
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <p className="text-xs text-muted-foreground">
          Saldo restante: {remainingAmount.toLocaleString("pt-MZ")} MT
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="note">Nota (opcional)</Label>
        <Textarea
          id="note"
          placeholder="Ex: Pagamento parcial via M-Pesa"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" disabled={loading} className="flex-1">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Registrar Pagamento
        </Button>
      </div>
    </form>
  );
};
