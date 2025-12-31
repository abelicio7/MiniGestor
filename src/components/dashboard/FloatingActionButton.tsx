import { useState } from "react";
import { Tables } from "@/integrations/supabase/types";
import { Plus, TrendingUp, TrendingDown, Wallet, Target, CreditCard, X, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TransactionForm from "./forms/TransactionForm";
import WalletForm from "./forms/WalletForm";
import GoalForm from "./forms/GoalForm";
import DebtForm from "./forms/DebtForm";
import { toast } from "sonner";

type WalletType = Tables<"wallets">;
type Category = Tables<"categories">;

interface FloatingActionButtonProps {
  onActionComplete: () => Promise<void>;
  wallets: WalletType[];
  categories: Category[];
  hasFullAccess: boolean;
  onUpgradeClick: () => void;
}

type ActionType = "income" | "expense" | "wallet" | "goal" | "debt" | null;

interface ActionItem {
  type: ActionType;
  icon: typeof TrendingUp;
  label: string;
  color: string;
  requiresPro: boolean;
}

const actions: ActionItem[] = [
  { type: "income", icon: TrendingUp, label: "Entrada", color: "bg-success", requiresPro: true },
  { type: "expense", icon: TrendingDown, label: "Saída", color: "bg-destructive", requiresPro: true },
  { type: "wallet", icon: Wallet, label: "Carteira", color: "bg-primary", requiresPro: true },
  { type: "goal", icon: Target, label: "Meta", color: "bg-info", requiresPro: true },
  { type: "debt", icon: CreditCard, label: "Dívida", color: "bg-warning", requiresPro: true },
];

const FloatingActionButton = ({
  onActionComplete,
  wallets,
  categories,
  hasFullAccess,
  onUpgradeClick,
}: FloatingActionButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeAction, setActiveAction] = useState<ActionType>(null);

  const handleActionClick = (action: ActionItem) => {
    if (action.requiresPro && !hasFullAccess) {
      toast.error("Recurso bloqueado", {
        description: "Ative o Plano Pro para adicionar transações, metas e dívidas.",
        action: {
          label: "Ver Planos",
          onClick: () => onUpgradeClick(),
        },
      });
      setIsOpen(false);
      return;
    }
    setActiveAction(action.type);
    setIsOpen(false);
  };

  const handleClose = () => {
    setActiveAction(null);
  };

  const handleSuccess = async () => {
    await onActionComplete();
    handleClose();
  };

  const getDialogTitle = () => {
    switch (activeAction) {
      case "income":
        return "Registrar Entrada";
      case "expense":
        return "Registrar Saída";
      case "wallet":
        return "Nova Carteira";
      case "goal":
        return "Nova Meta";
      case "debt":
        return "Nova Dívida";
      default:
        return "";
    }
  };

  return (
    <>
      {/* FAB Menu */}
      <div className="fixed bottom-6 right-6 z-50">
        {isOpen && (
          <div className="absolute bottom-16 right-0 flex flex-col-reverse gap-3 mb-2 animate-fade-up">
            {actions.map((action) => {
              const isLocked = action.requiresPro && !hasFullAccess;
              return (
                <button
                  key={action.type}
                  onClick={() => handleActionClick(action)}
                  className="flex items-center gap-3 group"
                >
                  <span className="bg-card px-3 py-1.5 rounded-lg shadow-lg border border-border text-sm font-medium text-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap flex items-center gap-2">
                    {action.label}
                    {isLocked && <Lock className="w-3 h-3 text-muted-foreground" />}
                  </span>
                  <div
                    className={`w-12 h-12 ${action.color} rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform relative`}
                  >
                    <action.icon className="w-5 h-5 text-white" />
                    {isLocked && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-muted rounded-full flex items-center justify-center border-2 border-background">
                        <Lock className="w-3 h-3 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        <Button
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full shadow-lg shadow-primary/25 transition-transform ${
            isOpen ? "rotate-45" : ""
          }`}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
        </Button>
      </div>

      {/* Action Dialogs */}
      <Dialog open={activeAction !== null} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{getDialogTitle()}</DialogTitle>
          </DialogHeader>

          {(activeAction === "income" || activeAction === "expense") && (
            <TransactionForm
              type={activeAction}
              wallets={wallets}
              categories={categories.filter((c) => c.type === activeAction)}
              onSuccess={handleSuccess}
              onCancel={handleClose}
            />
          )}

          {activeAction === "wallet" && (
            <WalletForm onSuccess={handleSuccess} onCancel={handleClose} />
          )}

          {activeAction === "goal" && (
            <GoalForm onSuccess={handleSuccess} onCancel={handleClose} />
          )}

          {activeAction === "debt" && (
            <DebtForm onSuccess={handleSuccess} onCancel={handleClose} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FloatingActionButton;
