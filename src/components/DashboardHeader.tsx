// import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import { Download, User, LogOut } from "lucide-react";
import type { Transaction } from "@/types/finance";
import { exportTransactionsToCSV } from "@/lib/export-utils";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/Themetoggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  transactions: Transaction[];
}

export const DashboardHeader = ({
  title,
  subtitle,
  transactions,
}: DashboardHeaderProps) => {
  const { user, logout } = useAuth();

  const handleExportCSV = () => {
    exportTransactionsToCSV(transactions);
  };

  // console.log("User in DashboardHeader:", user);
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
          <Button
            onClick={handleExportCSV}
            variant="outline"
            size="sm"
            className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
            disabled={!transactions || transactions.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>

          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center space-x-2 hover:scale-105 transition-transform cursor-pointer"
              >
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <User className="w-3 h-3 text-primary-foreground" />
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-xs font-medium">{user?.firstName}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{`${user?.firstName} ${user?.lastName}`}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={logout}
                className="text-red-600 hover:text-red-700 cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
