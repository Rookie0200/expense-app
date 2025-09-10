import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Plus, Edit, Trash2 } from "lucide-react";
import type { Budget, Transaction } from "../types/finance";
import { CATEGORIES } from "../types/finance";
import {
  getBudgetVsActual,
  formatCurrency,
  getCurrentMonth,
} from "../lib/finance-utils";
import { toast } from "../hooks/use-toast";

interface BudgetManagerProps {
  budgets: Budget[];
  transactions: Transaction[];
  onAddBudget: (budget: Omit<Budget, "id">) => void;
  onUpdateBudget: (id: string, updates: Partial<Budget>) => void;
  onDeleteBudget: (id: string) => void;
}

export const BudgetManager = ({
  budgets,
  transactions,
  onAddBudget,
  onUpdateBudget,
  onDeleteBudget,
}: BudgetManagerProps) => {
  const [open, setOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    month: getCurrentMonth(),
  });

  const currentMonth = getCurrentMonth();
  const budgetVsActual = getBudgetVsActual(transactions, budgets, currentMonth);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.category || !formData.amount) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    const budgetData = {
      category: formData.category,
      amount: Number(formData.amount),
      month: formData.month,
    };

    if (editingBudget) {
      onUpdateBudget(editingBudget.id, budgetData);
      toast({
        title: "Budget Updated",
        description: `Successfully updated budget for ${formData.category}.`,
      });
    } else {
      onAddBudget(budgetData);
      toast({
        title: "Budget Added",
        description: `Successfully added budget for ${formData.category}.`,
      });
    }

    setOpen(false);
    setEditingBudget(null);
    setFormData({ category: "", amount: "", month: getCurrentMonth() });
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setFormData({
      category: budget.category,
      amount: budget.amount.toString(),
      month: budget.month,
    });
    setOpen(true);
  };

  const handleDelete = (id: string) => {
    onDeleteBudget(id);
    toast({
      title: "Budget Deleted",
      description: "Budget has been successfully deleted.",
    });
  };

  const getStatusColor = (status: "under" | "over" | "on-track") => {
    switch (status) {
      case "over":
        return "bg-red-500";
      case "under":
        return "bg-green-500";
      default:
        return "bg-blue-500";
    }
  };

  const getStatusBadge = (
    status: "under" | "over" | "on-track",
    percentage: number
  ) => {
    const variant =
      status === "over"
        ? "destructive"
        : status === "under"
        ? "default"
        : "secondary";
    const text =
      status === "over"
        ? "Over Budget"
        : status === "under"
        ? "Under Budget"
        : "On Track";

    return (
      <Badge variant={variant} className="ml-2">
        {text} ({percentage.toFixed(0)}%)
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-0 bg-white/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
            Budget Management - {currentMonth}
          </CardTitle>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Budget
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingBudget ? "Edit Budget" : "Add New Budget"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Budget Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        amount: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="month">Month</Label>
                  <Input
                    id="month"
                    value={formData.month}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        month: e.target.value,
                      }))
                    }
                    disabled={!!editingBudget}
                  />
                </div>
                <Button type="submit" className="w-full">
                  {editingBudget ? "Update Budget" : "Add Budget"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {budgetVsActual.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">💰</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No budgets set
              </h3>
              <p className="text-gray-500">
                Start by adding your first budget above.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {budgetVsActual.map((item) => {
                const budget = budgets.find(
                  (b) =>
                    b.category === item.category && b.month === currentMonth
                );
                return (
                  <div
                    key={item.category}
                    className="p-4 bg-white/70 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <h4 className="font-semibold text-gray-900">
                          {item.category}
                        </h4>
                        {getStatusBadge(item.status, item.percentage)}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => budget && handleEdit(budget)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => budget && handleDelete(budget.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Spent: {formatCurrency(item.actual)}</span>
                        <span>Budget: {formatCurrency(item.budget)}</span>
                      </div>
                      <Progress
                        value={Math.min(item.percentage, 100)}
                        className={`h-2 ${getStatusColor(item.status)}`}
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{item.percentage.toFixed(1)}% used</span>
                        <span>
                          {formatCurrency(
                            Math.max(0, item.budget - item.actual)
                          )}{" "}
                          remaining
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
