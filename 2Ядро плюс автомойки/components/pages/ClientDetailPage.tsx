
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Client, Booking } from '../../types';
import { ArrowLeft, Edit, Phone, MessageSquare, Tag, StickyNote, AlertTriangle, Calendar, DollarSign, Clock, BarChart } from 'lucide-react';
import { Skeleton } from '../ui/Skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { ClientGarageCard, ClientGarageSkeleton } from '../clients/ClientGarageCard';
// FIX: Changed date-fns imports to use default exports from submodules to resolve module resolution issues.
import format from 'date-fns/format';
import ru from 'date-fns/locale/ru';

export function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: client, isLoading: isLoadingClient } = useQuery<Client, Error>({
    queryKey: ['client', id],
    queryFn: () => api.get(`/clients/${id}`),
    enabled: !!id,
  });

  const { data: history, isLoading: isLoadingHistory } = useQuery<{ bookings: Booking[] }, Error>({
      queryKey: ['client-history', id],
      queryFn: () => api.get(`/clients/${id}/bookings`),
      enabled: !!id,
  });
  
  const isLoading = isLoadingClient || isLoadingHistory;

  if (isLoading) {
    return <ClientDetailSkeleton />;
  }

  if (!client) {
    return <div className="p-4 text-center">Клиент не найден.</div>;
  }

  return (
    <div className="pb-4">
      <header className="p-4 flex justify-between items-center sticky top-0 z-10" style={{backgroundColor: 'var(--tg-theme-secondary-bg-color)'}}>
        <button onClick={() => navigate(-1)} className="p-2"><ArrowLeft /></button>
        <h1 className="text-xl font-bold truncate">{client.name}</h1>
        <button onClick={() => navigate(`/clients/${id}/edit`)} className="p-2">
            <Edit className="w-6 h-6" style={{ color: 'var(--tg-theme-link-color)'}} />
        </button>
      </header>

      <div className="p-4 space-y-4">
        <div className="flex flex-col items-center">
            <img src={client.photo} alt={client.name} className="w-24 h-24 rounded-full object-cover mb-2 border-4" style={{borderColor: 'var(--tg-theme-bg-color)'}}/>
            <h2 className="text-2xl font-bold">{client.name}</h2>
            <p className="font-mono" style={{color: 'var(--tg-theme-hint-color)'}}>{client.phone}</p>
            <div className="flex gap-2 mt-3">
                <a href={`tel:${client.phone}`} className="p-3 rounded-lg flex items-center justify-center gap-2" style={{backgroundColor: 'var(--tg-theme-bg-color)'}}><Phone className="w-4 h-4"/></a>
                <a href={`sms:${client.phone}`} className="p-3 rounded-lg flex items-center justify-center gap-2" style={{backgroundColor: 'var(--tg-theme-bg-color)'}}><MessageSquare className="w-4 h-4"/></a>
            </div>
        </div>

        {client.tags.length > 0 && (
            <Card>
                <CardContent className="p-3 flex items-center gap-2 flex-wrap">
                    <Tag className="w-4 h-4 mr-2" style={{color: 'var(--tg-theme-hint-color)'}}/>
                    {client.tags.map(tag => (
                        <span key={tag} className="text-xs px-2 py-0.5 rounded-full" style={{backgroundColor: 'var(--tg-theme-secondary-bg-color)'}}>{tag}</span>
                    ))}
                </CardContent>
            </Card>
        )}

        <div className="grid grid-cols-2 gap-3 text-sm">
            <StatCard icon={DollarSign} label="Выручка" value={`${client.total_revenue}₽`} />
            <StatCard icon={BarChart} label="Визиты" value={client.bookings_count} />
            <StatCard icon={Calendar} label="Первый визит" value={format(new Date(client.first_visit), 'dd MMM yyyy', {locale: ru})} />
            <StatCard icon={Clock} label="Последний визит" value={format(new Date(client.last_visit), 'dd MMM yyyy', {locale: ru})} />
        </div>
        
        {client.alerts && (
            <Card className="border-yellow-500/50 bg-yellow-500/10">
                <CardHeader className="flex-row items-center gap-2 !pb-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    <CardTitle className="text-base text-yellow-700">Особые отметки</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-yellow-800">{client.alerts}</p>
                </CardContent>
            </Card>
        )}

        {client.notes && (
             <Card>
                <CardHeader className="flex-row items-center gap-2 !pb-2">
                    <StickyNote className="w-5 h-5" style={{color: 'var(--tg-theme-hint-color)'}}/>
                    <CardTitle className="text-base">Заметки</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm whitespace-pre-wrap">{client.notes}</p>
                </CardContent>
            </Card>
        )}

        {client.cars ? <ClientGarageCard cars={client.cars} /> : <ClientGarageSkeleton />}
        
        {history ? <ClientHistoryCard history={history.bookings} /> : <ClientHistorySkeleton />}

      </div>
    </div>
  );
}

const StatCard: React.FC<{ icon: React.ElementType, label: string, value: string | number }> = ({ icon: Icon, label, value }) => (
    <div className="p-3 rounded-lg flex items-center gap-3" style={{backgroundColor: 'var(--tg-theme-bg-color)'}}>
        <Icon className="w-5 h-5" style={{color: 'var(--tg-theme-hint-color)'}} />
        <div>
            <p className="font-semibold">{value}</p>
            <p className="text-xs" style={{color: 'var(--tg-theme-hint-color)'}}>{label}</p>
        </div>
    </div>
)

const ClientHistoryCard: React.FC<{ history: Booking[] }> = ({ history }) => (
    <Card>
        <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-500" />
                <span>История визитов</span>
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
            {history.length > 0 ? history.map(booking => (
                <div key={booking.id} className="p-3 rounded-lg" style={{backgroundColor: 'var(--tg-theme-secondary-bg-color)'}}>
                    <div className="flex justify-between items-start text-sm">
                        <div>
                            <p className="font-semibold">{booking.service.name}</p>
                            <p className="text-xs" style={{color: 'var(--tg-theme-hint-color)'}}>{booking.master.name}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold">{booking.service.price}₽</p>
                            <p className="text-xs" style={{color: 'var(--tg-theme-hint-color)'}}>{format(new Date(booking.start_time), 'dd MMM yyyy', {locale: ru})}</p>
                        </div>
                    </div>
                </div>
            )) : (
                <p className="text-sm text-center py-4" style={{color: 'var(--tg-theme-hint-color)'}}>Нет истории визитов.</p>
            )}
        </CardContent>
    </Card>
)

const ClientDetailSkeleton = () => (
    <div className="p-4 space-y-4">
        <header className="flex justify-between items-center">
            <Skeleton className="w-8 h-8 rounded-lg" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="w-8 h-8 rounded-lg" />
        </header>
        <div className="flex flex-col items-center space-y-2">
            <Skeleton className="w-24 h-24 rounded-full" />
            <Skeleton className="h-7 w-3/5" />
            <Skeleton className="h-5 w-2/5" />
        </div>
        <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
        </div>
        <Skeleton className="h-24 w-full rounded-lg" />
        <ClientGarageSkeleton />
        <ClientHistorySkeleton />
    </div>
);

const ClientHistorySkeleton = () => (
    <Card>
        <CardHeader><Skeleton className="h-5 w-36" /></CardHeader>
        <CardContent className="space-y-2">
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
        </CardContent>
    </Card>
);