import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { RestaurantListSection } from './components/RestaurantListSection';
import { RestaurantDetailModal } from './components/RestaurantDetailModal';
import { CustomOrderView } from './components/CustomOrderView';
import { OrderTrackingView } from './components/OrderTrackingView';
import { CustomerAccountView } from './components/CustomerAccountView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { CartDrawer } from './components/CartDrawer';
import { ConflictModal } from './components/ConflictModal';
import { ToastContainer } from './components/ToastContainer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';
import { Restaurant } from './types';

function MainAppContent() {
  const { activeView, selectedRestaurantId, setSelectedRestaurantId, restaurants } = useStore();
  const [searchQuery, setSearchQuery] = useState('');

  // Selected restaurant object for detail view modal
  const selectedRestaurant = selectedRestaurantId
    ? restaurants.find(r => r.id === selectedRestaurantId) || null
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-red-600 selection:text-white pb-16 md:pb-0">
      {/* Toast Notification Container */}
      <ToastContainer />

      {/* Cart Conflict Enforcement Modal */}
      <ConflictModal />

      {/* Cart Sliding Drawer */}
      <CartDrawer />

      {/* Selected Restaurant Menu & Ordering Modal */}
      {selectedRestaurant && (
        <RestaurantDetailModal
          restaurant={selectedRestaurant}
          onClose={() => setSelectedRestaurantId(null)}
        />
      )}

      {/* Sticky Navigation Header */}
      <Navbar />

      {/* Main Dynamic View Content */}
      <main className="flex-1">
        {activeView === 'home' && (
          <>
            <HeroSection
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
            <RestaurantListSection
              onSelectRestaurant={(res: Restaurant) => setSelectedRestaurantId(res.id)}
              externalSearchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
            <HowItWorksSection />
          </>
        )}

        {activeView === 'restaurants' && (
          <div className="pt-4">
            <RestaurantListSection
              onSelectRestaurant={(res: Restaurant) => setSelectedRestaurantId(res.id)}
              externalSearchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>
        )}

        {activeView === 'custom_order' && <CustomOrderView />}

        {activeView === 'how_it_works' && <HowItWorksSection />}

        {activeView === 'track' && <OrderTrackingView />}

        {activeView === 'account' && <CustomerAccountView />}

        {activeView === 'admin' && <AdminDashboardView />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Sticky Bottom Navigation Bar */}
      <MobileBottomNav />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <StoreProvider>
        <MainAppContent />
      </StoreProvider>
    </LanguageProvider>
  );
}
