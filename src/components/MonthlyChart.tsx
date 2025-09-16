import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Transaction } from '@/types/finance';
import { getMonthlyData, formatCurrency } from '@/lib/finance-utils';

interface MonthlyChartProps {
  transactions: Transaction[];
}

export const MonthlyChart = ({ transactions }: MonthlyChartProps) => {
  const monthlyData = getMonthlyData(transactions);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="font-medium">
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (monthlyData.length === 0) {
    return (
      <Card className="shadow-lg border-0 bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
            Monthly Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📊</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No data to display</h3>
            <p className="text-gray-500">Add some transactions to see your monthly overview.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0 bg-white/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
          Monthly Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="month" 
                stroke="#6b7280"
                fontSize={12}
                fontWeight={500}
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
                dataKey="income" 
                name="Income"
                fill="url(#incomeGradient)"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="expenses" 
                name="Expenses"
                fill="url(#expenseGradient)"
                radius={[4, 4, 0, 0]}
              />
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="100%" stopColor="#059669" stopOpacity={0.8}/>
                </linearGradient>
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8}/>
                  <stop offset="100%" stopColor="#dc2626" stopOpacity={0.8}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};