import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Transaction } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Skeleton } from '../ui/Skeleton';
import { ArrowDownLeft, ArrowUpRight, PlusCircle } from 'lucide-react';
import { format } from 'date-fns';

export function FinancePage() {
  const { data, isLoading } = useQuery<{ transactions: Transaction[] }>({
    queryKey: ['finance'],
    queryFn: () => api.get('/finance')
  });

  return (
    <div className="p-4 space-y-4">
       <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Финансы</h1>
        <button className="p-2 rounded-lg" style={{backgroundColor: 'var(--tg-theme-button-color)', color: 'var(--tg-theme-button-text-color)'}}>
            <PlusCircle className="w-5 h-5" />
        </button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Касса</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {isLoading ? (
              <>
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </>
            ) : data?.transactions.map(tx => (
              <div key={tx.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${tx.type === 'income' ? 'bg-green-500/20 text-green-600' : 'bg-red-500/20 text-red-600'}`}>
                    {tx.type === 'income' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-semibold">{tx.description}</p>
                    <p className="text-xs" style={{color: 'var(--tg-theme-hint-color)'}}>{format(new Date(tx.date), 'dd MMM, HH:mm')}</p>
                  </div>
                </div>
                <div className={`font-bold ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {tx.type === 'income' ? '+' : '-'}{tx.amount}₽
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
       <p className="text-center text-sm" style={{color: 'var(--tg-theme-hint-color)'}}>Более детальная аналитика в разработке.</p>
    </div>
  );
}