import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

type Wallet = Tables<"wallets">;
type Category = Tables<"categories">;

interface TransactionFormProps {
  type: "income" | "expense";
  wallets: Wallet[];
  categories: Category[];
  onSuccess: () => void;
  onCancel: () => void;
}

const TransactionForm = ({
  type,
  wallets,
  categories,
  onSuccess,
  onCancel,
}: TransactionFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [amount, setAmount] = useState("");
  const [walletId, setWalletId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [note, setNote] = useState("");
  const [essential, setEssential] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    if (!amount || !walletId) {
      toast({
        title: "Erro",
        description: "Preencha o valor e selecione uma carteira.",
        variant: "destructive",
      });
      return;
    }

    const numericAmount = parseFloat(amount.replace(/[^\d.,]/g, "").replace(",", "."));
    
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
      const { error } = await supabase.from("transactions").insert({
        user_id: user.id,
        wallet_id: walletId,
        category_id: categoryId || null,
        type,
        amount: numericAmount,
        date,
        note: note || null,
        essential,
      });

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: type === "income" ? "Entrada registrada." : "Saída registrada.",
      });

      onSuccess();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível registrar a transação.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="amount">Valor *</Label>
        <Input
          id="amount"
          type="text"
          placeholder="0,00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={isLoading}
          autoFocus
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="wallet">Carteira *</Label>
        <Select value={walletId} onValueChange={setWalletId} disabled={isLoading}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma carteira" />
          </SelectTrigger>
          <SelectContent>
            {wallets.map((wallet) => (
              <SelectItem key={wallet.id} value={wallet.id}>
                {wallet.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {wallets.length === 0 && (
          <p className="text-xs text-muted-foreground">
            Crie uma carteira primeiro.
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Categoria</Label>
        <Select value={categoryId} onValueChange={setCategoryId} disabled={isLoading}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma categoria" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Data</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="note">Nota</Label>
        <Textarea
          id="note"
          placeholder="Descrição opcional..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          disabled={isLoading}
          rows={2}
        />
      </div>

      {type === "expense" && (
        <div className="flex items-center gap-2">
          <Checkbox
            id="essential"
            checked={essential}
            onCheckedChange={(checked) => setEssential(checked === true)}
            disabled={isLoading}
          />
          <Label htmlFor="essential" className="text-sm font-normal cursor-pointer">
            Gasto essencial (alimentação, saúde, etc.)
          </Label>
        </div>
      )}

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
            "Salvar"
          )}
        </Button>
      </div>
    </form>
  );
};

export default TransactionForm;
