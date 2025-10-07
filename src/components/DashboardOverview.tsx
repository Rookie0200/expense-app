import { Card, CardContent} from '@/components/ui/card';
// import type { Transaction, Budget } from '@/types/finance';
import { formatCurrency} from '@/lib/finance-utils';
import { useDashboardOverview } from '@/hooks/useDashboardOverview';



export const DashboardOverview = () => {
    const { data, isLoading, error } = useDashboardOverview(); 
    
    // Fallback for loading state
    if (isLoading) {
        return (
            <div className="p-6 text-center">
                <p>Loading dashboard overview...</p>
            </div>
        );
    }

    // Fallback for error state
    if (error) {
        return (
            <div className="p-6 text-center text-red-500">
                <p>Error loading data: {error}</p>
            </div>
        );
    }

    // Deconstruct the fetched data
    const { openingBalance, totalIncome, totalExpenses, closingBalance } = data;

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
            // Highlight expenses based on the provided image
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
        {overviewCards.map((card) => (
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
