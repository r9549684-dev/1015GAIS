import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Skeleton } from '../ui/Skeleton';
import { Sparkles } from 'lucide-react';

interface AIInsightsProps {
  insights: {
    revenue_forecast: string;
    recommendations: string[];
  };
}

export function AIInsights({ insights }: AIInsightsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          <span>Аналитика от AI</span>
        </CardTitle>
        <CardDescription>{insights.revenue_forecast}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm list-disc list-inside">
          {insights.recommendations.map((rec, index) => (
            <li key={index}>{rec}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}


export function AIInsightsSkeleton() {
    return (
        <Card>
            <CardHeader>
                <CardTitle><Skeleton className="h-6 w-48" /></CardTitle>
                <CardDescription><Skeleton className="h-4 w-full mt-2" /></CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </CardContent>
        </Card>
    );
}