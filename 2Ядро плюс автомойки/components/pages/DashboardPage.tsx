import React from 'react';
import { useDashboard } from '../../hooks/api/useDashboard';
import { StatsCard, StatsSkeleton } from '../dashboard/StatsCard';
import { WeatherWidget, WeatherSkeleton } from '../dashboard/WeatherWidget';
import { UpcomingBookings, UpcomingBookingsSkeleton } from '../dashboard/UpcomingBookings';
import { AIInsights, AIInsightsSkeleton } from '../dashboard/AIInsights';
import { AIChatWidget, AIChatWidgetSkeleton } from '../dashboard/AIChatWidget';
import { ProblemsWidget, ProblemsWidgetSkeleton } from '../dashboard/ProblemsWidget';
import { WashBoxStatus, WashBoxStatusSkeleton } from '../dashboard/WashBoxStatus';
import { BarChart, Calendar, DollarSign, UserX } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';

export function DashboardPage() {
  const { data, isLoading } = useDashboard();
  const { user } = useAuthStore();

  return (
    <div className="p-4 space-y-4">
        <header>
            <h1 className="text-2xl font-bold">Главная</h1>
            <p style={{ color: 'var(--tg-theme-hint-color)'}}>
                Добро пожаловать, {user?.first_name || 'Пользователь'}!
            </p>
        </header>

      {isLoading ? <ProblemsWidgetSkeleton /> : data && <ProblemsWidget problems={data.problems} />}
      
      <div className="grid grid-cols-2 gap-4">
        {isLoading ? (
          <>
            <StatsSkeleton />
            <StatsSkeleton />
            <StatsSkeleton />
            <StatsSkeleton />
          </>
        ) : data ? (
          <>
            <StatsCard title="Выручка сегодня" value={`${data.today.revenue} ₽`} icon={DollarSign} />
            <StatsCard title="Записи сегодня" value={data.today.bookings} icon={Calendar} />
            <StatsCard title="Новые клиенты" value={data.today.clients} icon={BarChart} />
            <StatsCard title="Неявки" value={data.today.no_shows} icon={UserX} />
          </>
        ) : null}
      </div>

      {isLoading ? <WeatherSkeleton /> : data && <WeatherWidget weather={data.weather} />}

      {isLoading ? <UpcomingBookingsSkeleton /> : data && <UpcomingBookings bookings={data.upcoming} />}
      
      {isLoading ? <WashBoxStatusSkeleton /> : data && data.wash_boxes && <WashBoxStatus boxes={data.wash_boxes} />}
      
      {isLoading ? <AIInsightsSkeleton /> : data && <AIInsights insights={data.ai_insights} />}

      {isLoading ? <AIChatWidgetSkeleton /> : data && <AIChatWidget initialThread={data.ai_chat_thread} />}
    </div>
  );
}
