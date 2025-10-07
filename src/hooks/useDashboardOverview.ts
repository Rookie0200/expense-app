import { useState, useEffect } from 'react';
import { transactionsApi, handleApiError } from '@/services/api'; // Adjust the import path
import { getCurrentMonth } from '@/lib/finance-utils'; // Assuming this utility exists

export interface DashboardOverviewData {
    openingBalance: number;
    totalIncome: number;
    totalExpenses: number;
    closingBalance: number;
}

const initialData: DashboardOverviewData = {
    openingBalance: 0,
    totalIncome: 0,
    totalExpenses: 0,
    closingBalance: 0,
};

export const useDashboardOverview = (date?: string) => {
    const [data, setData] = useState<DashboardOverviewData>(initialData);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Default to the current month in 'YYYY-MM' format
    const monthYear = date || getCurrentMonth(); 

    useEffect(() => {
        const fetchOverview = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const overviewData = await transactionsApi.getDashboardOverview(monthYear);
                setData(overviewData);
            } catch (err) {
                setError(handleApiError(err));
                setData(initialData); // Reset on error
            } finally {
                setIsLoading(false);
            }
        };

        fetchOverview();
    }, [monthYear]);

    return { data, isLoading, error };
};