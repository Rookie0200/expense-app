import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Skeleton } from "../components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import { Trash2, Edit } from "lucide-react";
import type { Transaction } from "../types/finance";
import { formatCurrency, formatDate } from "../lib/finance-utils";
import { TransactionForm } from "./TransactionForm";

interface TransactionListProps {
  transactions: Transaction[];
  loading: boolean;
  onUpdate: (id: string, updates: Partial<Transaction>) => void;
  onDelete: (id: string) => void;
}

export const TransactionList = ({
  transactions,
  loading,
  onUpdate,
  onDelete,
}: TransactionListProps) => {
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  if (loading) {
    return (
      <Card className="shadow-lg border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-colors duration-300">
        <CardHeader>
          <CardTitle className="text-xl font-semibold bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card className="shadow-lg border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-colors duration-300">
        <CardHeader>
          <CardTitle className="text-xl font-semibold bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4 animate-pulse">
              💳
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2 transition-colors duration-300">
              No transactions yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4 transition-colors duration-300">
              Start by adding your first transaction above.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleEditSubmit = (updates: Omit<Transaction, "id">) => {
    if (editingTransaction) {
      onUpdate(editingTransaction.id, updates);
      setEditingTransaction(null);
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-colors duration-300 hover:shadow-xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
          Recent Transactions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <Table>
            <TableHeader className="bg-gray-50/50 dark:bg-gray-700/50 transition-colors duration-300">
              <TableRow>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                  Date
                </TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                  Description
                </TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                  Category
                </TableHead>
                <TableHead className="font-semibold text-right text-gray-700 dark:text-gray-300">
                  Amount
                </TableHead>
                <TableHead className="font-semibold text-center text-gray-700 dark:text-gray-300">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow
                  key={transaction.id}
                  className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-all duration-200 hover:scale-[1.01] hover:shadow-sm"
                >
                  <TableCell className="font-medium text-gray-600 dark:text-gray-300 transition-colors duration-300">
                    {formatDate(transaction.date)}
                  </TableCell>
                  <TableCell className="font-medium text-gray-900 dark:text-gray-100 transition-colors duration-300">
                    {transaction.description}
                  </TableCell>
                  <TableCell>
                    {transaction.category && (
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition-all duration-200 hover:scale-105"
                      >
                        {transaction.category}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    <span
                      className={`transition-colors duration-200 ${
                        transaction.amount > 0
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {formatCurrency(transaction.amount)}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingTransaction(transaction)}
                        className="hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-200 hover:scale-105"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-700 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 hover:scale-105"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="dark:bg-gray-800 dark:border-gray-700">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="dark:text-gray-100">
                              Delete Transaction
                            </AlertDialogTitle>
                            <AlertDialogDescription className="dark:text-gray-300">
                              Are you sure you want to delete this transaction?
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDelete(transaction.id)}
                              className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 transition-colors duration-200"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {editingTransaction && (
          <div className="mt-6 animate-fade-in">
            <TransactionForm
              transaction={editingTransaction}
              mode="edit"
              onSubmit={handleEditSubmit}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
