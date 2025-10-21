import React from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronRight, Settings, CreditCard, Warehouse, Gift, Star, Gem, FileText } from 'lucide-react';

const menuItems = [
  { href: '/finance', label: 'Финансы', icon: CreditCard },
  { href: '/inventory', label: 'Склад', icon: Warehouse },
  { href: '/loyalty', label: 'Лояльность', icon: Gift },
  { href: '/reviews', label: 'Отзывы', icon: Star },
  { href: '/reports', label: 'Отчёты', icon: FileText },
  { href: '/billing', label: 'Тариф и Биллинг', icon: Gem },
  { href: '/settings', label: 'Настройки', icon: Settings },
];

export function MorePage() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Еще</h1>
      <div className="space-y-2">
        {menuItems.map(item => (
            <NavLink to={item.href} key={item.href} className="flex justify-between items-center p-4 rounded-lg" style={{backgroundColor: 'var(--tg-theme-bg-color)'}}>
                <div className="flex items-center gap-4">
                    <item.icon className="w-6 h-6" style={{color: 'var(--tg-theme-hint-color)'}}/>
                    <span className="font-medium">{item.label}</span>
                </div>
                <ChevronRight className="w-5 h-5" style={{color: 'var(--tg-theme-hint-color)'}}/>
            </NavLink>
        ))}
      </div>
    </div>
  );
}