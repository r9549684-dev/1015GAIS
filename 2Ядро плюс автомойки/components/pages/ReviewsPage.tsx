
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Review } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Skeleton } from '../ui/Skeleton';
import { Star, MoreVertical, ThumbsUp, MessageCircle, EyeOff } from 'lucide-react';
// FIX: Changed date-fns imports to use default exports from submodules to resolve module resolution issues.
import format from 'date-fns/format';
import ru from 'date-fns/locale/ru';

export function ReviewsPage() {
  const { data, isLoading } = useQuery<{ reviews: Review[] }>({
    queryKey: ['reviews'],
    queryFn: () => api.get('/reviews')
  });

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Отзывы</h1>
      
      <div className="space-y-3">
        {isLoading ? (
          <>
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </>
        ) : data?.reviews.map(review => (
          <Card key={review.id} className={review.status === 'pending' ? 'border-yellow-500/50' : ''}>
            <CardHeader className="flex flex-row justify-between items-start pb-2">
              <div className="flex items-center gap-3">
                <img src={review.client_photo || `https://i.pravatar.cc/150?u=${review.client_name}`} alt={review.client_name} className="w-10 h-10 rounded-full" />
                <div>
                  <p className="font-semibold">{review.client_name}</p>
                  <p className="text-xs" style={{color: 'var(--tg-theme-hint-color)'}}>
                    {format(new Date(review.date), 'd MMMM yyyy', { locale: ru })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-yellow-500 font-bold">
                  <Star className="w-4 h-4" fill="currentColor" /> 
                  <span>{((review.rating_master + review.rating_service + review.rating_atmosphere)/3).toFixed(1)}</span>
              </div>
            </CardHeader>
            <CardContent>
                {review.text && <p className="text-sm mb-3">"{review.text}"</p>}
                <div className="flex gap-2">
                    <button className="flex-1 text-sm flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md" style={{backgroundColor: 'var(--tg-theme-secondary-bg-color)'}}>
                       <MessageCircle className="w-4 h-4" /> <span>Ответить</span>
                    </button>
                    {review.status === 'pending' && (
                         <button className="flex-1 text-sm flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-green-500/20 text-green-700">
                            <ThumbsUp className="w-4 h-4" /> <span>Одобрить</span>
                         </button>
                    )}
                     <button className="flex-1 text-sm flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-red-500/10 text-red-600">
                        <EyeOff className="w-4 h-4" /> <span>Скрыть</span>
                    </button>
                </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}