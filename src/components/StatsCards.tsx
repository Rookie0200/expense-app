import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, CircleDollarSign, TrendingUp } from "lucide-react";
import type { Transaction, Budget } from "@/types/finance";
import {
  formatCurrency,
  getCurrentMonth,
  getCategoryData,
  getBudgetVsActual,
} from "@/lib/finance-utils";

interface StatsCardsProps {
  transactions: Transaction[];
  budgets: Budget[];
}

export const StatsCards = ({ transactions, budgets }: StatsCardsProps) => {
  const currentMonth = getCurrentMonth();

  const currentMonthTransactions = transactions.filter(
    (t) =>
      new Date(t.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      }) === currentMonth
  );

  const totalIncome = currentMonthTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = Math.abs(
    currentMonthTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0)
  );

  const balance = totalIncome - totalExpenses;

  // Get top spending category
  const categoryData = getCategoryData(currentMonthTransactions);
  const topCategory = categoryData[0];

  // Get budget status
  const budgetData = getBudgetVsActual(transactions, budgets, currentMonth);
  const totalBudget = budgetData.reduce((sum, item) => sum + item.budget, 0);
  const overBudgetCount = budgetData.filter(
    (item) => item.status === "over"
  ).length;

  const stats = [
    {
      title: "Monthly Income",
      value: totalIncome,
      icon: ArrowUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      gradient: "from-green-500 to-emerald-600",
    },
    {
      title: "Monthly Expenses",
      value: totalExpenses,
      icon: ArrowDown,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      gradient: "from-red-500 to-rose-600",
    },
    {
      title: "Net Balance",
      value: balance,
      icon: CircleDollarSign,
      color: balance >= 0 ? "text-blue-600" : "text-orange-600",
      bgColor: balance >= 0 ? "bg-blue-50" : "bg-orange-50",
      borderColor: balance >= 0 ? "border-blue-200" : "border-orange-200",
      gradient:
        balance >= 0
          ? "from-blue-500 to-indigo-600"
          : "from-orange-500 to-amber-600",
    },
    {
      title: "Total Budget",
      value: totalBudget,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      gradient: "from-purple-500 to-violet-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className={`shadow-lg border-0 bg-white/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${stat.borderColor}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className={`text-2xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
                    >
                      {formatCurrency(Math.abs(stat.value))}
                    </p>
                    {stat.title === "Net Balance" && (
                      <Badge
                        variant={balance >= 0 ? "default" : "destructive"}
                        className="mt-2"
                      >
                        {balance >= 0 ? "Positive" : "Negative"}
                      </Badge>
                    )}
                    {stat.title === "Total Budget" && overBudgetCount > 0 && (
                      <Badge variant="destructive" className="mt-2">
                        {overBudgetCount} Over Budget
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Additional insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {topCategory && (
          <Card className="shadow-lg border-0 bg-white/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-700">
                Top Spending Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl font-bold text-gray-900">
                    {topCategory.category}
                  </p>
                  <p className="text-sm text-gray-500">
                    {topCategory.percentage.toFixed(1)}% of total expenses
                  </p>
                </div>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(topCategory.amount)}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="shadow-lg border-0 bg-white/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-700">
              Budget Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Budgeted:</span>
                <span className="font-semibold">
                  {formatCurrency(totalBudget)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Spent:</span>
                <span className="font-semibold">
                  {formatCurrency(totalExpenses)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Remaining:</span>
                <span
                  className={`font-semibold ${
                    totalBudget - totalExpenses >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {formatCurrency(totalBudget - totalExpenses)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
