import type { Transaction } from "@/types/finance";
import { formatDate } from "./finance-utils";

export const exportTransactionsToCSV = (transactions: Transaction[]) => {
  const headers = ["Date", "Description", "Category", "Type", "Amount"];

  const csvContent = [
    headers.join(","),
    ...transactions.map((transaction) =>
      [
        formatDate(transaction.date),
        `"${transaction.description}"`,
        transaction.category || "N/A",
        transaction.type,
        transaction.amount.toString(),
      ].join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `transactions-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
