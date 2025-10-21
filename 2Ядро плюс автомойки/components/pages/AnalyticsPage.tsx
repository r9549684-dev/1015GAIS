import React from 'react';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { AnalyticsData } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Skeleton } from '../ui/Skeleton';
import { AIMarketingCard, AIMarketingCardSkeleton } from '../analytics/AIMarketingCard';
import { AIContentCard, AIContentCardSkeleton } from '../analytics/AIContentCard';

export function AnalyticsPage() {
  const { data, isLoading } = useQuery<AnalyticsData>({
    queryKey: ['analytics'],
    queryFn: () => api.get('/analytics?period=week')
  });

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Аналитика</h1>

      <Card>
        <CardHeader>
          <CardTitle>Выручка за неделю</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : data ? (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.revenue.data.map((val, i) => ({name: data.revenue.labels[i], Выручка: val}))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--tg-theme-hint-color)" />
                  <XAxis dataKey="name" stroke="var(--tg-theme-hint-color)" fontSize={12} />
                  <YAxis stroke="var(--tg-theme-hint-color)" fontSize={12} tickFormatter={(value) => `${value/1000}k`} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--tg-theme-bg-color)', border: '1px solid var(--tg-theme-secondary-bg-color)' }} />
                  <Line type="monotone" dataKey="Выручка" stroke="var(--tg-theme-link-color)" strokeWidth={2} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Записи за неделю</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : data ? (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.bookings.data.map((val, i) => ({name: data.bookings.labels[i], Записи: val}))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--tg-theme-hint-color)" />
                  <XAxis dataKey="name" stroke="var(--tg-theme-hint-color)" fontSize={12} />
                  <YAxis stroke="var(--tg-theme-hint-color)" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--tg-theme-bg-color)', border: '1px solid var(--tg-theme-secondary-bg-color)' }}/>
                  <Bar dataKey="Записи" fill="var(--tg-theme-button-color)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {isLoading ? <AIMarketingCardSkeleton /> : data && <AIMarketingCard triggers={data.marketing_triggers} />}
      
      {isLoading ? <AIContentCardSkeleton /> : data && <AIContentCard suggestions={data.content_suggestions} />}

    </div>
  );
}