
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNewBookingModalStore } from '../../stores/useNewBookingModalStore';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/Card';
import { X, AlertTriangle } from 'lucide-react';
import { api } from '../../lib/api';
import { Client, Service, Resource, Booking } from '../../types';
import WebApp from '@twa-dev/sdk';
// FIX: Changed date-fns imports to use default exports from submodules to resolve module resolution issues.
import format from 'date-fns/format';
import addMinutes from 'date-fns/addMinutes';
import parseISO from 'date-fns/parseISO';
import { Skeleton } from '../ui/Skeleton';

export function NewBookingModal() {
  const { closeModal, initialDate } = useNewBookingModalStore();
  const queryClient = useQueryClient();

  const [clientId, setClientId] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [masterId, setMasterId] = useState('');
  const [date, setDate] = useState(initialDate ? format(initialDate, 'yyyy-MM-dd') : '');
  const [time, setTime] = useState('10:00');
  const [duration, setDuration] = useState(60);
  const [alert, setAlert] = useState<string | null>(null);

  const { data: clientsData, isLoading: isLoadingClients } = useQuery<{ clients: Client[] }>({ queryKey: ['clients'], queryFn: () => api.get('/clients') });
  const { data: servicesData, isLoading: isLoadingServices } = useQuery<{ services: Service[] }>({ queryKey: ['services'], queryFn: () => api.get('/services') });
  const { data: resourcesData, isLoading: isLoadingResources } = useQuery<{ resources: Resource[] }>({ queryKey: ['resources'], queryFn: () => api.get('/resources') });

  useEffect(() => {
    const selectedClient = clientsData?.clients.find(c => c.id === clientId);
    const selectedService = servicesData?.services.find(s => s.id === serviceId);

    if (selectedClient?.preferred_master_id && resourcesData?.resources.some(r => r.id === selectedClient.preferred_master_id)) {
        setMasterId(selectedClient.preferred_master_id);
    }
    
    if (selectedService?.duration) {
        setDuration(selectedService.duration);
    }

    if (selectedClient?.alerts && selectedService?.related_alerts?.some(sa => selectedClient.alerts?.toLowerCase().includes(sa))) {
        setAlert(`Внимание: у клиента "${selectedClient.name}" возможно ${selectedClient.alerts.toLowerCase()}.`);
    } else {
        setAlert(null);
    }
  }, [clientId, serviceId, clientsData, servicesData, resourcesData]);

  const mutation = useMutation({
    mutationFn: (newBooking: Partial<Booking>) => api.post('/bookings', newBooking),
    onSuccess: () => {
        WebApp.HapticFeedback.notificationOccurred('success');
        queryClient.invalidateQueries({ queryKey: ['bookings', date] });
        queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        closeModal();
    },
    onError: () => {
        WebApp.HapticFeedback.notificationOccurred('error');
        WebApp.showAlert('Не удалось создать запись. Попробуйте снова.');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const startDateTime = parseISO(`${date}T${time}:00`);
    const endDateTime = addMinutes(startDateTime, duration);

    const client = clientsData?.clients.find(c => c.id.toString() === clientId);
    const service = servicesData?.services.find(s => s.id === serviceId);
    const master = resourcesData?.resources.find(r => r.id === masterId);

    if (!client || !service || !master) {
        WebApp.showAlert('Пожалуйста, заполните все поля.');
        return;
    }
    
    mutation.mutate({
        client: { id: client.id, name: client.name, photo: client.photo },
        service: { id: service.id, name: service.name, price: service.price },
        master: { id: master.id, name: master.name },
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        duration,
    });
  }

  const isLoading = isLoadingClients || isLoadingServices || isLoadingResources;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeModal}>
      <Card className="w-full max-w-md relative" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
            <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Новая запись</CardTitle>
            <button type="button" onClick={closeModal} className="p-1 rounded-full hover:bg-[var(--tg-theme-secondary-bg-color)]">
                <X className="w-5 h-5" />
            </button>
            </CardHeader>
            <CardContent className="space-y-3">
            {isLoading ? <Skeleton className="h-48 w-full" /> : (
                <>
                <SelectField label="Клиент" value={clientId} onChange={setClientId} options={clientsData?.clients.map(c => ({ value: c.id, label: c.name })) || []} />
                <SelectField label="Услуга" value={serviceId} onChange={setServiceId} options={servicesData?.services.map(s => ({ value: s.id, label: s.name })) || []} />
                <SelectField label="Мастер/Ресурс" value={masterId} onChange={setMasterId} options={resourcesData?.resources.map(r => ({ value: r.id, label: r.name })) || []} />
                
                <div className="grid grid-cols-2 gap-2">
                    <InputField label="Дата" type="date" value={date} onChange={setDate} />
                    <InputField label="Время" type="time" value={time} onChange={setTime} />
                </div>
                
                <SelectField label="Длительность (мин)" value={duration} onChange={(val) => setDuration(parseInt(val))} options={[
                    { value: 30, label: '30 минут' },
                    { value: 60, label: '60 минут' },
                    { value: 90, label: '90 минут' },
                    { value: 120, label: '120 минут' },
                    { value: 180, label: '3 часа' },
                ]} />
                
                {alert && (
                    <div className="p-3 text-xs rounded-lg flex items-start gap-2 border border-yellow-500/50 bg-yellow-500/10 text-yellow-700">
                        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                        <span>{alert}</span>
                    </div>
                )}
                </>
            )}
            </CardContent>
            <CardFooter>
                <button
                    type="submit"
                    disabled={mutation.isPending || isLoading}
                    className="w-full px-4 py-2.5 rounded-lg font-semibold disabled:opacity-50"
                    style={{ backgroundColor: 'var(--tg-theme-button-color)', color: 'var(--tg-theme-button-text-color)' }}
                >
                    {mutation.isPending ? 'Сохранение...' : 'Сохранить запись'}
                </button>
            </CardFooter>
        </form>
         <style>{`
            .select-style, .input-style {
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
            .select-style:focus, .input-style:focus {
                outline: none;
                border-color: var(--tg-theme-button-color);
            }
         `}</style>
      </Card>
    </div>
  );
}

const InputField = ({ label, type, value, onChange }: { label: string, type: string, value: string | number, onChange: (val: string) => void }) => (
    <div className="space-y-1">
        <label className="text-sm font-medium">{label}</label>
        <input type={type} value={value} onChange={e => onChange(e.target.value)} className="input-style"/>
    </div>
)

const SelectField = ({ label, value, onChange, options }: { label: string, value: string | number, onChange: (val: string) => void, options: {value: any, label: string}[] }) => (
    <div className="space-y-1">
        <label className="text-sm font-medium">{label}</label>
        <select value={value} onChange={e => onChange(e.target.value)} className="select-style">
            <option value="" disabled>Выберите...</option>
            {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
    </div>
)
