import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Gift, Star, Ticket } from 'lucide-react';

export function LoyaltyPage() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Лояльность</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span>Бонусная система</span>
          </CardTitle>
          <CardDescription>1 балл = 1 рубль. Начисляются за визиты, списываются при оплате.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
            <p><strong>Автоматические бонусы:</strong></p>
            <ul className="list-disc list-inside" style={{color: 'var(--tg-theme-hint-color)'}}>
                <li>+500 баллов на День рождения</li>
                <li>Баллы x2 за 10-й визит</li>
                <li>+300 баллов за приведенного друга</li>
                <li>+100 баллов за отзыв с фото</li>
            </ul>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-green-500" />
            <span>Абонементы</span>
          </CardTitle>
          <CardDescription>Пакеты услуг со скидкой для постоянных клиентов.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
            <p><strong>Примеры:</strong></p>
            <ul className="list-disc list-inside" style={{color: 'var(--tg-theme-hint-color)'}}>
                <li>10 комплексных моек со скидкой 15%</li>
                <li>5 стрижек со скидкой 20%</li>
                <li>Годовое ТО со скидкой 25%</li>
            </ul>
        </CardContent>
      </Card>
    </div>
  );
}