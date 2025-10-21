import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Skeleton } from '../ui/Skeleton';
import { AIContentSuggestion } from '../../types';
import { Camera, Send, Clock } from 'lucide-react';
import WebApp from '@twa-dev/sdk';

interface AIContentCardProps {
  suggestions: AIContentSuggestion[];
}

const platformIcons: { [key in AIContentSuggestion['platform']]: string } = {
  instagram: '📷',
  vk: '🌐',
  telegram: '✈️',
};

export function AIContentCard({ suggestions }: AIContentCardProps) {

  const handleAction = () => {
    WebApp.showAlert('Эта функция находится в разработке.');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-blue-500" />
          <span>AI-Контент</span>
        </CardTitle>
        <CardDescription>Автоматическая генерация и постинг контента в соцсети.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestions.map(suggestion => (
          <div key={suggestion.id} className="p-4 rounded-lg" style={{backgroundColor: 'var(--tg-theme-secondary-bg-color)'}}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{platformIcons[suggestion.platform]}</span>
              <div className="flex-grow">
                <p className="font-semibold text-sm capitalize">{suggestion.platform} {suggestion.type}</p>
                <p className="text-xs" style={{color: 'var(--tg-theme-hint-color)'}}>На основе услуги "Детейлинг"</p>
              </div>
            </div>
            <p className="text-sm p-3 rounded-md bg-white/50 mb-3" style={{backgroundColor: 'var(--tg-theme-bg-color)'}}>
                {suggestion.generated_text}
            </p>
            <div className="flex gap-2">
              <button onClick={handleAction} className="flex-1 text-sm flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md" style={{backgroundColor: 'var(--tg-theme-button-color)', color: 'var(--tg-theme-button-text-color)'}}>
                <Send className="w-4 h-4" />
                <span>Опубликовать</span>
              </button>
               <button onClick={handleAction} className="flex-1 text-sm flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md" style={{backgroundColor: 'var(--tg-theme-bg-color)'}}>
                <Clock className="w-4 h-4" />
                <span>Запланировать</span>
              </button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function AIContentCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle><Skeleton className="h-6 w-40" /></CardTitle>
        <CardDescription><Skeleton className="h-4 w-full mt-2" /></CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 rounded-lg" style={{backgroundColor: 'var(--tg-theme-secondary-bg-color)'}}>
            <div className="flex gap-2 mb-2">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="flex-grow space-y-1.5">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
            </div>
            <Skeleton className="h-16 w-full mb-3" />
            <div className="flex gap-2">
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-8 w-1/2" />
            </div>
        </div>
      </CardContent>
    </Card>
  );
}