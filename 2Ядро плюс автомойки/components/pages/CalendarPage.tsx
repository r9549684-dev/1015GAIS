
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Booking } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Skeleton } from '../ui/Skeleton';
import { ChevronLeft, ChevronRight, PlusCircle, Calendar as CalendarIcon, Clock, User, Tag, Edit2 } from 'lucide-react';
// FIX: Changed date-fns imports to use default exports from submodules to resolve module resolution issues.
import format from 'date-fns/format';
import addDays from 'date-fns/addDays';
import subDays from 'date-fns/subDays';
import startOfDay from 'date-fns/startOfDay';
import ru from 'date-fns/locale/ru';
import { cn } from '../../lib/utils';
import { useNewBookingModalStore } from '../../stores/useNewBookingModalStore';

export function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(startOfDay(new Date()));
  const openModal = useNewBookingModalStore(state => state.openModal);

  const { data, isLoading, isError } = useQuery<{ bookings: Booking[] }>({
    queryKey: ['bookings', format(currentDate, 'yyyy-MM-dd')],
    queryFn: async () => {
        const params = new URLSearchParams({ date: format(currentDate, 'yyyy-MM-dd') });
        return api.get('/bookings', params);
    }
  });

  const handleDateChange = (date: Date) => {
    setCurrentDate(startOfDay(date));
  };
  
  const handleOpenModal = () => {
    openModal(currentDate);
  }

  return (
    <div className="p-4 space-y-4">
       <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Календарь</h1>
        <button onClick={handleOpenModal} className="p-2 rounded-lg" style={{backgroundColor: 'var(--tg-theme-button-color)', color: 'var(--tg-theme-button-text-color)'}}>
            <PlusCircle className="w-5 h-5" />
        </button>
      </div>

      <Card>
        <CardHeader>
            <DatePicker currentDate={currentDate} onDateChange={handleDateChange} />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {isLoading ? (
              <>
                <BookingCardSkeleton />
                <BookingCardSkeleton />
                <BookingCardSkeleton />
              </>
            ) : isError ? (
                <p className="text-center py-8 text-red-500">Не удалось загрузить записи.</p>
            ) : data?.bookings.length ? (
              data.bookings.map(booking => <BookingCard key={booking.id} booking={booking} />)
            ) : (
               <p className="text-center py-8" style={{color: 'var(--tg-theme-hint-color)'}}>На эту дату записей нет.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const DatePicker = ({ currentDate, onDateChange }: { currentDate: Date, onDateChange: (date: Date) => void }) => {
    return (
        <div className="flex items-center justify-between">
            <button onClick={() => onDateChange(subDays(currentDate, 1))} className="p-2"><ChevronLeft /></button>
            <div className="text-center">
                <p className="font-semibold">{format(currentDate, 'd MMMM yyyy', { locale: ru })}</p>
                <p className="text-sm capitalize" style={{color: 'var(--tg-theme-hint-color)'}}>{format(currentDate, 'eeee', { locale: ru })}</p>
            </div>
            <button onClick={() => onDateChange(addDays(currentDate, 1))} className="p-2"><ChevronRight /></button>
        </div>
    )
}

const BookingCard = ({ booking }: { booking: Booking }) => {
    const statusMeta = {
        pending: { color: 'border-l-yellow-500', bg: 'bg-yellow-500/10' },
        confirmed: { color: 'border-l-green-500', bg: 'bg-green-500/10' },
        completed: { color: 'border-l-blue-500', bg: 'bg-blue-500/10' },
        cancelled: { color: 'border-l-red-500', bg: 'bg-red-500/10' },
        no_show: { color: 'border-l-gray-500', bg: 'bg-gray-500/10' },
    }
    const meta = statusMeta[booking.status as keyof typeof statusMeta] || statusMeta.pending;
    
    return (
        <div className={cn("border-l-4 p-3", meta.color, meta.bg)}>
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2 font-semibold">
                        <img src={booking.client.photo} alt={booking.client.name} className="w-6 h-6 rounded-full"/>
                        <span>{booking.client.name}</span>
                    </div>
                     <p className="text-sm mt-1 ml-8" style={{color: 'var(--tg-theme-hint-color)'}}>{booking.service.name}</p>
                </div>
                <div className="text-right text-sm">
                    <p className="font-bold">{format(new Date(booking.start_time), 'HH:mm')} - {format(new Date(booking.end_time), 'HH:mm')}</p>
                    <p style={{color: 'var(--tg-theme-hint-color)'}}>{booking.master.name}</p>
                </div>
            </div>
        </div>
    )
}


const BookingCardSkeleton = () => {
    return (
         <div className="border-l-4 border-gray-300 p-3 bg-gray-500/10">
            <div className="flex justify-between items-start">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Skeleton className="w-6 h-6 rounded-full" />
                        <Skeleton className="h-5 w-32" />
                    </div>
                     <div className="ml-8"><Skeleton className="h-4 w-40" /></div>
                </div>
                <div className="space-y-1 text-right">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-4 w-20" />
                </div>
            </div>
        </div>
    )
}