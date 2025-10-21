import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Skeleton } from '../ui/Skeleton';
import { ClientCar } from '../../types';
import { Car, PlusCircle } from 'lucide-react';
import WebApp from '@twa-dev/sdk';

interface ClientGarageCardProps {
  cars: ClientCar[];
}

export function ClientGarageCard({ cars }: ClientGarageCardProps) {
    const handleAddCar = () => {
        WebApp.showAlert('Функция добавления автомобиля в разработке.');
    };

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-base flex items-center gap-2">
            <Car className="w-5 h-5 text-blue-500" />
            <span>Гараж клиента</span>
        </CardTitle>
        <button onClick={handleAddCar}>
            <PlusCircle className="w-5 h-5 text-[var(--tg-theme-hint-color)]" />
        </button>
      </CardHeader>
      <CardContent className="space-y-3">
        {cars.map(car => (
          <div key={car.id} className="p-3 rounded-lg flex justify-between items-center" style={{backgroundColor: 'var(--tg-theme-secondary-bg-color)'}}>
            <div>
              <p className="font-semibold text-sm">{car.brand} {car.model} <span className="font-normal text-xs" style={{color: 'var(--tg-theme-hint-color)'}}>{car.year}</span></p>
              <p className="text-xs font-mono px-1.5 py-0.5 mt-1 inline-block border rounded" style={{borderColor: 'var(--tg-theme-hint-color)'}}>{car.plate_number}</p>
            </div>
            <div className="text-xs text-right capitalize" style={{color: 'var(--tg-theme-hint-color)'}}>
                <p>{car.body_type}</p>
                <p>{car.color}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function ClientGarageSkeleton() {
    return (
        <Card>
            <CardHeader><Skeleton className="h-5 w-32" /></CardHeader>
            <CardContent className="space-y-2">
                <Skeleton className="h-14 w-full" />
            </CardContent>
        </Card>
    );
}
