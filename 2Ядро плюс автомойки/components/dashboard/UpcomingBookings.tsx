
import React from 'react';
// FIX: Changed date-fns imports to use default exports from submodules to resolve module resolution issues.
import format from 'date-fns/format';
import ru from 'date-fns/locale/ru';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Booking } from '../../types';
import { Skeleton } from '../ui/Skeleton';
import { Clock } from 'lucide-react';

interface UpcomingBookingsProps {
  bookings: Booking[];
}

export function UpcomingBookings({ bookings }: UpcomingBookingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ближайшие записи</CardTitle>
      </CardHeader>
      <CardContent>
        {bookings.length > 0 ? (
          <ul className="space-y-4">
            {bookings.map((booking) => (
              <li key={booking.id} className="flex items-center gap-4">
                <div className="flex-shrink-0 text-center w-14">
                    <div className="font-bold text-lg" style={{ color: 'var(--tg-theme-link-color)'}}>
                        {format(new Date(booking.start_time), 'HH:mm')}
                    </div>
                </div>
                <div className="w-1 flex-shrink-0 h-10 rounded-full" style={{ backgroundColor: booking.status === 'confirmed' ? '#10B981' : '#F59E0B' }}></div>
                <div className="flex-grow">
                  <p className="font-semibold">{booking.client.name}</p>
                  <p className="text-sm" style={{ color: 'var(--tg-theme-hint-color)'}}>{booking.service.name}</p>
                </div>
                <div className="text-sm" style={{ color: 'var(--tg-theme-hint-color)'}}>{booking.master.name}</div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center py-4" style={{ color: 'var(--tg-theme-hint-color)'}}>Нет предстоящих записей.</p>
        )}
      </CardContent>
    </Card>
  );
}

export function UpcomingBookingsSkeleton() {
    return (
        <Card>
            <CardHeader><CardTitle><Skeleton className="h-6 w-40" /></CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-4 items-center"><Skeleton className="h-10 w-14" /><Skeleton className="h-10 w-full" /></div>
                <div className="flex gap-4 items-center"><Skeleton className="h-10 w-14" /><Skeleton className="h-10 w-full" /></div>
                <div className="flex gap-4 items-center"><Skeleton className="h-10 w-14" /><Skeleton className="h-10 w-full" /></div>
            </CardContent>
        </Card>
    )
}