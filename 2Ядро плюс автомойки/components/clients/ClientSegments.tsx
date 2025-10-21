import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { ClientLoyaltyStatus, ClientSegment } from '../../types';
import { Award, Heart, Sparkles, Bed } from 'lucide-react';
import { Skeleton } from '../ui/Skeleton';

const segmentMeta: { [key in ClientLoyaltyStatus]: { icon: React.ElementType, label: string } } = {
    'new': { icon: Sparkles, label: 'Новые' },
    'regular': { icon: Heart, label: 'Постоянные' },
    'vip': { icon: Award, label: 'VIP' },
    'sleeping': { icon: Bed, label: 'Спящие' },
    'lost': { icon: Bed, label: 'Потерянные' },
}

export function ClientSegments() {
    const { data, isLoading } = useQuery<{ segments: ClientSegment[] }>({
        queryKey: ['client-segments'],
        queryFn: () => api.get('/clients/segments'),
    });

    if (isLoading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
            </div>
        );
    }
    
    if (!data) return null;

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            {data.segments.map(segment => {
                const MetaIcon = segmentMeta[segment.status].icon;
                return (
                    <div key={segment.status} className="p-2 rounded-lg flex items-center gap-2" style={{backgroundColor: 'var(--tg-theme-bg-color)'}}>
                        <MetaIcon className="w-5 h-5 flex-shrink-0" style={{color: 'var(--tg-theme-hint-color)'}}/>
                        <div>
                            <div className="font-bold text-base">{segment.count}</div>
                            <div style={{color: 'var(--tg-theme-hint-color)'}}>{segmentMeta[segment.status].label}</div>
                        </div>
                    </div>
                )
            })}
        </div>
    );
}