import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, type TooltipProps } from 'recharts';
import type { Budget, Transaction } from '../types/finance';
import { getBudgetVsActual, formatCurrency, getCurrentMonth } from '../lib/finance-utils';
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

interface BudgetChartProps {
  budgets: Budget[];
  transactions: Transaction[];
}

export const BudgetChart = ({ budgets, transactions }: BudgetChartProps) => {
  const currentMonth = getCurrentMonth();
  const budgetData = getBudgetVsActual(transactions, budgets, currentMonth);

  const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType,NameType>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry , index) => (
            <p key={index} style={{ color: entry.color }} className="font-medium">
              {entry.name}: {formatCurrency(entry.value as number)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (budgetData.length === 0) {
    return (
      <Card className="shadow-lg border-0 bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
            Budget vs Actual - {currentMonth}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📊</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No budget data</h3>
            <p className="text-gray-500">Set up some budgets to see the comparison chart.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0 bg-white/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
          Budget vs Actual - {currentMonth}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={budgetData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="category" 
                stroke="#6b7280"
                fontSize={12}
                fontWeight={500}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                fontWeight={500}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{
                  paddingTop: '20px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              />
              <Bar 
                dataKey="budget" 
                name="Budget"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="actual" 
                name="Actual"
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};