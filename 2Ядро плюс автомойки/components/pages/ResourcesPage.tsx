import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { Resource } from '../../types';
import { ArrowLeft, PlusCircle, Users, Box, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Skeleton } from '../ui/Skeleton';
import { cn } from '../../lib/utils';

export function ResourcesPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery<{ resources: Resource[] }>({
    queryKey: ['resources'],
    queryFn: () => api.get('/resources'),
  });

  const masters = data?.resources.filter(r => r.type === 'master');
  const boxes = data?.resources.filter(r => r.type === 'box');

  return (
    <div className="p-4 space-y-4">
      <header className="flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="p-2"><ArrowLeft /></button>
        <h1 className="text-xl font-bold">Сотрудники и Ресурсы</h1>
        <button onClick={() => navigate('/resources/new')} className="p-2">
            <PlusCircle className="w-6 h-6 text-[var(--tg-theme-link-color)]" />
        </button>
      </header>

      {isLoading ? (
        <div className="space-y-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
        </div>
      ) : (
        <>
            <ResourceList title="Мастера" icon={Users} resources={masters} navigate={navigate} />
            <ResourceList title="Боксы" icon={Box} resources={boxes} navigate={navigate} />
        </>
      )}
    </div>
  );
}

interface ResourceListProps {
    title: string;
    icon: React.ElementType;
    resources?: Resource[];
    navigate: (path: string) => void;
}

const ResourceList: React.FC<ResourceListProps> = ({ title, icon: Icon, resources, navigate }) => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
                <Icon className="w-5 h-5" />
                <span>{title}</span>
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
            {resources && resources.length > 0 ? resources.map(resource => (
                <div key={resource.id} className="flex items-center justify-between p-3 rounded-lg" style={{backgroundColor: 'var(--tg-theme-secondary-bg-color)'}}>
                    <div className="flex items-center gap-3">
                        {resource.photo && <img src={resource.photo} alt={resource.name} className="w-10 h-10 rounded-full object-cover" />}
                        <div>
                            <p className="font-semibold text-sm">{resource.name}</p>
                            <p className="text-xs" style={{color: 'var(--tg-theme-hint-color)'}}>
                                {resource.specialization.join(', ')}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                         <span className={cn("text-xs px-2 py-0.5 rounded-full", resource.status === 'active' ? 'bg-green-500/20 text-green-700' : 'bg-gray-500/20 text-gray-600')}>
                            {resource.status === 'active' ? 'Активен' : 'Неактивен'}
                        </span>
                        <button onClick={() => navigate(`/resources/${resource.id}/edit`)}><Edit className="w-4 h-4" /></button>
                    </div>
                </div>
            )) : <p className="text-sm text-center py-4" style={{color: 'var(--tg-theme-hint-color)'}}>Нет {title.toLowerCase()}.</p>}
        </CardContent>
    </Card>
)
