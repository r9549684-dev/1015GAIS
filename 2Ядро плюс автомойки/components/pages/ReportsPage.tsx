import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { BarChart3, Users, UserCheck, ShoppingBag, TrendingUp, Download } from 'lucide-react';
import { cn } from '../../lib/utils';
import WebApp from '@twa-dev/sdk';

type Period = 'day' | 'week' | 'month' | 'year';

const periods: { id: Period; label: string }[] = [
    { id: 'day', label: 'День' },
    { id: 'week', label: 'Неделя' },
    { id: 'month', label: 'Месяц' },
    { id: 'year', label: 'Год' },
];

const reports = [
    { type: 'financial', title: 'Финансовый отчёт', description: 'Выручка, расходы, чистая прибыль.', icon: BarChart3 },
    { type: 'clients', title: 'Отчёт по клиентам', description: 'Новые, постоянные, потерянные.', icon: Users },
    { type: 'masters', title: 'Отчёт по мастерам', description: 'Загрузка, доход, рейтинг.', icon: UserCheck },
    { type: 'services', title: 'Отчёт по услугам', description: 'Популярность, доходность.', icon: ShoppingBag },
    { type: 'growth', title: 'Динамика роста', description: 'Сравнение с прошлыми периодами.', icon: TrendingUp },
]

export function ReportsPage() {
    const [selectedPeriod, setSelectedPeriod] = useState<Period>('week');

    const handleGenerateReport = (reportTitle: string) => {
        const periodLabel = periods.find(p => p.id === selectedPeriod)?.label.toLowerCase() || '';
        WebApp.HapticFeedback.impactOccurred('light');
        WebApp.showAlert(`Формирование отчета "${reportTitle}" за ${periodLabel} началось. Он будет отправлен вам в Telegram.`);
    };

    return (
        <div className="p-4 space-y-6">
            <h1 className="text-2xl font-bold">Отчёты</h1>

            <div>
                <h2 className="text-sm font-semibold mb-2" style={{color: 'var(--tg-theme-hint-color)'}}>Выберите период</h2>
                <div className="grid grid-cols-4 gap-2">
                    {periods.map(period => (
                        <button
                            key={period.id}
                            onClick={() => setSelectedPeriod(period.id)}
                            className={cn(
                                'px-2 py-2 text-sm font-semibold rounded-lg transition-colors',
                                selectedPeriod === period.id
                                    ? 'text-[var(--tg-theme-button-text-color)] bg-[var(--tg-theme-button-color)]'
                                    : 'bg-[var(--tg-theme-secondary-bg-color)]'
                            )}
                        >
                            {period.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                {reports.map(report => (
                    <Card key={report.type}>
                        <CardHeader className="flex flex-row items-center justify-between pb-4">
                           <div className="flex items-center gap-4">
                               <report.icon className="w-8 h-8 text-[var(--tg-theme-link-color)]" />
                               <div>
                                    <CardTitle className="text-base">{report.title}</CardTitle>
                                    <CardDescription className="text-xs mt-1">{report.description}</CardDescription>
                               </div>
                           </div>
                        </CardHeader>
                        <CardContent>
                             <button 
                                onClick={() => handleGenerateReport(report.title)}
                                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold"
                                style={{backgroundColor: 'var(--tg-theme-secondary-bg-color)'}}
                             >
                                <Download className="w-4 h-4"/>
                                Сформировать
                             </button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}