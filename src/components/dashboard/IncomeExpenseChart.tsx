import { useMemo } from "react";
import { Tables } from "@/integrations/supabase/types";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts";

type Transaction = Tables<"transactions">;

interface IncomeExpenseChartProps {
  transactions: Transaction[];
  currency: string;
}

const IncomeExpenseChart = ({ transactions, currency }: IncomeExpenseChartProps) => {
  const data = useMemo(() => {
    const now = new Date();
    const months: { name: string; income: number; expense: number }[] = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "");
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split("T")[0];
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split("T")[0];

      const monthTransactions = transactions.filter(
        (t) => t.date >= startOfMonth && t.date <= endOfMonth
      );

      const income = monthTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const expense = monthTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + Number(t.amount), 0);

      months.push({
        name: monthName.charAt(0).toUpperCase() + monthName.slice(1),
        income,
        expense,
      });
    }

    return months;
  }, [transactions]);

  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + "M";
    }
    if (value >= 1000) {
      return (value / 1000).toFixed(0) + "k";
    }
    return value.toFixed(0);
  };

  const formatTooltipValue = (value: number) => {
    return new Intl.NumberFormat("pt-MZ", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value) + " " + currency;
  };

  const hasData = data.some((d) => d.income > 0 || d.expense > 0);

  if (!hasData) {
    return (
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="font-semibold text-foreground mb-4">Entradas vs Saídas</h3>
        <div className="h-64 flex items-center justify-center text-muted-foreground">
          Sem dados para exibir
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <h3 className="font-semibold text-foreground mb-4">Entradas vs Saídas</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={4}>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              tickFormatter={formatValue}
            />
            <Tooltip
              formatter={(value: number, name: string) => [
                formatTooltipValue(value),
                name === "income" ? "Entradas" : "Saídas",
              ]}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
              }}
            />
            <Legend
              formatter={(value) => (value === "income" ? "Entradas" : "Saídas")}
            />
            <Bar dataKey="income" fill="hsl(160, 84%, 39%)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" fill="hsl(0, 84%, 60%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IncomeExpenseChart;
