import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { BillingData } from '../../types';

export function useBilling() {
  return useQuery<BillingData, Error>({
    queryKey: ['billing'],
    queryFn: () => api.get('/billing'),
  });
}
