import React from 'react';
import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { useNewBookingModalStore } from '../../stores/useNewBookingModalStore';
import { NewBookingModal } from '../booking/NewBookingModal';
import { useWashBoxDetailModalStore } from '../../stores/useWashBoxDetailModalStore';
import { WashBoxDetailModal } from '../dashboard/WashBoxDetailModal';

export function AppLayout() {
  const isNewBookingOpen = useNewBookingModalStore(state => state.isOpen);
  const { isOpen: isWashBoxDetailOpen, box: washBoxDetail } = useWashBoxDetailModalStore();

  return (
    <div className="pb-16 min-h-screen" style={{ backgroundColor: 'var(--tg-theme-secondary-bg-color)' }}>
      <main>
        <Outlet />
      </main>
      <BottomNav />
      {isNewBookingOpen && <NewBookingModal />}
      {isWashBoxDetailOpen && washBoxDetail && <WashBoxDetailModal box={washBoxDetail} />}
    </div>
  );
}
