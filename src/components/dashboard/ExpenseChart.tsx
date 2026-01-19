import { useMemo } from "react";
import { Tables } from "@/integrations/supabase/types";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

type Transaction = Tables<"transactions">;
type Category = Tables<"categories">;

interface ExpenseChartProps {
  transactions: Transaction[];
  categories: Category[];
  currency: string;
}

const COLORS = [
  "hsl(160, 84%, 39%)", // primary green
  "hsl(217, 91%, 60%)", // secondary blue
  "hsl(38, 92%, 50%)",  // warning orange
  "hsl(175, 80%, 45%)", // teal green
  "hsl(0, 84%, 60%)",   // red
  "hsl(145, 70%, 45%)", // lime green
  "hsl(190, 70%, 50%)", // cyan
  "hsl(45, 90%, 55%)",  // yellow
];

const ExpenseChart = ({ transactions, categories, currency }: ExpenseChartProps) => {
  const data = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0];

    const monthlyExpenses = transactions.filter(
      (t) => t.type === "expense" && t.date >= startOfMonth && t.date <= endOfMonth
    );

    const categoryTotals: Record<string, { name: string; value: number }> = {};

    monthlyExpenses.forEach((t) => {
      const category = categories.find((c) => c.id === t.category_id);
      const name = category?.name || "Sem categoria";
      
      if (!categoryTotals[name]) {
        categoryTotals[name] = { name, value: 0 };
      }
      categoryTotals[name].value += Number(t.amount);
    });

    return Object.values(categoryTotals).sort((a, b) => b.value - a.value);
  }, [transactions, categories]);

  const formatValue = (value: number) => {
    return new Intl.NumberFormat("pt-MZ", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value) + " " + currency;
  };

  if (data.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="font-semibold text-foreground mb-4">Gastos por Categoria</h3>
        <div className="h-64 flex items-center justify-center text-muted-foreground">
          Sem gastos este mês
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <h3 className="font-semibold text-foreground mb-4">Gastos por Categoria</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              labelLine={false}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => formatValue(value)}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExpenseChart;
