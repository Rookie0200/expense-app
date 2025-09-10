import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Transaction, Budget } from '@/types/finance';
import { formatCurrency, getCurrentMonth } from '@/lib/finance-utils';

interface DashboardOverviewProps {
  transactions: Transaction[];
  budgets: Budget[];
}

export const DashboardOverview = ({ transactions, budgets }: DashboardOverviewProps) => {
  const currentMonth = getCurrentMonth();
  
  const currentMonthTransactions = transactions.filter(t => 
    new Date(t.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) === currentMonth
  );

  const totalIncome = currentMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = Math.abs(currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0));

  const openingBalance = 5000; // Mock data similar to reference
  const closingBalance = openingBalance + totalIncome - totalExpenses;

  const overviewCards = [
    {
      title: 'Opening Balance',
      value: openingBalance,
      subtitle: 'Balance at the beginning of the month',
      bgColor: 'bg-gray-50 dark:bg-gray-800',
      textColor: 'text-gray-900 dark:text-white'
    },
    {
      title: 'Total Income',
      value: totalIncome,
      subtitle: 'Sum of all incoming funds',
      bgColor: 'bg-gray-50 dark:bg-gray-800',
      textColor: 'text-gray-900 dark:text-white'
    },
    {
      title: 'Total Expenses',
      value: totalExpenses,
      subtitle: 'Sum of all outgoing funds',
      bgColor: 'bg-blue-500 dark:bg-blue-600',
      textColor: 'text-white'
    },
    {
      title: 'Closing Balance',
      value: closingBalance,
      subtitle: 'Balance on the last day',
      bgColor: 'bg-gray-50 dark:bg-gray-800',
      textColor: 'text-gray-900 dark:text-white'
    }
  ];

  return (
    <div className="p-6">
      {/* Header Section */}
      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white mb-6">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-2">Change in balance</h2>
          <p className="text-blue-100">Track every change in your balance.</p>
        </CardContent>
      </Card>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {overviewCards.map((card, index) => (
          <Card key={card.title} className={`${card.bgColor} border-0 shadow-sm hover:shadow-md transition-shadow duration-200`}>
            <CardContent className="p-6">
              <h3 className={`text-sm font-medium ${card.textColor} opacity-80 mb-2`}>
                {card.title}
              </h3>
              <p className={`text-3xl font-bold ${card.textColor} mb-2`}>
                {formatCurrency(card.value)}
              </p>
              <p className={`text-sm ${card.textColor} opacity-70`}>
                {card.subtitle}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};