import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { SettingsData } from '../../types';
import { Skeleton } from '../ui/Skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Building, Clock, Phone, UserCog, ChevronRight } from 'lucide-react';
import { MapWidget } from '../settings/MapWidget';
import { IntegrationsCard } from '../settings/IntegrationsCard';
import { NicheModulesCard } from '../settings/NicheModulesCard';

export function SettingsPage() {
  const { data, isLoading } = useQuery<SettingsData>({
    queryKey: ['settings'],
    queryFn: () => api.get('/settings'),
  });
  const navigate = useNavigate();

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Настройки</h1>
      
      {isLoading || !data ? (
        <SettingsSkeleton />
      ) : (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Building className="w-5 h-5"/>{data.business.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
                <InfoRow icon={Clock} text={data.business.work_hours} />
                <InfoRow icon={Phone} text={data.business.phone} />
            </CardContent>
            <MapWidget />
          </Card>
          
          <Card className="cursor-pointer" onClick={() => navigate('/resources')}>
            <CardContent className="p-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <UserCog className="w-6 h-6" style={{color: 'var(--tg-theme-hint-color)'}}/>
                    <span className="font-medium">Сотрудники и Ресурсы</span>
                </div>
                <ChevronRight className="w-5 h-5" style={{color: 'var(--tg-theme-hint-color)'}}/>
            </CardContent>
          </Card>

          <NicheModulesCard activeModules={data.active_modules} />
          <IntegrationsCard settings={data} />
        </div>
      )}
    </div>
  );
}

const InfoRow: React.FC<{ icon: React.ElementType; text: string }> = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-3">
    <Icon className="w-4 h-4" style={{ color: 'var(--tg-theme-hint-color)' }} />
    <span>{text}</span>
  </div>
);

const SettingsSkeleton = () => (
    <div className="space-y-4">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-48 w-full" />
    </div>
)
