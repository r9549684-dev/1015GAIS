
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import WebApp from '@twa-dev/sdk';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './components/pages/DashboardPage';
import { CalendarPage } from './components/pages/CalendarPage';
import { ClientsPage } from './components/pages/ClientsPage';
import { AnalyticsPage } from './components/pages/AnalyticsPage';
import { MorePage } from './components/pages/MorePage';
import { SettingsPage } from './components/pages/SettingsPage';
import { FinancePage } from './components/pages/FinancePage';
import { InventoryPage } from './components/pages/InventoryPage';
import { LoyaltyPage } from './components/pages/LoyaltyPage';
import { ReviewsPage } from './components/pages/ReviewsPage';
import { ReportsPage } from './components/pages/ReportsPage';
import { BillingPage } from './components/pages/BillingPage';
import { ClientDetailPage } from './components/pages/ClientDetailPage';
import { ClientFormPage } from './components/pages/ClientFormPage';
import { ResourcesPage } from './components/pages/ResourcesPage';
import { ResourceFormPage } from './components/pages/ResourceFormPage';
import { ErrorBoundary } from './components/shared/ErrorBoundary';
import { useAuthStore } from './stores/useAuthStore';

const queryClient = new QueryClient();

function App() {
  const { setUser } = useAuthStore();

  useEffect(() => {
    WebApp.ready();
    WebApp.expand();
    
    // Authenticate user
    if (WebApp.initDataUnsafe.user) {
        setUser(WebApp.initDataUnsafe.user);
    }
  }, [setUser]);

  return (
    <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<AppLayout />}>
                        <Route index element={<DashboardPage />} />
                        <Route path="calendar" element={<CalendarPage />} />
                        <Route path="clients" element={<ClientsPage />} />
                        <Route path="clients/new" element={<ClientFormPage />} />
                        <Route path="clients/:id" element={<ClientDetailPage />} />
                        <Route path="clients/:id/edit" element={<ClientFormPage />} />
                        <Route path="analytics" element={<AnalyticsPage />} />
                        <Route path="more" element={<MorePage />} />
                        
                        {/* MorePage routes */}
                        <Route path="settings" element={<SettingsPage />} />
                        <Route path="finance" element={<FinancePage />} />
                        <Route path="inventory" element={<InventoryPage />} />
                        <Route path="loyalty" element={<LoyaltyPage />} />
                        <Route path="reviews" element={<ReviewsPage />} />
                        <Route path="reports" element={<ReportsPage />} />
                        <Route path="billing" element={<BillingPage />} />
                        
                        <Route path="resources" element={<ResourcesPage />} />
                        <Route path="resources/new" element={<ResourceFormPage />} />
                        <Route path="resources/:id/edit" element={<ResourceFormPage />} />

                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
