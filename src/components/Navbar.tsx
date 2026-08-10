import React from 'react';
import { ShoppingBag, Coffee, FileText, Tag, Receipt, CheckCircle, Smartphone, PackageCheck, Lock, Unlock, LogOut } from 'lucide-react';

export type AppTab = 'menu' | 'status' | 'admin-cms' | 'seller-orders' | 'beverage-costs' | 'promos' | 'daily-report';

interface NavbarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  cartCount: number;
  openCart: () => void;
  activeOrdersCount: number;
  readyOrdersCount: number;
  isAdminLoggedIn: boolean;
  onOpenAdminLogin: () => void;
  onAdminLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  openCart,
  activeOrdersCount,
  readyOrdersCount,
  isAdminLoggedIn,
  onOpenAdminLogin,
  onAdminLogout,
}) => {
  const handleTabClick = (tab: AppTab) => {
    // If clicking an admin tab while not logged in, trigger admin login modal!
    const isAdminTab = ['admin-cms', 'seller-orders', 'beverage-costs', 'promos', 'daily-report'].includes(tab);
    if (isAdminTab && !isAdminLoggedIn) {
      onOpenAdminLogin();
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E8E2D9] shadow-sm text-[#2D241E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('menu')}>
            <div className="w-10 h-10 rounded-xl bg-[#3E2723] text-amber-300 flex items-center justify-center font-bold text-xl shadow-sm border border-[#5D4037]">
              I
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-[#3E2723] uppercase">IMANIES COFFEE</span>
                <span className="text-[10px] bg-[#EFEBE9] text-[#5D4037] font-semibold px-2 py-0.5 rounded-full border border-[#E8E2D9]">
                  CMS & POS
                </span>
              </div>
              <p className="text-[11px] text-[#8D6E63] font-medium hidden sm:block">
                Sistem CMS Pengurusan Item Jualan, Kos & Laporan
              </p>
            </div>
          </div>

          {/* Quick Actions, Admin Auth & Cart Button */}
          <div className="flex items-center gap-2">
            
            {/* Admin Login / Session Status Badge */}
            {isAdminLoggedIn ? (
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                  <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">Admin Aktif</span>
                </span>
                <button
                  onClick={onAdminLogout}
                  className="bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-[11px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 transition-colors"
                  title="Log Keluar Mod Admin"
                >
                  <LogOut className="w-3 h-3" /> Log Keluar
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAdminLogin}
                className="flex items-center gap-1.5 bg-[#FAF9F6] hover:bg-[#EFEBE9] text-[#3E2723] border border-[#E8E2D9] px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
              >
                <Lock className="w-3.5 h-3.5 text-[#5D4037]" />
                <span>Log Masuk Admin</span>
              </button>
            )}

            <button
              onClick={openCart}
              className="relative flex items-center gap-2 bg-[#3E2723] hover:bg-[#5D4037] text-white font-medium px-4 py-2 rounded-xl text-sm transition-all shadow-sm active:scale-95"
            >
              <ShoppingBag className="w-4 h-4 text-amber-200" />
              <span className="hidden sm:inline">Troli Air</span>
              {cartCount > 0 ? (
                <span className="bg-amber-400 text-[#3E2723] text-xs font-bold px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              ) : null}
            </button>
          </div>
        </div>

        {/* Sub-Navigation Bar: Customer vs Admin Views */}
        <div className="flex items-center justify-between overflow-x-auto no-scrollbar py-2 border-t border-[#E8E2D9] text-xs sm:text-sm gap-1 bg-[#FAF9F6] -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1.5 min-w-max">
            
            {/* Customer Views */}
            <span className="text-[#8D6E63] font-bold text-[10px] uppercase tracking-wider px-2">Pelanggan:</span>
            
            <button
              onClick={() => handleTabClick('menu')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-xs transition-colors ${
                activeTab === 'menu'
                  ? 'bg-[#3E2723] text-white font-bold shadow-sm'
                  : 'text-[#5D4037] hover:bg-[#EFEBE9]'
              }`}
            >
              <Coffee className="w-3.5 h-3.5" />
              Pilih Air
            </button>

            <button
              onClick={() => handleTabClick('status')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-xs transition-colors relative ${
                activeTab === 'status'
                  ? 'bg-[#3E2723] text-white font-bold shadow-sm'
                  : 'text-[#5D4037] hover:bg-[#EFEBE9]'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              Status Air Saya
              {readyOrdersCount > 0 && (
                <span className="bg-emerald-600 text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-full animate-pulse">
                  Siap!
                </span>
              )}
            </button>

            <div className="h-4 w-px bg-[#E8E2D9] mx-1" />

            {/* Admin Views */}
            <span className="text-[#8D6E63] font-bold text-[10px] uppercase tracking-wider px-2 flex items-center gap-1">
              {!isAdminLoggedIn && <Lock className="w-3 h-3 text-[#8D6E63]" />}
              Pentadbir (Admin):
            </span>

            {/* Admin CMS Item Jualan */}
            <button
              onClick={() => handleTabClick('admin-cms')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-xs transition-colors relative ${
                activeTab === 'admin-cms'
                  ? 'bg-[#3E2723] text-white font-bold shadow-sm'
                  : 'text-[#5D4037] hover:bg-[#EFEBE9]'
              }`}
            >
              <PackageCheck className="w-3.5 h-3.5 text-amber-400" />
              CMS Item Jualan
              {!isAdminLoggedIn && <Lock className="w-3 h-3 text-[#8D6E63]" />}
            </button>

            <button
              onClick={() => handleTabClick('seller-orders')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-xs transition-colors relative ${
                activeTab === 'seller-orders'
                  ? 'bg-[#3E2723] text-white font-bold shadow-sm'
                  : 'text-[#5D4037] hover:bg-[#EFEBE9]'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Pesanan Masuk
              {activeOrdersCount > 0 && (
                <span className="bg-[#5D4037] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {activeOrdersCount}
                </span>
              )}
              {!isAdminLoggedIn && <Lock className="w-3 h-3 text-[#8D6E63]" />}
            </button>

            <button
              onClick={() => handleTabClick('beverage-costs')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-xs transition-colors ${
                activeTab === 'beverage-costs'
                  ? 'bg-[#3E2723] text-white font-bold shadow-sm'
                  : 'text-[#5D4037] hover:bg-[#EFEBE9]'
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
              Kos & Harga Air
              {!isAdminLoggedIn && <Lock className="w-3 h-3 text-[#8D6E63]" />}
            </button>

            <button
              onClick={() => handleTabClick('promos')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-xs transition-colors ${
                activeTab === 'promos'
                  ? 'bg-[#3E2723] text-white font-bold shadow-sm'
                  : 'text-[#5D4037] hover:bg-[#EFEBE9]'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              Promo Kod
              {!isAdminLoggedIn && <Lock className="w-3 h-3 text-[#8D6E63]" />}
            </button>

            <button
              onClick={() => handleTabClick('daily-report')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-xs transition-colors ${
                activeTab === 'daily-report'
                  ? 'bg-[#3E2723] text-white font-bold shadow-sm'
                  : 'bg-[#EFEBE9] text-[#3E2723] hover:bg-[#E8E2D9] border border-[#E8E2D9]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Laporan Keuntungan
              {!isAdminLoggedIn && <Lock className="w-3 h-3 text-[#8D6E63]" />}
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};

