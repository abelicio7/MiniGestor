import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tables } from "@/integrations/supabase/types";
import { DebtDetailDialog } from "./DebtDetailDialog";
import { Wallet, Calendar } from "lucide-react";

type Debt = Tables<"debts">;

interface DebtsSectionProps {
  debts: Debt[];
  onUpdate: () => void;
}

export const DebtsSection = ({ debts, onUpdate }: DebtsSectionProps) => {
  const [selectedDebt, setSelectedDebt] = useState<Debt | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const activeDebts = debts.filter((d) => d.status === "active");
  const totalDebt = activeDebts.reduce((sum, d) => sum + Number(d.remaining_amount), 0);

  const handleDebtClick = (debt: Debt) => {
    setSelectedDebt(debt);
    setDialogOpen(true);
  };

  if (debts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Wallet className="h-5 w-5 text-destructive" />
            Dívidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            <Wallet className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Nenhuma dívida registrada</p>
            <p className="text-sm">Use o botão + para adicionar uma dívida</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center gap-2">
              <Wallet className="h-5 w-5 text-destructive" />
              Dívidas
            </CardTitle>
            {totalDebt > 0 && (
              <Badge variant="destructive">
                Total: {totalDebt.toLocaleString("pt-MZ")} MT
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {debts.map((debt) => {
            const paidAmount = Number(debt.total_amount) - Number(debt.remaining_amount);
            const progress = (paidAmount / Number(debt.total_amount)) * 100;
            const isPaid = debt.status === "paid" || Number(debt.remaining_amount) <= 0;

            return (
              <div
                key={debt.id}
                onClick={() => handleDebtClick(debt)}
                className="p-4 rounded-lg border bg-card hover:bg-accent/50 cursor-pointer transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">{debt.creditor}</h4>
                    <p className="text-sm text-muted-foreground">
                      {Number(debt.remaining_amount).toLocaleString("pt-MZ")} MT restante
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant={isPaid ? "default" : "secondary"} className="mb-1">
                      {isPaid ? "Quitada" : "Ativa"}
                    </Badge>
                    {debt.due_day && !isPaid && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                        <Calendar className="h-3 w-3" />
                        Dia {debt.due_day}
                      </p>
                    )}
                  </div>
                </div>
                <Progress value={progress} className="h-2" />
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>{progress.toFixed(0)}% pago</span>
                  <span>{Number(debt.total_amount).toLocaleString("pt-MZ")} MT</span>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <DebtDetailDialog
        debt={selectedDebt}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onUpdate={onUpdate}
      />
    </>
  );
};
