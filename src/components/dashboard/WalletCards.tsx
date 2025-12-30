import { Tables } from "@/integrations/supabase/types";
import { Banknote, Smartphone, Building2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type Wallet = Tables<"wallets">;

interface WalletCardsProps {
  wallets: Wallet[];
  currency: string;
}

const formatCurrency = (value: number, currency: string) => {
  return new Intl.NumberFormat("pt-MZ", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value) + " " + currency;
};

const getWalletIcon = (type: string) => {
  switch (type) {
    case "cash":
      return Banknote;
    case "mobile":
      return Smartphone;
    case "bank":
      return Building2;
    default:
      return Banknote;
  }
};

const getWalletColor = (name: string, type: string) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes("m-pesa") || lowerName.includes("mpesa")) {
    return "bg-wallet-mpesa";
  }
  if (lowerName.includes("e-mola") || lowerName.includes("emola")) {
    return "bg-wallet-emola";
  }
  if (type === "bank") {
    return "bg-wallet-bank";
  }
  return "bg-wallet-cash";
};

const WalletCards = ({ wallets, currency }: WalletCardsProps) => {
  if (wallets.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border p-6 text-center">
        <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
          <Plus className="w-6 h-6 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground mb-2">Nenhuma carteira ainda</p>
        <p className="text-sm text-muted-foreground">
          Use o botão + para adicionar sua primeira carteira
        </p>
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
      {wallets.map((wallet) => {
        const Icon = getWalletIcon(wallet.type);
        const colorClass = getWalletColor(wallet.name, wallet.type);

        return (
          <div
            key={wallet.id}
            className="bg-card rounded-xl border border-border p-4 min-w-[160px] flex-shrink-0 hover:border-primary/50 transition-colors"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-8 h-8 ${colorClass} rounded-lg flex items-center justify-center`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-foreground truncate">{wallet.name}</span>
            </div>
            <p className="text-lg font-bold text-foreground">
              {formatCurrency(Number(wallet.balance), currency)}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default WalletCards;
