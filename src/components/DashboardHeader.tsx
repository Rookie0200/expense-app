import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Bell, Download } from 'lucide-react';
import { Transaction } from '@/types/finance';
import { exportTransactionsToCSV } from '@/lib/export-utils';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  transactions: Transaction[];
}

export const DashboardHeader = ({ title, subtitle, transactions }: DashboardHeaderProps) => {
  const handleExportCSV = () => {
    exportTransactionsToCSV(transactions);
  };

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search..."
              className="pl-10 w-80 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            />
          </div>
          
          <Button
            onClick={handleExportCSV}
            variant="outline"
            size="sm"
            className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
            disabled={transactions.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          
          <Button variant="outline" size="sm" className="p-2">
            <Bell className="w-4 h-4" />
          </Button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">FM</span>
            </div>
            <div className="text-sm">
              <p className="font-medium text-gray-900 dark:text-white">Finance Manager</p>
              <p className="text-gray-500 dark:text-gray-400">User</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
