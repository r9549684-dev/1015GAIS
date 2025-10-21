

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Client, ClientCar } from '../../types';
import { ArrowLeft, Save } from 'lucide-react';
import { Skeleton } from '../ui/Skeleton';
import WebApp from '@twa-dev/sdk';
import { ClientGarageForm } from '../clients/ClientGarageForm';

export function ClientFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isNew = !id;

  const { data: client, isLoading } = useQuery<Client, Error>({
    queryKey: ['client', id],
    queryFn: () => api.get(`/clients/${id}`),
    enabled: !isNew,
  });

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [tags, setTags] = useState('');
  const [notes, setNotes] = useState('');
  const [cars, setCars] = useState<Partial<ClientCar>[]>([]);

  useEffect(() => {
    if (client) {
      setName(client.name);
      setPhone(client.phone);
      setTags(client.tags.join(', '));
      setNotes(client.notes);
      setCars(client.cars);
    }
  }, [client]);

  const mutation = useMutation({
    mutationFn: (newClientData: Partial<Client>) => {
      return isNew ? api.post('/clients', newClientData) : api.put(`/clients/${id}`, newClientData);
    },
    onSuccess: () => {
      WebApp.HapticFeedback.notificationOccurred('success');
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['client', id] });
      navigate(isNew ? '/clients' : `/clients/${id}`);
    },
    onError: () => {
        WebApp.HapticFeedback.notificationOccurred('error');
        WebApp.showAlert('Не удалось сохранить клиента. Попробуйте снова.');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
        WebApp.showAlert('Пожалуйста, укажите имя и телефон клиента.');
        return;
    }
    const clientData = {
        name,
        phone,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        notes,
        // FIX: Cast `cars` to `ClientCar[]` to match the expected type in `Partial<Client>`.
        // The form logic ensures that each car object has an ID and all other required properties,
        // making this cast safe.
        cars: cars as ClientCar[],
    };
    mutation.mutate(clientData);
  };
  
  if (isLoading && !isNew) {
    return <div className="p-4"><Skeleton className="h-screen w-full" /></div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <header className="p-4 flex justify-between items-center">
        <button type="button" onClick={() => navigate(-1)} className="p-2"><ArrowLeft /></button>
        <h1 className="text-xl font-bold">{isNew ? 'Новый клиент' : 'Редактирование'}</h1>
        <button type="submit" disabled={mutation.isPending} className="p-2 disabled:opacity-50">
          {mutation.isPending ? <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" /> : <Save />}
        </button>
      </header>

      <div className="p-4 pt-0 space-y-4">
        <div className="space-y-3 p-4 rounded-lg" style={{backgroundColor: 'var(--tg-theme-bg-color)'}}>
           <div className="space-y-1">
                <label htmlFor="name" className="text-sm font-medium">Имя</label>
                <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Иван Петров" required className="input-style" />
           </div>
           <div className="space-y-1">
                <label htmlFor="phone" className="text-sm font-medium">Телефон</label>
                <input id="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+7 (999) 123-45-67" required className="input-style" />
           </div>
            <div className="space-y-1">
                <label htmlFor="tags" className="text-sm font-medium">Теги</label>
                <input id="tags" type="text" value={tags} onChange={e => setTags(e.target.value)} placeholder="VIP, постоянный" className="input-style" />
                <p className="text-xs" style={{color: 'var(--tg-theme-hint-color)'}}>Через запятую</p>
           </div>
           <div className="space-y-1">
                <label htmlFor="notes" className="text-sm font-medium">Заметки</label>
                <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Аллергия на ... Предпочитает ..." className="input-style" />
           </div>
        </div>

        <ClientGarageForm cars={cars} setCars={setCars} />
      </div>
      <style>{`
            .input-style {
                background-color: var(--tg-theme-secondary-bg-color);
                color: var(--tg-theme-text-color);
                width: 100%;
                padding: 10px 12px;
                border-radius: 8px;
                border: 1px solid transparent;
                font-size: 16px;
            }
            .input-style:focus {
                outline: none;
                border-color: var(--tg-theme-button-color);
            }
         `}</style>
    </form>
  );
}