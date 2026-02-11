import { useNavigate } from "react-router-dom";
import { Crown, Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface UpgradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const features = [
  "Dashboard visual completo",
  "Carteiras ilimitadas",
  "Categorias personalizadas",
  "Metas e alertas inteligentes",
  "Histórico completo de transações",
  "Exportar relatórios PDF/Excel",
  "Gestão de dívidas",
  "Suporte prioritário",
];

const UpgradeDialog = ({ open, onOpenChange }: UpgradeDialogProps) => {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    onOpenChange(false);
    navigate("/checkout");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center mb-4">
            <Crown className="w-8 h-8 text-primary-foreground" />
          </div>
          <DialogTitle className="text-2xl">Upgrade para Pro</DialogTitle>
          <DialogDescription>
            Desbloqueie todos os recursos e mantenha o controle total das suas finanças.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-6 border border-primary/20">
            <div className="flex items-baseline justify-center gap-1 mb-6">
              <span className="text-4xl font-bold text-foreground">MT 99</span>
              <span className="text-muted-foreground">/mês</span>
            </div>

            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-success" />
                  </div>
                  <span className="text-sm text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleUpgrade}
            className="w-full h-12 text-lg bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25"
          >
            <Zap className="w-5 h-5 mr-2" />
            Ativar Plano Pro
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Pagamento seguro • Cancele a qualquer momento
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeDialog;
