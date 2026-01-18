import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tables } from "@/integrations/supabase/types";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { Receipt, ArrowDownCircle } from "lucide-react";

type Transaction = Tables<"transactions">;
type Category = Tables<"categories">;

interface ExpensesListProps {
  transactions: Transaction[];
  categories: Category[];
  currency: string;
}

const ExpensesList = ({ transactions, categories, currency }: ExpensesListProps) => {
  const expenses = useMemo(() => {
    return transactions
      .filter((t) => t.type === "expense")
      .slice(0, 20); // Show last 20 expenses
  }, [transactions]);

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return "Sem categoria";
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || "Sem categoria";
  };

  const getCategoryColor = (categoryId: string | null) => {
    if (!categoryId) return "#6b7280";
    const category = categories.find((c) => c.id === categoryId);
    return category?.color || "#6b7280";
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-MZ", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    }).format(value);
  };

  if (expenses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Receipt className="w-5 h-5 text-primary" />
            Últimas Despesas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <ArrowDownCircle className="w-12 h-12 mb-3 opacity-50" />
            <p>Nenhuma despesa registrada</p>
            <p className="text-sm">Adicione sua primeira despesa usando o botão +</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Receipt className="w-5 h-5 text-primary" />
          Últimas Despesas
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="divide-y divide-border">
            {expenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: getCategoryColor(expense.category_id) }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">
                        {expense.note || getCategoryName(expense.category_id)}
                      </span>
                      {expense.essential && (
                        <Badge variant="secondary" className="text-xs flex-shrink-0">
                          Essencial
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{getCategoryName(expense.category_id)}</span>
                      <span>•</span>
                      <span>
                        {format(new Date(expense.date), "dd MMM yyyy", { locale: pt })}
                      </span>
                    </div>
                  </div>
                </div>
                <span className="font-semibold text-destructive flex-shrink-0 ml-2">
                  -{formatCurrency(Number(expense.amount))}
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ExpensesList;
