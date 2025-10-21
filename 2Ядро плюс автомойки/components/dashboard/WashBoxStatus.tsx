import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { WashBox } from '../../types';
import { Skeleton } from '../ui/Skeleton';
import { Car, Bot, Users, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useWashBoxDetailModalStore } from '../../stores/useWashBoxDetailModalStore';

interface WashBoxStatusProps {
  boxes: WashBox[];
}

export function WashBoxStatus({ boxes }: WashBoxStatusProps) {
    const openModal = useWashBoxDetailModalStore(state => state.openModal);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Карта боксов</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {boxes.map((box) => {
          const statusMeta = {
            free: { label: 'Свободен', color: 'bg-green-500', text: 'text-green-700', bg: 'bg-green-500/10' },
            busy: { label: 'Занят', color: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-500/10' },
            unavailable: { label: 'Недоступен', color: 'bg-gray-500', text: 'text-gray-600', bg: 'bg-gray-500/10' },
          };
          const meta = statusMeta[box.status];

          return (
            <div key={box.id} onClick={() => openModal(box)} className={cn("p-3 rounded-lg border", meta.bg)} style={{borderColor: meta.color}}>
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-bold">{box.name}</h3>
                {box.type === 'automatic' 
                    ? <Bot className="w-4 h-4 text-[var(--tg-theme-hint-color)]" />
                    : <Users className="w-4 h-4 text-[var(--tg-theme-hint-color)]" />
                }
              </div>
              <div className={`text-xs font-semibold px-2 py-0.5 inline-block rounded-full ${meta.text} ${meta.bg}`}>{meta.label}</div>
              {box.status === 'busy' && box.current_booking && (
                <div className="text-xs mt-2 flex items-center gap-1" style={{color: 'var(--tg-theme-hint-color)'}}>
                  <Clock className="w-3 h-3" />
                  <span>до {new Date(box.current_booking.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

export function WashBoxStatusSkeleton() {
    return (
        <Card>
            <CardHeader><CardTitle><Skeleton className="h-6 w-32" /></CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <Skeleton className="h-20 w-full rounded-lg" />
                <Skeleton className="h-20 w-full rounded-lg" />
                <Skeleton className="h-20 w-full rounded-lg" />
            </CardContent>
        </Card>
    );
}
