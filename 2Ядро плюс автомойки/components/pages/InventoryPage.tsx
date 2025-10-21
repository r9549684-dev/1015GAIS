import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { InventoryItem } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Skeleton } from '../ui/Skeleton';
import { PlusCircle, Package, ShoppingCart, AlertTriangle } from 'lucide-react';

export function InventoryPage() {
  const { data, isLoading } = useQuery<{ items: InventoryItem[] }>({
    queryKey: ['inventory'],
    queryFn: () => api.get('/inventory')
  });

  const consumables = data?.items.filter(i => i.type === 'consumable');
  const products = data?.items.filter(i => i.type === 'product');

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Склад</h1>
        <button className="p-2 rounded-lg" style={{backgroundColor: 'var(--tg-theme-button-color)', color: 'var(--tg-theme-button-text-color)'}}>
          <PlusCircle className="w-5 h-5" />
        </button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ShoppingCart className="w-5 h-5"/> Товары на продажу</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? <Skeleton className="h-20 w-full" /> : 
            <div className="space-y-2">
              {products?.map(item => <InventoryItemRow key={item.id} item={item} />)}
            </div>
          }
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Package className="w-5 h-5"/> Расходники для услуг</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? <Skeleton className="h-20 w-full" /> : 
            <div className="space-y-2">
              {consumables?.map(item => <InventoryItemRow key={item.id} item={item} />)}
            </div>
          }
        </CardContent>
      </Card>
    </div>
  );
}

// FIX: Changed to React.FC to correctly type the component and handle React's special `key` prop.
const InventoryItemRow: React.FC<{ item: InventoryItem }> = ({ item }) => {
    const isLowStock = item.stock < item.low_stock_threshold;
    return (
        <div className="flex justify-between items-center text-sm p-2 rounded-md" style={{backgroundColor: 'var(--tg-theme-secondary-bg-color)'}}>
            <span>{item.name}</span>
            <div className={`flex items-center gap-2 font-semibold ${isLowStock ? 'text-red-500' : ''}`}>
                {isLowStock && <AlertTriangle className="w-4 h-4" />}
                <span>{item.stock} {item.unit}</span>
            </div>
        </div>
    )
}
