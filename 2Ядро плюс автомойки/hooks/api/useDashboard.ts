
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { DashboardData } from '../../types';

export function useDashboard() {
  return useQuery<DashboardData, Error>({
    queryKey: ['dashboard'],
    queryFn: () => api.get('/dashboard'),
    refetchInterval: 60000, // Refetch every minute
    staleTime: 30000, // Consider data stale after 30s
  });
}
