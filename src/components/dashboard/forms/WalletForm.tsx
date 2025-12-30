import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Banknote, Smartphone, Building2 } from "lucide-react";

const walletTypes = [
  { value: "cash", label: "Dinheiro", icon: Banknote },
  { value: "mobile", label: "Mobile Money (M-Pesa, e-Mola)", icon: Smartphone },
  { value: "bank", label: "Banco", icon: Building2 },
] as const;

const walletColors = [
  { value: "#10B981", label: "Verde" },
  { value: "#3B82F6", label: "Azul" },
  { value: "#EF4444", label: "Vermelho" },
  { value: "#8B5CF6", label: "Roxo" },
  { value: "#F59E0B", label: "Laranja" },
  { value: "#EC4899", label: "Rosa" },
];

interface WalletFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const WalletForm = ({ onSuccess, onCancel }: WalletFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [name, setName] = useState("");
  const [type, setType] = useState<"cash" | "mobile" | "bank">("cash");
  const [color, setColor] = useState("#10B981");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    if (!name.trim()) {
      toast({
        title: "Erro",
        description: "Digite um nome para a carteira.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.from("wallets").insert({
        user_id: user.id,
        name: name.trim(),
        type,
        color,
        balance: 0,
      });

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Carteira criada.",
      });

      onSuccess();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível criar a carteira.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome *</Label>
        <Input
          id="name"
          type="text"
          placeholder="Ex: M-Pesa, Dinheiro, Millennium"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
          autoFocus
        />
      </div>

      <div className="space-y-2">
        <Label>Tipo *</Label>
        <div className="grid grid-cols-3 gap-2">
          {walletTypes.map((wt) => (
            <button
              key={wt.value}
              type="button"
              onClick={() => setType(wt.value)}
              disabled={isLoading}
              className={`p-3 rounded-lg border text-center transition-colors ${
                type === wt.value
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <wt.icon className={`w-5 h-5 mx-auto mb-1 ${type === wt.value ? "text-primary" : "text-muted-foreground"}`} />
              <span className={`text-xs ${type === wt.value ? "text-primary font-medium" : "text-muted-foreground"}`}>
                {wt.label.split(" ")[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Cor</Label>
        <div className="flex gap-2 flex-wrap">
          {walletColors.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setColor(c.value)}
              disabled={isLoading}
              className={`w-8 h-8 rounded-full border-2 transition-transform ${
                color === c.value ? "border-foreground scale-110" : "border-transparent"
              }`}
              style={{ backgroundColor: c.value }}
              title={c.label}
            />
          ))}
        </div>
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
            "Criar Carteira"
          )}
        </Button>
      </div>
    </form>
  );
};

export default WalletForm;
