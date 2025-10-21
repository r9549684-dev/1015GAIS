import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, Users, BarChart2, MoreHorizontal } from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { href: '/', label: 'Главная', icon: LayoutDashboard },
  { href: '/calendar', label: 'Календарь', icon: Calendar },
  { href: '/clients', label: 'Клиенты', icon: Users },
  { href: '/analytics', label: 'Аналитика', icon: BarChart2 },
  { href: '/more', label: 'Еще', icon: MoreHorizontal },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t" style={{ backgroundColor: 'var(--tg-theme-bg-color)', borderColor: 'var(--tg-theme-hint-color)'}}>
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center w-full h-full gap-1 transition-colors',
                (isActive && item.href !== '/more') || (item.href === '/more' && location.pathname.startsWith('/more'))
                  ? 'text-[var(--tg-theme-link-color)]'
                  : 'text-[var(--tg-theme-hint-color)] hover:text-[var(--tg-theme-text-color)]'
              )
            }
          >
            <item.icon className="w-6 h-6" />
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}