import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { SettingsData } from '../../types';
import { Bot, CheckCircle2, Cloud, Cpu, Database, Globe, Instagram, MessageSquare, Server, Shield, Sun, WalletCards, XCircle } from 'lucide-react';

interface IntegrationsCardProps {
    settings: SettingsData;
}

const gateways = {
    yukassa: { name: 'ЮKassa' },
    tinkoff: { name: 'Tinkoff' },
    sbp: { name: 'СБП' }
}

export function IntegrationsCard({ settings }: IntegrationsCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                    <Cpu className="w-5 h-5" style={{color: 'var(--tg-theme-hint-color)'}}/>
                    <span>Технологии и Интеграции</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* FIX: Ensured children are passed correctly; the error was a side-effect of other typing issues. */}
                <IntegrationSection icon={WalletCards} title="Платежи и Уведомления">
                    <div className="grid grid-cols-2 gap-2">
                        {Object.entries(settings.payment.gateways).map(([key, value]) => {
                           const gateway = gateways[key as keyof typeof gateways];
                           if (!gateway) return null;
                           {/* FIX: The component now correctly handles the `key` prop due to being typed as React.FC. */}
                           return <IntegrationStatusChip key={key} label={gateway.name} isOk={value.enabled} />
                        })}
                        <IntegrationStatusChip label="SMS.ru" isOk={settings.integrations.external_services.sms_ru.status === 'active'} />
                    </div>
                </IntegrationSection>
                
                {/* FIX: Ensured children are passed correctly; the error was a side-effect of other typing issues. */}
                <IntegrationSection icon={Globe} title="Социальные сети и Маркетинг">
                     <div className="grid grid-cols-2 gap-2">
                        <IntegrationStatusChip label="Instagram" icon={Instagram} isOk={settings.integrations.social_media.instagram.status === 'connected'} />
                        <IntegrationStatusChip label="VK" icon={MessageSquare} isOk={settings.integrations.social_media.vk.status === 'connected'} />
                        <IntegrationStatusChip label="OpenWeatherMap" icon={Sun} isOk={settings.integrations.external_services.open_weather_map.status === 'active'} />
                    </div>
                </IntegrationSection>

                {/* FIX: Ensured children are passed correctly; the error was a side-effect of other typing issues. */}
                <IntegrationSection icon={Bot} title="AI Движок">
                    <div className="space-y-1">
                       <IntegrationStatusRow 
                            label="LLM Runtime" 
                            value={settings.integrations.ai_engine.llm_runtime} 
                            isOk={settings.integrations.ai_engine.status === 'active'} 
                        />
                       <IntegrationStatusRow 
                            label="База знаний (RAG)" 
                            value={settings.integrations.knowledge_base.provider} 
                            isOk={settings.integrations.knowledge_base.status === 'connected'} 
                        />
                    </div>
                </IntegrationSection>

                {/* FIX: Ensured children are passed correctly; the error was a side-effect of other typing issues. */}
                <IntegrationSection icon={Server} title="Инфраструктура и Мониторинг">
                     <div className="grid grid-cols-2 gap-2">
                        <IntegrationStatusChip label="Nginx" isOk={settings.infrastructure.nginx.status === 'operational'} />
                        <IntegrationStatusChip label="Cloudflare" icon={Cloud} isOk={settings.infrastructure.cloudflare.status === 'operational'} />
                        <IntegrationStatusChip label="Prometheus" isOk={settings.infrastructure.prometheus.status === 'operational'} />
                        <IntegrationStatusChip label="Sentry" isOk={settings.infrastructure.sentry.status === 'operational'} />
                    </div>
                </IntegrationSection>
            </CardContent>
        </Card>
    );
}

// FIX: Added 'children' to props to allow the component to render child elements.
const IntegrationSection: React.FC<{ icon: React.ElementType, title: string, children: React.ReactNode }> = ({ icon: Icon, title, children }) => (
    <div>
        <h4 className="font-semibold text-sm mb-2 flex items-center gap-1.5">
            <Icon className="w-4 h-4" />
            {title}
        </h4>
        {children}
    </div>
)

// FIX: Changed to React.FC to correctly handle special React props like `key`.
const IntegrationStatusChip: React.FC<{ label: string, icon?: React.ElementType, isOk: boolean }> = ({ label, icon: Icon, isOk }) => (
     <div className={`p-2 rounded-lg flex items-center justify-center gap-2 text-xs font-medium border ${isOk ? 'border-green-500/50 bg-green-500/10 text-green-700' : 'opacity-60 bg-[var(--tg-theme-secondary-bg-color)]'}`} >
        {Icon && <Icon className="w-3.5 h-3.5" />}
        <span>{label}</span>
    </div>
)

const IntegrationStatusRow = ({ label, value, isOk }: { label: string, value: string, isOk: boolean }) => (
    <div className="flex justify-between items-center p-2 rounded-md text-sm" style={{backgroundColor: 'var(--tg-theme-secondary-bg-color)'}}>
        <span style={{color: 'var(--tg-theme-hint-color)'}}>{label}</span>
        <div className="flex items-center gap-1.5 font-semibold">
            <span>{value}</span>
            {isOk 
                ? <CheckCircle2 className="w-4 h-4 text-green-500" /> 
                : <XCircle className="w-4 h-4 text-red-500" /> 
            }
        </div>
    </div>
)
