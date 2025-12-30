import { TrendingUp, TrendingDown, Wallet } from "lucide-react";

interface BalanceCardProps {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  currency: string;
}

const formatCurrency = (value: number, currency: string) => {
  return new Intl.NumberFormat("pt-MZ", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value) + " " + currency;
};

const BalanceCard = ({
  totalBalance,
  monthlyIncome,
  monthlyExpenses,
  currency,
}: BalanceCardProps) => {
  return (
    <div className="bg-primary rounded-2xl p-6 text-primary-foreground shadow-lg shadow-primary/20">
      <div className="flex items-center gap-2 mb-2">
        <Wallet className="w-5 h-5 text-primary-foreground/80" />
        <span className="text-primary-foreground/80 text-sm font-medium">Saldo Total</span>
      </div>
      
      <p className="text-4xl md:text-5xl font-bold mb-6">
        {formatCurrency(totalBalance, currency)}
      </p>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-primary-foreground/10 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 bg-success/20 rounded-full flex items-center justify-center">
              <TrendingUp className="w-3 h-3 text-success" />
            </div>
            <span className="text-primary-foreground/70 text-xs">Entradas</span>
          </div>
          <p className="text-lg font-semibold">{formatCurrency(monthlyIncome, currency)}</p>
        </div>

        <div className="bg-primary-foreground/10 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 bg-destructive/20 rounded-full flex items-center justify-center">
              <TrendingDown className="w-3 h-3 text-destructive" />
            </div>
            <span className="text-primary-foreground/70 text-xs">Saídas</span>
          </div>
          <p className="text-lg font-semibold">{formatCurrency(monthlyExpenses, currency)}</p>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;
