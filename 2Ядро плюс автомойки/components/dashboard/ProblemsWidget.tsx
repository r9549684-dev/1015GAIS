import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { Skeleton } from '../ui/Skeleton';
import { AlertCircle, CreditCard } from 'lucide-react';

interface ProblemsWidgetProps {
  problems: {
    unconfirmed_bookings: number;
    unpaid_bookings: number;
  };
}

export function ProblemsWidget({ problems }: ProblemsWidgetProps) {
  const hasProblems = problems.unconfirmed_bookings > 0 || problems.unpaid_bookings > 0;

  if (!hasProblems) {
    return null;
  }

  return (
    <Card className="border-yellow-500/50 bg-yellow-500/10">
      <CardContent className="p-4 flex items-center justify-around gap-4">
        {problems.unconfirmed_bookings > 0 && (
          <div className="flex items-center gap-2 text-yellow-600">
            <AlertCircle className="w-5 h-5" />
            <div>
              <div className="font-bold">{problems.unconfirmed_bookings}</div>
              <div className="text-xs">Неподтвержденных</div>
            </div>
          </div>
        )}
        {problems.unpaid_bookings > 0 && (
          <div className="flex items-center gap-2 text-yellow-600">
            <CreditCard className="w-5 h-5" />
            <div>
              <div className="font-bold">{problems.unpaid_bookings}</div>
              <div className="text-xs">Неоплаченных</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function ProblemsWidgetSkeleton() {
    return <Skeleton className="h-[72px] w-full" />;
}