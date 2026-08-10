import React, { useState } from 'react';
import { Navbar, AppTab } from './components/Navbar';
import { CustomerMenuView } from './components/CustomerMenuView';
import { CartDrawer } from './components/CartDrawer';
import { CustomerOrderStatusView } from './components/CustomerOrderStatusView';
import { SellerOrderManagementView } from './components/SellerOrderManagementView';
import { BeverageCostManagerView } from './components/BeverageCostManagerView';
import { PromoCodeManagerView } from './components/PromoCodeManagerView';
import { DailySalesReportView } from './components/DailySalesReportView';
import { AdminCMSView } from './components/AdminCMSView';
import { AdminLoginModal } from './components/AdminLoginModal';

import {
  DEFAULT_BEVERAGES,
  DEFAULT_TOPPINGS,
  DEFAULT_PROMO_CODES,
  INITIAL_ORDERS,
  INITIAL_OPERATIONAL_EXPENSES,
} from './data/initialData';

import {
  Beverage,
  CartItem,
  PromoCode,
  Order,
  OrderStatus,
  OperationalExpense,
  ToppingOption,
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('menu');

  // Admin Security State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [adminPin, setAdminPin] = useState<string>('1234');
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState<boolean>(false);

  // Application State
  const [beverages, setBeverages] = useState<Beverage[]>(DEFAULT_BEVERAGES);
  const [toppings, setToppings] = useState<ToppingOption[]>(DEFAULT_TOPPINGS);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(DEFAULT_PROMO_CODES);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [operationalExpenses, setOperationalExpenses] = useState<OperationalExpense[]>(INITIAL_OPERATIONAL_EXPENSES);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Handlers for Cart
  const handleAddToCart = (newItem: Omit<CartItem, 'id'>) => {
    const itemWithId: CartItem = {
      ...newItem,
      id: 'cart-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    };
    setCartItems([...cartItems, itemWithId]);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            const singleUnitPrice = item.unitPrice;
            const singleUnitCost = item.unitCost;
            return {
              ...item,
              quantity: newQty,
              itemTotalPrice: singleUnitPrice * newQty,
              itemTotalCost: singleUnitCost * newQty,
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Handlers for Orders
  const handlePlaceOrder = (
    newOrderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'timeFormatted'>
  ) => {
    const nextNum = orders.length + 105;
    const orderNumStr = `IMC-${nextNum}`;

    const now = new Date();
    const timeFormatted = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const newOrder: Order = {
      ...newOrderData,
      id: 'ord-' + Date.now(),
      orderNumber: orderNumStr,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      timeFormatted,
      notifiedClient: false,
    };

    setOrders([newOrder, ...orders]);
    setCartItems([]);

    // Update promo code usage count if applied
    if (newOrderData.promoCode) {
      setPromoCodes((prev) =>
        prev.map((p) =>
          p.code.toUpperCase() === newOrderData.promoCode?.toUpperCase()
            ? { ...p, usedCount: p.usedCount + 1 }
            : p
        )
      );
    }

    // Direct user to Status page to view live status!
    setActiveTab('status');
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status: newStatus, updatedAt: new Date().toISOString() }
          : o
      )
    );
  };

  // Handlers for Beverages CMS
  const handleUpdateBeverage = (updatedBev: Beverage) => {
    setBeverages((prev) => prev.map((b) => (b.id === updatedBev.id ? updatedBev : b)));
  };

  const handleAddBeverage = (newBev: Beverage) => {
    setBeverages([...beverages, newBev]);
  };

  const handleDeleteBeverage = (id: string) => {
    setBeverages((prev) => prev.filter((b) => b.id !== id));
  };

  // Handlers for Toppings CMS
  const handleAddTopping = (newTop: ToppingOption) => {
    setToppings([...toppings, newTop]);
  };

  const handleUpdateTopping = (updatedTop: ToppingOption) => {
    setToppings((prev) => prev.map((t) => (t.id === updatedTop.id ? updatedTop : t)));
  };

  const handleDeleteTopping = (id: string) => {
    setToppings((prev) => prev.filter((t) => t.id !== id));
  };

  // Handlers for Promo Codes
  const handleAddPromoCode = (newPromo: PromoCode) => {
    setPromoCodes([newPromo, ...promoCodes]);
  };

  const handleTogglePromoCode = (id: string) => {
    setPromoCodes((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    );
  };

  const handleDeletePromoCode = (id: string) => {
    setPromoCodes((prev) => prev.filter((p) => p.id !== id));
  };

  // Handlers for Operational Expenses
  const handleAddOperationalExpense = (newExp: OperationalExpense) => {
    setOperationalExpenses([newExp, ...operationalExpenses]);
  };

  const handleDeleteOperationalExpense = (id: string) => {
    setOperationalExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  // Admin Auth Handlers
  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    setIsAdminLoginModalOpen(false);
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    if (activeTab !== 'menu' && activeTab !== 'status') {
      setActiveTab('menu');
    }
  };

  const handleChangeAdminPin = (newPin: string) => {
    setAdminPin(newPin);
  };

  const activeOrdersCount = orders.filter((o) => ['BARU', 'SEDANG_DIBUAT'].includes(o.status)).length;
  const readyOrdersCount = orders.filter((o) => o.status === 'AIR_SIAP').length;

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#2D241E] font-sans flex flex-col selection:bg-[#5D4037] selection:text-white">
      
      {/* Navbar Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        openCart={() => setIsCartOpen(true)}
        activeOrdersCount={activeOrdersCount}
        readyOrdersCount={readyOrdersCount}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenAdminLogin={() => setIsAdminLoginModalOpen(true)}
        onAdminLogout={handleAdminLogout}
      />

      {/* Main View Content */}
      <main className="flex-1 pb-16">
        {activeTab === 'menu' && (
          <CustomerMenuView
            beverages={beverages}
            toppings={toppings}
            onAddToCart={handleAddToCart}
            onOpenCart={() => setIsCartOpen(true)}
          />
        )}

        {activeTab === 'status' && <CustomerOrderStatusView orders={orders} />}

        {/* ADMIN VIEWS (CMS, Orders, Costs, Promos, Reports) */}
        {activeTab === 'admin-cms' && (
          isAdminLoggedIn ? (
            <AdminCMSView
              beverages={beverages}
              toppings={toppings}
              onAddBeverage={handleAddBeverage}
              onUpdateBeverage={handleUpdateBeverage}
              onDeleteBeverage={handleDeleteBeverage}
              onAddTopping={handleAddTopping}
              onUpdateTopping={handleUpdateTopping}
              onDeleteTopping={handleDeleteTopping}
              adminPin={adminPin}
              onChangeAdminPin={handleChangeAdminPin}
            />
          ) : (
            <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-2xl border border-[#E8E2D9] text-center space-y-4 shadow-sm">
              <div className="w-12 h-12 bg-[#3E2723] text-amber-300 rounded-2xl mx-auto flex items-center justify-center font-bold text-xl">
                🔒
              </div>
              <h2 className="text-xl font-bold text-[#2D241E]">Akses CMS Dikunci</h2>
              <p className="text-xs text-[#8D6E63]">
                Pengurusan Content Management System (CMS) hanya boleh diakses oleh Admin.
              </p>
              <button
                onClick={() => setIsAdminLoginModalOpen(true)}
                className="bg-[#3E2723] hover:bg-[#5D4037] text-white font-bold py-2.5 px-5 rounded-xl text-xs transition-all shadow-sm"
              >
                Masukkan PIN Admin
              </button>
            </div>
          )
        )}

        {activeTab === 'seller-orders' && (
          isAdminLoggedIn ? (
            <SellerOrderManagementView
              orders={orders}
              onUpdateOrderStatus={handleUpdateOrderStatus}
            />
          ) : (
            <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-2xl border border-[#E8E2D9] text-center space-y-4 shadow-sm">
              <div className="w-12 h-12 bg-[#3E2723] text-amber-300 rounded-2xl mx-auto flex items-center justify-center font-bold text-xl">
                🔒
              </div>
              <h2 className="text-xl font-bold text-[#2D241E]">Akses Pesanan Dikunci</h2>
              <p className="text-xs text-[#8D6E63]">
                Hanya Admin / Peniaga yang sah boleh melihat dan menguruskan pesanan pelanggan.
              </p>
              <button
                onClick={() => setIsAdminLoginModalOpen(true)}
                className="bg-[#3E2723] hover:bg-[#5D4037] text-white font-bold py-2.5 px-5 rounded-xl text-xs transition-all shadow-sm"
              >
                Masukkan PIN Admin
              </button>
            </div>
          )
        )}

        {activeTab === 'beverage-costs' && (
          isAdminLoggedIn ? (
            <BeverageCostManagerView
              beverages={beverages}
              onUpdateBeverage={handleUpdateBeverage}
              onAddBeverage={handleAddBeverage}
            />
          ) : (
            <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-2xl border border-[#E8E2D9] text-center space-y-4 shadow-sm">
              <div className="w-12 h-12 bg-[#3E2723] text-amber-300 rounded-2xl mx-auto flex items-center justify-center font-bold text-xl">
                🔒
              </div>
              <h2 className="text-xl font-bold text-[#2D241E]">Akses Kos & Harga Dikunci</h2>
              <p className="text-xs text-[#8D6E63]">
                Pengurusan kos bahan dan harga jualan adalah sulit untuk Admin sahaja.
              </p>
              <button
                onClick={() => setIsAdminLoginModalOpen(true)}
                className="bg-[#3E2723] hover:bg-[#5D4037] text-white font-bold py-2.5 px-5 rounded-xl text-xs transition-all shadow-sm"
              >
                Masukkan PIN Admin
              </button>
            </div>
          )
        )}

        {activeTab === 'promos' && (
          isAdminLoggedIn ? (
            <PromoCodeManagerView
              promoCodes={promoCodes}
              onAddPromoCode={handleAddPromoCode}
              onTogglePromoCode={handleTogglePromoCode}
              onDeletePromoCode={handleDeletePromoCode}
            />
          ) : (
            <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-2xl border border-[#E8E2D9] text-center space-y-4 shadow-sm">
              <div className="w-12 h-12 bg-[#3E2723] text-amber-300 rounded-2xl mx-auto flex items-center justify-center font-bold text-xl">
                🔒
              </div>
              <h2 className="text-xl font-bold text-[#2D241E]">Akses Promo Kod Dikunci</h2>
              <p className="text-xs text-[#8D6E63]">
                Hanya Admin yang sah boleh mengurus dan mencipta Promo Kod diskaun.
              </p>
              <button
                onClick={() => setIsAdminLoginModalOpen(true)}
                className="bg-[#3E2723] hover:bg-[#5D4037] text-white font-bold py-2.5 px-5 rounded-xl text-xs transition-all shadow-sm"
              >
                Masukkan PIN Admin
              </button>
            </div>
          )
        )}

        {activeTab === 'daily-report' && (
          isAdminLoggedIn ? (
            <DailySalesReportView
              orders={orders}
              operationalExpenses={operationalExpenses}
              beverages={beverages}
              onAddOperationalExpense={handleAddOperationalExpense}
              onDeleteOperationalExpense={handleDeleteOperationalExpense}
            />
          ) : (
            <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-2xl border border-[#E8E2D9] text-center space-y-4 shadow-sm">
              <div className="w-12 h-12 bg-[#3E2723] text-amber-300 rounded-2xl mx-auto flex items-center justify-center font-bold text-xl">
                🔒
              </div>
              <h2 className="text-xl font-bold text-[#2D241E]">Laporan Keuntungan Dikunci</h2>
              <p className="text-xs text-[#8D6E63]">
                Laporan pendapatan, kos perbelanjaan dan keuntungan bersih adalah sulit untuk Admin sahaja.
              </p>
              <button
                onClick={() => setIsAdminLoginModalOpen(true)}
                className="bg-[#3E2723] hover:bg-[#5D4037] text-white font-bold py-2.5 px-5 rounded-xl text-xs transition-all shadow-sm"
              >
                Masukkan PIN Admin
              </button>
            </div>
          )
        )}
      </main>

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
        currentPin={adminPin}
      />

      {/* Shopping Cart Drawer Modal */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        promoCodes={promoCodes}
        onPlaceOrder={handlePlaceOrder}
      />

      {/* Footer Branding */}
      <footer className="bg-[#3E2723] text-[#8D6E63] text-xs py-6 text-center border-t border-[#5D4037]">
        <p className="font-bold text-white text-sm uppercase tracking-wider">IMANIES COFFEE © 2026</p>
        <p className="mt-1 text-[11px] opacity-80">Sistem CMS Pengurusan Item Jualan, Kos & Laporan Keuntungan Harian Automatik (Admin Protected)</p>
      </footer>
    </div>
  );
}

