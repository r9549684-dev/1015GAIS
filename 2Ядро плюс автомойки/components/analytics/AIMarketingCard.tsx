import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Skeleton } from '../ui/Skeleton';
import { MarketingTrigger } from '../../types';
import { Rocket, ToggleLeft, ToggleRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import WebApp from '@twa-dev/sdk';

interface AIMarketingCardProps {
  triggers: MarketingTrigger[];
}

export function AIMarketingCard({ triggers }: AIMarketingCardProps) {
  const [activeTriggers, setActiveTriggers] = React.useState(
    triggers.filter(t => t.active).map(t => t.id)
  );

  const handleToggle = (id: string) => {
    WebApp.HapticFeedback.impactOccurred('light');
    setActiveTriggers(prev => 
      prev.includes(id) ? prev.filter(tId => tId !== id) : [...prev, id]
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Rocket className="w-5 h-5 text-green-500" />
          <span>AI-Маркетолог</span>
        </CardTitle>
        <CardDescription>Автоматические сценарии для роста лояльности и возврата клиентов.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {triggers.map(trigger => {
            const isActive = activeTriggers.includes(trigger.id);
            return (
              <div key={trigger.id} className="flex items-center justify-between">
                <div className="flex-grow pr-4">
                  <p className="font-semibold text-sm">{trigger.event}</p>
                  <p className="text-xs" style={{ color: 'var(--tg-theme-hint-color)'}}>
                    {trigger.action} → {trigger.result}
                  </p>
                </div>
                <button onClick={() => handleToggle(trigger.id)} aria-label={isActive ? 'Отключить' : 'Включить'}>
                  {isActive 
                    ? <ToggleRight className="w-10 h-10 text-green-500" /> 
                    : <ToggleLeft className="w-10 h-10" style={{ color: 'var(--tg-theme-hint-color)'}} />
                  }
                </button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export function AIMarketingCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle><Skeleton className="h-6 w-48" /></CardTitle>
        <CardDescription><Skeleton className="h-4 w-full mt-2" /></CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
            <div className="w-3/4 space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-3 w-3/4" /></div>
            <Skeleton className="h-8 w-12" />
        </div>
         <div className="flex justify-between items-center">
            <div className="w-3/4 space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-3 w-3/4" /></div>
            <Skeleton className="h-8 w-12" />
        </div>
      </CardContent>
    </Card>
  );
}