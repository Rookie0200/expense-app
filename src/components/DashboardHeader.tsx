import type { Transaction } from "../types/finance";
import { ThemeToggle } from "./Themetoggle";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  transactions: Transaction[];
}

export const DashboardHeader = ({ title, subtitle }: DashboardHeaderProps) => {
  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">US</span>
            </div>
            <div className="text-sm">
              <p className="text-gray-500 dark:text-gray-400">User</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
