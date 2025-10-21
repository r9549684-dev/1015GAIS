import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Niche } from '../../types';
import { Car, CheckCircle2, Puzzle } from 'lucide-react';

interface NicheModulesCardProps {
  activeModules: Niche[];
}

const moduleMeta: { [key in Niche]: { icon: React.ElementType, name: string } } = {
    'carwash': { icon: Car, name: 'Автомойки / Детейлинг' },
    'salon': { icon: Car, name: 'Салоны красоты' }, // Placeholder icon
    'autoservice': { icon: Car, name: 'Автосервисы' }, // Placeholder icon
}

export function NicheModulesCard({ activeModules }: NicheModulesCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Puzzle className="w-5 h-5" style={{color: 'var(--tg-theme-hint-color)'}}/>
          <span>Активные модули</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {activeModules.map(moduleKey => {
            const meta = moduleMeta[moduleKey];
            const Icon = meta.icon;
            return (
                <div key={moduleKey} className="flex justify-between items-center p-3 rounded-lg" style={{backgroundColor: 'var(--tg-theme-secondary-bg-color)'}}>
                    <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <span className="font-semibold text-sm">{meta.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-green-500">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Активен</span>
                    </div>
                </div>
            )
        })}
      </CardContent>
    </Card>
  );
}
