import React from 'react';
import { useBilling } from '../../hooks/api/useBilling';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Skeleton } from '../ui/Skeleton';
import { AddonPackage, BillingData, Niche, SubscriptionPlan } from '../../types';
import { CheckCircle2, Star, MessageSquare, HardDrive, Car } from 'lucide-react';
import { cn } from '../../lib/utils';
import WebApp from '@twa-dev/sdk';

const nicheIcons: { [key in Niche]: React.ElementType } = {
    carwash: Car,
    salon: Star,
    autoservice: Car,
}

export function BillingPage() {
  const { data, isLoading } = useBilling();

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Тариф и Биллинг</h1>
      
      {isLoading ? <CurrentPlanSkeleton /> : data && <CurrentPlanCard data={data} />}

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Сменить тариф</h2>
        {isLoading ? (
          <>
            <PlanSkeleton />
            <PlanSkeleton />
          </>
        ) : (
          data?.available_plans.map(plan => (
            // FIX: The PlanCard component now correctly handles the `key` prop.
            <PlanCard key={plan.id} plan={plan} isCurrent={plan.id === data.current_plan_id} />
          ))
        )}
      </div>

      {isLoading ? <Skeleton className="h-40 w-full" /> : data && <AddonsCard addons={data.addons} />}
    </div>
  );
}

function CurrentPlanCard({ data }: { data: BillingData }) {
    const currentPlan = data.available_plans.find(p => p.id === data.current_plan_id);
    if (!currentPlan) return null;
    
    return (
        <Card className="border-2 border-green-500">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>Ваш тариф: {currentPlan.name}</CardTitle>
                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-green-500/20 text-green-700">Активен</span>
                </div>
                <CardDescription>{currentPlan.price} ₽/месяц</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
                <UsageBar label="Мастера" current={data.usage.masters.current} limit={data.usage.masters.limit} />
                <UsageBar label="Хранилище" current={data.usage.storage_mb.current} limit={data.usage.storage_mb.limit} unit="MB" />
            </CardContent>
        </Card>
    )
}

// FIX: Changed to React.FC to correctly handle special React props like `key`.
const PlanCard: React.FC<{ plan: SubscriptionPlan, isCurrent: boolean }> = ({ plan, isCurrent }) => {
    const handleSelect = () => {
        if (isCurrent) return;
        WebApp.HapticFeedback.impactOccurred('light');
        WebApp.showConfirm(`Вы уверены, что хотите перейти на тариф "${plan.name}" за ${plan.price} ₽/мес?`, (isOk) => {
            if (isOk) {
                WebApp.showAlert('Ваш запрос на смену тарифа принят!');
            }
        });
    }

    return (
        <Card className={cn(isCurrent ? 'opacity-60' : '', plan.is_recommended ? 'border-[var(--tg-theme-button-color)]' : '')}>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="flex items-center gap-2">{plan.name} {plan.is_recommended && <Star className="w-4 h-4 text-yellow-500" />}</CardTitle>
                        <CardDescription>{plan.price} ₽/месяц</CardDescription>
                    </div>
                    <button 
                        onClick={handleSelect}
                        disabled={isCurrent}
                        className="px-4 py-2 text-sm font-semibold rounded-lg disabled:opacity-50" 
                        style={{
                            backgroundColor: isCurrent ? 'var(--tg-theme-secondary-bg-color)' : 'var(--tg-theme-button-color)', 
                            color: isCurrent ? 'var(--tg-theme-hint-color)' : 'var(--tg-theme-button-text-color)'
                        }}
                    >
                        {isCurrent ? 'Текущий' : 'Выбрать'}
                    </button>
                </div>
            </CardHeader>
            <CardContent>
                <ul className="space-y-2 text-sm">
                    {plan.features.map(feature => (
                        <li key={feature} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
                            <span>{feature}</span>
                        </li>
                    ))}
                    {plan.modules.length > 0 && (
                        <li className="flex items-start gap-2 pt-2 border-t mt-2" style={{borderColor: 'var(--tg-theme-secondary-bg-color)'}}>
                            <CheckCircle2 className="w-4 h-4 mt-0.5 text-blue-500 flex-shrink-0" />
                            <div>
                                <span className="font-semibold">Нишевые модули:</span>
                                <div className="flex gap-2 mt-1">
                                    {plan.modules.map(m => {
                                        const Icon = nicheIcons[m];
                                        return <div key={m} className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full" style={{backgroundColor: 'var(--tg-theme-secondary-bg-color)'}}><Icon className="w-3.5 h-3.5" /> <span>{m === 'carwash' ? 'Автомойки' : m}</span></div>
                                    })}
                                </div>
                            </div>
                        </li>
                    )}
                </ul>
            </CardContent>
        </Card>
    )
}

function AddonsCard({ addons }: { addons: AddonPackage[] }) {
    const handleBuy = (name: string) => {
        WebApp.showAlert(`Покупка пакета "${name}" находится в разработке.`);
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Дополнительные опции</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {addons.map(addon => (
                     <div key={addon.name} className="flex justify-between items-center p-2 rounded-lg" style={{backgroundColor: 'var(--tg-theme-secondary-bg-color)'}}>
                        <div className="flex items-center gap-2">
                            {addon.type === 'sms' 
                                ? <MessageSquare className="w-5 h-5" style={{color: 'var(--tg-theme-hint-color)'}}/> 
                                : <HardDrive className="w-5 h-5" style={{color: 'var(--tg-theme-hint-color)'}}/>
                            }
                            <div>
                                <p className="font-semibold text-sm">{addon.name}</p>
                                <p className="text-xs" style={{color: 'var(--tg-theme-hint-color)'}}>{addon.price} ₽</p>
                            </div>
                        </div>
                        <button onClick={() => handleBuy(addon.name)} className="px-3 py-1.5 text-xs font-semibold rounded-md" style={{backgroundColor: 'var(--tg-theme-button-color)', color: 'var(--tg-theme-button-text-color)'}}>
                            Купить
                        </button>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}

const UsageBar = ({ label, current, limit, unit = '' }: { label: string, current: number, limit: number | 'unlimited', unit?: string }) => {
    if (limit === 'unlimited') {
        return (
             <div>
                <div className="flex justify-between text-xs mb-1">
                    <span style={{color: 'var(--tg-theme-hint-color)'}}>{label}</span>
                    <span>{current} / ∞</span>
                </div>
                <div className="w-full h-1.5 rounded-full" style={{backgroundColor: 'var(--tg-theme-secondary-bg-color)'}}>
                    <div className="h-1.5 rounded-full bg-green-500" style={{ width: '100%' }} />
                </div>
            </div>
        )
    }
    const percent = Math.min((current / limit) * 100, 100);
    return (
        <div>
            <div className="flex justify-between text-xs mb-1">
                <span style={{color: 'var(--tg-theme-hint-color)'}}>{label}</span>
                <span>{current} / {limit} {unit}</span>
            </div>
            <div className="w-full h-1.5 rounded-full" style={{backgroundColor: 'var(--tg-theme-secondary-bg-color)'}}>
                <div className="h-1.5 rounded-full" style={{ width: `${percent}%`, backgroundColor: percent > 85 ? '#ef4444' : '#22c55e' }} />
            </div>
        </div>
    )
}

// Skeletons
const CurrentPlanSkeleton = () => (
    <Card>
        <CardHeader><Skeleton className="h-6 w-3/4" /><Skeleton className="h-4 w-1/4 mt-2" /></CardHeader>
        <CardContent className="space-y-3"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-full" /></CardContent>
    </Card>
)
const PlanSkeleton = () => (
    <Card>
        <CardHeader><Skeleton className="h-6 w-1/2" /><Skeleton className="h-4 w-1/4 mt-2" /></CardHeader>
        <CardContent className="space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-5/6" /></CardContent>
    </Card>
)
