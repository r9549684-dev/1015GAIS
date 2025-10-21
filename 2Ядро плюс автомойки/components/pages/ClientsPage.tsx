
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Client } from '../../types';
import { Card, CardContent } from '../ui/Card';
import { Skeleton } from '../ui/Skeleton';
import { Search, UserPlus } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ClientSegments } from '../clients/ClientSegments';

export function ClientsPage() {
  const { data, isLoading } = useQuery<{ clients: Client[] }>({
    queryKey: ['clients'],
    queryFn: () => api.get('/clients'),
  });
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filteredClients = data?.clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Клиенты</h1>
        <button 
          onClick={() => navigate('/clients/new')}
          className="p-2 rounded-lg" 
          style={{backgroundColor: 'var(--tg-theme-button-color)', color: 'var(--tg-theme-button-text-color)'}}
          aria-label="Добавить нового клиента"
        >
            <UserPlus className="w-5 h-5" />
        </button>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{color: 'var(--tg-theme-hint-color)'}} />
        <input 
            type="text"
            placeholder="Поиск по имени или телефону..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border-none"
            style={{backgroundColor: 'var(--tg-theme-secondary-bg-color)', color: 'var(--tg-theme-text-color)'}}
        />
      </div>

      <ClientSegments />

      <div className="space-y-3">
        {isLoading ? (
          <>
            <ClientCardSkeleton />
            <ClientCardSkeleton />
            <ClientCardSkeleton />
          </>
        ) : filteredClients?.length ? (
          filteredClients.map(client => <ClientCard key={client.id} client={client} />)
        ) : (
           <p className="text-center py-8" style={{color: 'var(--tg-theme-hint-color)'}}>Клиенты не найдены.</p>
        )}
      </div>
    </div>
  );
}

const ClientCard: React.FC<{ client: Client }> = ({ client }) => {
    return (
        <NavLink to={`/clients/${client.id}`}>
            <Card>
                <CardContent className="p-3 flex items-center gap-4">
                    <img src={client.photo} alt={client.name} className="w-14 h-14 rounded-full object-cover" />
                    <div className="flex-grow">
                        <p className="font-semibold">{client.name}</p>
                        <p className="text-sm" style={{color: 'var(--tg-theme-hint-color)'}}>{client.phone}</p>
                        <div className="flex gap-1 mt-1">
                            {client.tags.map(tag => (
                                <span key={tag} className="text-xs px-2 py-0.5 rounded-full" style={{backgroundColor: 'var(--tg-theme-secondary-bg-color)'}}>{tag}</span>
                            ))}
                        </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                        <p className="font-bold text-base">{client.total_revenue}₽</p>
                        <p className="text-xs" style={{color: 'var(--tg-theme-hint-color)'}}>{client.bookings_count} визитов</p>
                    </div>
                </CardContent>
            </Card>
        </NavLink>
    )
}

function ClientCardSkeleton() {
    return (
        <div className="p-3 flex items-center gap-4 rounded-lg" style={{backgroundColor: 'var(--tg-theme-bg-color)'}}>
            <Skeleton className="w-14 h-14 rounded-full" />
            <div className="flex-grow space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="flex-shrink-0 space-y-2">
                <Skeleton className="h-5 w-16" />
                 <Skeleton className="h-4 w-20" />
            </div>
        </div>
    )
}
