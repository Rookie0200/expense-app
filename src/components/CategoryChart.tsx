
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Transaction } from '@/types/finance';
import { getCategoryData, formatCurrency } from '@/lib/finance-utils';

interface CategoryChartProps {
  transactions: Transaction[];
}

export const CategoryChart = ({ transactions }: CategoryChartProps) => {
  const categoryData = getCategoryData(transactions);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg transition-colors duration-300">
          <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{data.category}</p>
          <p className="text-blue-600 dark:text-blue-400 font-medium">
            {formatCurrency(data.amount)} ({data.percentage.toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  if (categoryData.length === 0) {
    return (
      <Card className="shadow-lg border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-colors duration-300 hover:shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
            Spending by Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4 animate-pulse">🥧</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2 transition-colors duration-300">No category data</h3>
            <p className="text-gray-500 dark:text-gray-400 transition-colors duration-300">Add some categorized expenses to see your spending breakdown.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-colors duration-300 hover:shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl font-semibold bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
          Spending by Category
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="amount"
                label={({ category, percentage }) => `${category} ${percentage.toFixed(1)}%`}
                className="hover:opacity-80 transition-opacity duration-200"
              >
                {categoryData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    className="hover:opacity-80 transition-opacity duration-200 cursor-pointer"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {categoryData.map((item) => (
            <div key={item.category} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 hover:scale-105">
              <div 
                className="w-3 h-3 rounded-full transition-transform duration-200 hover:scale-125" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">{item.category}</span>
              <span className="text-sm font-medium ml-auto text-gray-900 dark:text-gray-100 transition-colors duration-300">
                {formatCurrency(item.amount)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};