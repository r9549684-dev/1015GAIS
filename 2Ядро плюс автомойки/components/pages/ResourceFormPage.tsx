import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Resource } from '../../types';
import { ArrowLeft, Save, User, Box } from 'lucide-react';
import { Skeleton } from '../ui/Skeleton';
import WebApp from '@twa-dev/sdk';

export function ResourceFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isNew = !id;

  const [type, setType] = useState<'master' | 'box'>('master');
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [commission, setCommission] = useState(0);
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  const { data: resource, isLoading } = useQuery<Resource, Error>({
    queryKey: ['resource', id],
    queryFn: () => api.get(`/resources/${id}`),
    enabled: !isNew,
  });

  useEffect(() => {
    if (resource) {
      setType(resource.type as 'master' | 'box');
      setName(resource.name);
      setPhoto(resource.photo);
      setSpecialization(resource.specialization.join(', '));
      setCommission(resource.commission_percent || 0);
      setStatus(resource.status);
    }
  }, [resource]);
  
  const mutation = useMutation({
    mutationFn: (resourceData: Partial<Resource>) => {
      return isNew ? api.post('/resources', resourceData) : api.put(`/resources/${id}`, resourceData);
    },
    onSuccess: () => {
      WebApp.HapticFeedback.notificationOccurred('success');
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      navigate('/resources');
    },
    onError: () => {
        WebApp.HapticFeedback.notificationOccurred('error');
        WebApp.showAlert('Не удалось сохранить ресурс. Попробуйте снова.');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
        WebApp.showAlert('Пожалуйста, укажите название ресурса.');
        return;
    }
    const resourceData: Partial<Resource> = {
        name,
        type,
        photo,
        status,
        specialization: specialization.split(',').map(s => s.trim()).filter(Boolean),
        commission_percent: type === 'master' ? commission : undefined,
    };
    mutation.mutate(resourceData);
  };

  if (isLoading && !isNew) {
    return <div className="p-4"><Skeleton className="h-screen w-full" /></div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <header className="p-4 flex justify-between items-center">
        <button type="button" onClick={() => navigate(-1)} className="p-2"><ArrowLeft /></button>
        <h1 className="text-xl font-bold">{isNew ? 'Новый ресурс' : 'Редактирование'}</h1>
        <button type="submit" disabled={mutation.isPending} className="p-2 disabled:opacity-50">
          {mutation.isPending ? <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" /> : <Save />}
        </button>
      </header>

      <div className="p-4 pt-0 space-y-4">
        <div className="space-y-3 p-4 rounded-lg" style={{backgroundColor: 'var(--tg-theme-bg-color)'}}>
           {isNew && (
             <div className="space-y-1">
                <label className="text-sm font-medium">Тип ресурса</label>
                <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => setType('master')} className={`p-3 flex items-center justify-center gap-2 rounded-lg ${type === 'master' ? 'bg-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-text-color)]' : 'bg-[var(--tg-theme-secondary-bg-color)]'}`}><User /> Мастер</button>
                    <button type="button" onClick={() => setType('box')} className={`p-3 flex items-center justify-center gap-2 rounded-lg ${type === 'box' ? 'bg-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-text-color)]' : 'bg-[var(--tg-theme-secondary-bg-color)]'}`}><Box /> Бокс</button>
                </div>
            </div>
           )}
           <InputField label="Имя / Название" value={name} onChange={setName} placeholder={type === 'master' ? 'Анна Смирнова' : 'Бокс №1'} required />
           
           {type === 'master' && (
            <>
                <InputField label="URL Фото" value={photo} onChange={setPhoto} placeholder="https://..." />
                <InputField label="Специализация (через запятую)" value={specialization} onChange={setSpecialization} placeholder="Стрижки, окрашивание" />
                <InputField label="Комиссия, %" value={commission} onChange={(v) => setCommission(Number(v))} type="number" />
            </>
           )}
            
            <div className="space-y-1">
                <label htmlFor="status" className="text-sm font-medium">Статус</label>
                <select id="status" value={status} onChange={e => setStatus(e.target.value as 'active' | 'inactive')} className="input-style">
                    <option value="active">Активен</option>
                    <option value="inactive">Неактивен</option>
                </select>
            </div>
        </div>
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
                -webkit-appearance: none;
                -moz-appearance: none;
                appearance: none;
            }
            .input-style:focus {
                outline: none;
                border-color: var(--tg-theme-button-color);
            }
         `}</style>
    </form>
  );
}

const InputField = ({ label, value, onChange, ...props }: { label: string, value: string | number, onChange: (val: string) => void, [key: string]: any }) => (
    <div className="space-y-1">
        <label className="text-sm font-medium">{label}</label>
        <input value={value} onChange={e => onChange(e.target.value)} className="input-style" {...props} />
    </div>
);