
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Skeleton } from '../ui/Skeleton';
import { LucideProps } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType<LucideProps>;
}

export function StatsCard({ title, value, icon: Icon }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4" style={{ color: 'var(--tg-theme-hint-color)'}} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

export function StatsSkeleton() {
    return <Skeleton className="h-[100px] w-full" />;
}
