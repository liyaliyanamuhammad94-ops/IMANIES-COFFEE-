import React, { useState } from 'react';
import { Beverage, DrinkCategory, ToppingOption, CostComponent } from '../types';
import {
  PackageCheck,
  Plus,
  Search,
  Edit3,
  Trash2,
  CheckCircle,
  XCircle,
  Coffee,
  Sparkles,
  DollarSign,
  Layers,
  KeyRound,
  Check,
  AlertCircle,
  Image as ImageIcon,
} from 'lucide-react';

interface AdminCMSViewProps {
  beverages: Beverage[];
  toppings: ToppingOption[];
  onAddBeverage: (bev: Beverage) => void;
  onUpdateBeverage: (bev: Beverage) => void;
  onDeleteBeverage: (id: string) => void;
  onAddTopping: (topping: ToppingOption) => void;
  onUpdateTopping: (topping: ToppingOption) => void;
  onDeleteTopping: (id: string) => void;
  adminPin: string;
  onChangeAdminPin: (newPin: string) => void;
}

const PRESET_IMAGES = [
  { name: 'Kopi Espresso / Signature', url: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80' },
  { name: 'Caramel Macchiato', url: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=600&q=80' },
  { name: 'Hazelnut Latte', url: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80' },
  { name: 'Mocha Chocolate', url: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=600&q=80' },
  { name: 'Matcha Green Tea', url: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80' },
  { name: 'Special Chocolate', url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80' },
  { name: 'Teh Tarik Special', url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80' },
  { name: 'Fruit Breeze / Markisah', url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80' },
];

export const AdminCMSView: React.FC<AdminCMSViewProps> = ({
  beverages,
  toppings,
  onAddBeverage,
  onUpdateBeverage,
  onDeleteBeverage,
  onAddTopping,
  onUpdateTopping,
  onDeleteTopping,
  adminPin,
  onChangeAdminPin,
}) => {
  const [activeTab, setActiveTab] = useState<'beverages' | 'toppings' | 'settings'>('beverages');
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DrinkCategory | 'semua'>('semua');
  const [stockFilter, setStockFilter] = useState<'semua' | 'tersedia' | 'habis'>('semua');

  // Modal states for Beverages
  const [isBevModalOpen, setIsBevModalOpen] = useState(false);
  const [editingBev, setEditingBev] = useState<Beverage | null>(null);

  // Form states for Beverage Modal
  const [bevName, setBevName] = useState('');
  const [bevCategory, setBevCategory] = useState<DrinkCategory>('kopi');
  const [bevDescription, setBevDescription] = useState('');
  const [bevImage, setBevImage] = useState(PRESET_IMAGES[0].url);
  const [bevSellingPrice, setBevSellingPrice] = useState('8.00');
  const [bevBadge, setBevBadge] = useState('Paling Laris 🔥');
  const [bevPopularTag, setBevPopularTag] = useState(false);
  const [bevIsAvailable, setBevIsAvailable] = useState(true);
  const [bevCostComponents, setBevCostComponents] = useState<CostComponent[]>([
    { id: 'c1', name: 'Biji Kopi / Bahan Utama', cost: 1.20 },
    { id: 'c2', name: 'Susu / Krimer / Sirap', cost: 1.00 },
    { id: 'c3', name: 'Cawan, Penutup & Ais', cost: 0.40 },
  ]);

  // Modal states for Toppings
  const [isTopModalOpen, setIsTopModalOpen] = useState(false);
  const [editingTop, setEditingTop] = useState<ToppingOption | null>(null);
  const [topName, setTopName] = useState('');
  const [topPrice, setTopPrice] = useState('1.50');
  const [topCost, setTopCost] = useState('0.40');

  // Settings Pin state
  const [currentPinCheck, setCurrentPinCheck] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinFeedback, setPinFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Filtered Beverages
  const filteredBeverages = beverages.filter((b) => {
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'semua' || b.category === selectedCategory;
    const matchesStock = stockFilter === 'semua' ||
                         (stockFilter === 'tersedia' && b.isAvailable) ||
                         (stockFilter === 'habis' && !b.isAvailable);
    return matchesSearch && matchesCategory && matchesStock;
  });

  // Open modal to add new drink
  const handleOpenAddBev = () => {
    setEditingBev(null);
    setBevName('');
    setBevCategory('kopi');
    setBevDescription('');
    setBevImage(PRESET_IMAGES[0].url);
    setBevSellingPrice('8.00');
    setBevBadge('Produk Baru ✨');
    setBevPopularTag(false);
    setBevIsAvailable(true);
    setBevCostComponents([
      { id: 'c1', name: 'Biji Kopi / Bahan Utama', cost: 1.20 },
      { id: 'c2', name: 'Susu / Krimer / Sirap', cost: 1.00 },
      { id: 'c3', name: 'Cawan, Penutup & Ais', cost: 0.40 },
    ]);
    setIsBevModalOpen(true);
  };

  // Open modal to edit drink
  const handleOpenEditBev = (bev: Beverage) => {
    setEditingBev(bev);
    setBevName(bev.name);
    setBevCategory(bev.category);
    setBevDescription(bev.description);
    setBevImage(bev.image);
    setBevSellingPrice(bev.sellingPrice.toString());
    setBevBadge(bev.badge || '');
    setBevPopularTag(bev.popularTag || false);
    setBevIsAvailable(bev.isAvailable);
    setBevCostComponents(bev.costComponents || []);
    setIsBevModalOpen(true);
  };

  // Save Beverage (Add / Edit)
  const handleSaveBev = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bevName.trim() || !bevDescription.trim()) return;

    const priceNum = parseFloat(bevSellingPrice) || 0;

    if (editingBev) {
      const updated: Beverage = {
        ...editingBev,
        name: bevName.trim(),
        category: bevCategory,
        description: bevDescription.trim(),
        image: bevImage.trim() || PRESET_IMAGES[0].url,
        sellingPrice: priceNum,
        badge: bevBadge.trim() || undefined,
        popularTag: bevPopularTag,
        isAvailable: bevIsAvailable,
        costComponents: bevCostComponents,
      };
      onUpdateBeverage(updated);
    } else {
      const newBev: Beverage = {
        id: 'bev-' + Date.now(),
        name: bevName.trim(),
        category: bevCategory,
        description: bevDescription.trim(),
        image: bevImage.trim() || PRESET_IMAGES[0].url,
        sellingPrice: priceNum,
        badge: bevBadge.trim() || undefined,
        popularTag: bevPopularTag,
        isAvailable: bevIsAvailable,
        costComponents: bevCostComponents,
      };
      onAddBeverage(newBev);
    }

    setIsBevModalOpen(false);
  };

  // Quick 1-click toggle availability
  const handleToggleStockAvailability = (bev: Beverage) => {
    onUpdateBeverage({
      ...bev,
      isAvailable: !bev.isAvailable,
    });
  };

  // Delete Beverage Confirmation
  const handleDeleteBevConfirm = (id: string, name: string) => {
    if (window.confirm(`Adakah anda pasti untuk memadam item "${name}" dari CMS? Action ini tidak boleh diundurkan.`)) {
      onDeleteBeverage(id);
    }
  };

  // Open modal to add new Topping
  const handleOpenAddTop = () => {
    setEditingTop(null);
    setTopName('');
    setTopPrice('1.50');
    setTopCost('0.40');
    setIsTopModalOpen(true);
  };

  // Open modal to edit Topping
  const handleOpenEditTop = (top: ToppingOption) => {
    setEditingTop(top);
    setTopName(top.name);
    setTopPrice(top.price.toString());
    setTopCost(top.cost.toString());
    setIsTopModalOpen(true);
  };

  // Save Topping
  const handleSaveTop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topName.trim()) return;

    const p = parseFloat(topPrice) || 0;
    const c = parseFloat(topCost) || 0;

    if (editingTop) {
      onUpdateTopping({
        ...editingTop,
        name: topName.trim(),
        price: p,
        cost: c,
      });
    } else {
      onAddTopping({
        id: 'top-' + Date.now(),
        name: topName.trim(),
        price: p,
        cost: c,
      });
    }

    setIsTopModalOpen(false);
  };

  // Delete Topping Confirmation
  const handleDeleteTopConfirm = (id: string, name: string) => {
    if (window.confirm(`Sahkan pemadaman topping "${name}"?`)) {
      onDeleteTopping(id);
    }
  };

  // Cost components helper inside Modal
  const handleAddCostComponent = () => {
    setBevCostComponents([
      ...bevCostComponents,
      { id: 'c-' + Date.now(), name: 'Bahan Baru', cost: 0.50 },
    ]);
  };

  const handleUpdateCostComp = (id: string, field: 'name' | 'cost', value: any) => {
    setBevCostComponents((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleDeleteCostComp = (id: string) => {
    setBevCostComponents((prev) => prev.filter((item) => item.id !== id));
  };

  // Handle PIN Update
  const handleSaveNewPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPinCheck !== adminPin) {
      setPinFeedback({ type: 'error', text: 'PIN Semasa yang dimasukkan salah!' });
      return;
    }
    if (newPin.length < 4) {
      setPinFeedback({ type: 'error', text: 'PIN baharu mestilah sekurang-kurangnya 4 aksara!' });
      return;
    }
    if (newPin !== confirmPin) {
      setPinFeedback({ type: 'error', text: 'Pengesahan PIN baharu tidak sepadan!' });
      return;
    }

    onChangeAdminPin(newPin);
    setPinFeedback({ type: 'success', text: 'PIN Pentadbir berjaya dikemaskini!' });
    setCurrentPinCheck('');
    setNewPin('');
    setConfirmPin('');
  };

  const activeBeveragesCount = beverages.filter((b) => b.isAvailable).length;
  const outOfStockCount = beverages.filter((b) => !b.isAvailable).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-[#3E2723] text-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#5D4037] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-[#5D4037] text-amber-200 text-xs font-semibold px-3 py-1 rounded-full border border-[#8D6E63]/40 uppercase tracking-wider">
            <PackageCheck className="w-3.5 h-3.5 text-amber-300" />
            Portal Pengurusan CMS (Admin Only)
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Content Management System (CMS) Barang Jualan
          </h1>
          <p className="text-[#E8E2D9] text-xs sm:text-sm max-w-xl opacity-90">
            Kemaskini item menu air, harga jualan, gambaran, status stok & add-ons topping secara langsung di sini.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleOpenAddBev}
            className="bg-[#5D4037] hover:bg-[#8D6E63] text-white font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all text-xs flex items-center gap-2 border border-[#8D6E63]/40"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            Tambah Air Baru
          </button>

          <button
            onClick={handleOpenAddTop}
            className="bg-[#EFEBE9] hover:bg-[#E8E2D9] text-[#3E2723] font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all text-xs flex items-center gap-2"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            Tambah Topping
          </button>
        </div>
      </div>

      {/* KPI Stats Overview Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-white rounded-2xl p-4 border border-[#E8E2D9] shadow-sm space-y-1">
          <span className="text-[11px] text-[#8D6E63] font-bold uppercase tracking-wider block">Total Drinks in CMS</span>
          <span className="text-2xl font-bold text-[#3E2723] block">{beverages.length} Jenis</span>
          <span className="text-[11px] text-[#8D6E63]">Menu Aktif Kedai</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#E8E2D9] shadow-sm space-y-1">
          <span className="text-[11px] text-[#8D6E63] font-bold uppercase tracking-wider block">Status Tersedia (In Stock)</span>
          <span className="text-2xl font-bold text-emerald-700 block">{activeBeveragesCount} Jenis</span>
          <span className="text-[11px] text-emerald-800 font-semibold">Siap Untuk Dipesan</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#E8E2D9] shadow-sm space-y-1">
          <span className="text-[11px] text-[#8D6E63] font-bold uppercase tracking-wider block">Kehabisan Stok (Out of Stock)</span>
          <span className="text-2xl font-bold text-red-600 block">{outOfStockCount} Jenis</span>
          <span className="text-[11px] text-red-700 font-semibold">Ditutup Pada Menu</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#E8E2D9] shadow-sm space-y-1">
          <span className="text-[11px] text-[#8D6E63] font-bold uppercase tracking-wider block">Jumlah Add-ons / Topping</span>
          <span className="text-2xl font-bold text-[#3E2723] block">{toppings.length} Pilihan</span>
          <span className="text-[11px] text-[#8D6E63]">Boba, Shot, Cream, Drizzle</span>
        </div>
      </div>

      {/* CMS Navigation Sub-Tabs */}
      <div className="flex items-center justify-between border-b border-[#E8E2D9] pb-3 gap-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 min-w-max">
          <button
            onClick={() => setActiveTab('beverages')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'beverages'
                ? 'bg-[#3E2723] text-white shadow-sm'
                : 'bg-[#FDFBF7] text-[#5D4037] border border-[#E8E2D9] hover:bg-[#EFEBE9]'
            }`}
          >
            <Coffee className="w-4 h-4" />
            Senarai Air Minuman ({beverages.length})
          </button>

          <button
            onClick={() => setActiveTab('toppings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'toppings'
                ? 'bg-[#3E2723] text-white shadow-sm'
                : 'bg-[#FDFBF7] text-[#5D4037] border border-[#E8E2D9] hover:bg-[#EFEBE9]'
            }`}
          >
            <Layers className="w-4 h-4" />
            Topping & Extra Add-ons ({toppings.length})
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'settings'
                ? 'bg-[#3E2723] text-white shadow-sm'
                : 'bg-[#FDFBF7] text-[#5D4037] border border-[#E8E2D9] hover:bg-[#EFEBE9]'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            Tetapan PIN Admin
          </button>
        </div>
      </div>

      {/* TAB 1: BEVERAGES CMS */}
      {activeTab === 'beverages' && (
        <div className="space-y-6">
          
          {/* Controls: Search, Category Filter, Stock Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E8E2D9]">
            
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#8D6E63] absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Cari nama air / penerangan di CMS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 text-xs border border-[#E8E2D9] rounded-xl bg-[#FAF9F6] focus:ring-2 focus:ring-[#5D4037] focus:outline-none"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="px-3 py-2 text-xs border border-[#E8E2D9] rounded-xl bg-white font-semibold text-[#3E2723] focus:ring-2 focus:ring-[#5D4037]"
            >
              <option value="semua">Semua Kategori</option>
              <option value="kopi">Kopi Signature</option>
              <option value="bukan_kopi">Bukan Kopi / Chocolate</option>
              <option value="teh_buah">Teh & Fruit Breeze</option>
            </select>

            {/* Stock Filter */}
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value as any)}
              className="px-3 py-2 text-xs border border-[#E8E2D9] rounded-xl bg-white font-semibold text-[#3E2723] focus:ring-2 focus:ring-[#5D4037]"
            >
              <option value="semua">Semua Status Stok</option>
              <option value="tersedia">Tersedia (In Stock)</option>
              <option value="habis">Kehabisan Stok (Out of Stock)</option>
            </select>
          </div>

          {/* Beverages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredBeverages.length === 0 ? (
              <div className="col-span-full bg-white rounded-2xl p-12 text-center border border-[#E8E2D9] space-y-2">
                <Coffee className="w-12 h-12 text-[#8D6E63] mx-auto" />
                <p className="font-bold text-[#3E2723]">Tiada item minuman ditemui.</p>
                <p className="text-xs text-[#8D6E63]">Cuba ubah carian atau padanan penapis anda.</p>
              </div>
            ) : (
              filteredBeverages.map((bev) => {
                const totalCogs = bev.costComponents.reduce((sum, c) => sum + c.cost, 0);
                const profit = bev.sellingPrice - totalCogs;
                const marginPercent = ((profit / bev.sellingPrice) * 100).toFixed(0);

                return (
                  <div
                    key={bev.id}
                    className={`bg-white rounded-2xl border shadow-sm transition-all overflow-hidden flex flex-col justify-between ${
                      bev.isAvailable ? 'border-[#E8E2D9]' : 'border-red-200 bg-red-50/10'
                    }`}
                  >
                    <div>
                      {/* Image Preview & Badge */}
                      <div className="relative h-44 w-full bg-[#FAF9F6] overflow-hidden">
                        <img
                          src={bev.image}
                          alt={bev.name}
                          referrerPolicy="no-referrer"
                          className={`w-full h-full object-cover ${!bev.isAvailable ? 'grayscale opacity-60' : ''}`}
                        />

                        {bev.badge && (
                          <span className="absolute top-2.5 left-2.5 bg-[#3E2723] text-amber-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                            {bev.badge}
                          </span>
                        )}

                        <div className="absolute top-2.5 right-2.5">
                          <button
                            type="button"
                            onClick={() => handleToggleStockAvailability(bev)}
                            className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm transition-all flex items-center gap-1 ${
                              bev.isAvailable
                                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                : 'bg-red-600 text-white hover:bg-red-700'
                            }`}
                          >
                            {bev.isAvailable ? (
                              <>
                                <CheckCircle className="w-3.5 h-3.5" /> Tersedia
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3.5 h-3.5" /> Out of Stock
                              </>
                            )}
                          </button>
                        </div>

                        <div className="absolute bottom-2.5 right-2.5 bg-[#3E2723] text-white font-bold text-xs px-2.5 py-1 rounded-lg shadow-sm">
                          RM {bev.sellingPrice.toFixed(2)}
                        </div>
                      </div>

                      {/* Drink Description & Category */}
                      <div className="p-4 space-y-3">
                        <div>
                          <span className="text-[10px] bg-[#EFEBE9] text-[#5D4037] font-bold uppercase px-2 py-0.5 rounded border border-[#E8E2D9]">
                            {bev.category.replace('_', ' ')}
                          </span>
                          <h3 className="font-bold text-base text-[#2D241E] mt-1">
                            {bev.name}
                          </h3>
                          <p className="text-xs text-[#8D6E63] mt-1 line-clamp-2">
                            {bev.description}
                          </p>
                        </div>

                        {/* COGS & Margin Metrics */}
                        <div className="bg-[#FAF9F6] p-2.5 rounded-xl border border-[#E8E2D9] grid grid-cols-2 gap-2 text-center text-xs">
                          <div>
                            <span className="text-[10px] text-[#8D6E63] font-bold uppercase block">Kos COGS</span>
                            <span className="font-bold text-red-700">RM {totalCogs.toFixed(2)}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-[#8D6E63] font-bold uppercase block">Untung Bersih</span>
                            <span className="font-bold text-emerald-700">RM {profit.toFixed(2)} ({marginPercent}%)</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Actions: Edit & Delete */}
                    <div className="p-4 pt-0 border-t border-[#F3EFEA] mt-2 flex items-center justify-between gap-2 pt-3">
                      <button
                        type="button"
                        onClick={() => handleOpenEditBev(bev)}
                        className="flex-1 bg-[#EFEBE9] hover:bg-[#E8E2D9] text-[#3E2723] font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Sunting Item
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteBevConfirm(bev.id, bev.name)}
                        className="bg-red-50 hover:bg-red-100 text-red-600 font-bold p-2 rounded-xl text-xs transition-colors"
                        title="Padam dari CMS"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 2: TOPPINGS CMS */}
      {activeTab === 'toppings' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-[#E8E2D9] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-[#2D241E]">
                  Pengurusan Topping & Extra Add-ons
                </h3>
                <p className="text-xs text-[#8D6E63]">
                  Urus harga jualan dan kos bahan topping tambahan untuk minuman pelanggan.
                </p>
              </div>

              <button
                onClick={handleOpenAddTop}
                className="bg-[#3E2723] hover:bg-[#5D4037] text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Plus className="w-4 h-4" /> Tambah Topping
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#2D241E]">
                <thead className="bg-[#FDFBF7] text-[#3E2723] font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3.5 rounded-l-xl">Nama Topping / Add-on</th>
                    <th className="p-3.5">Harga Jualan (RM)</th>
                    <th className="p-3.5">Kos Bahan (RM)</th>
                    <th className="p-3.5">Untung Bersih (RM)</th>
                    <th className="p-3.5 rounded-r-xl text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3EFEA] font-medium">
                  {toppings.map((top) => {
                    const profit = top.price - top.cost;
                    return (
                      <tr key={top.id} className="hover:bg-[#FAF9F6]">
                        <td className="p-3.5 font-bold text-[#2D241E]">{top.name}</td>
                        <td className="p-3.5 font-bold text-[#3E2723]">RM {top.price.toFixed(2)}</td>
                        <td className="p-3.5 text-red-700">RM {top.cost.toFixed(2)}</td>
                        <td className="p-3.5 text-emerald-700 font-bold">RM {profit.toFixed(2)}</td>
                        <td className="p-3.5 text-right space-x-2">
                          <button
                            onClick={() => handleOpenEditTop(top)}
                            className="text-[#5D4037] hover:bg-[#EFEBE9] px-2.5 py-1 rounded-lg font-bold"
                          >
                            Sunting
                          </button>
                          <button
                            onClick={() => handleDeleteTopConfirm(top.id, top.name)}
                            className="text-red-600 hover:bg-red-50 px-2.5 py-1 rounded-lg font-bold"
                          >
                            Padam
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ADMIN PIN SETTINGS */}
      {activeTab === 'settings' && (
        <div className="max-w-xl mx-auto bg-white rounded-2xl p-6 sm:p-8 border border-[#E8E2D9] shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-[#2D241E] flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-[#5D4037]" />
              Tetapan PIN Keselamatan Pentadbir (Admin PIN)
            </h3>
            <p className="text-xs text-[#8D6E63]">
              Kemaskini PIN laluan keselamatan untuk mengunci portal pengurusan CMS dan laporan kedai.
            </p>
          </div>

          <form onSubmit={handleSaveNewPin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#2D241E] mb-1">
                Masukkan PIN Semasa *
              </label>
              <input
                type="password"
                required
                maxLength={8}
                value={currentPinCheck}
                onChange={(e) => setCurrentPinCheck(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono font-bold border border-[#E8E2D9] rounded-xl focus:ring-2 focus:ring-[#5D4037]"
                placeholder="****"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2D241E] mb-1">
                PIN Baharu (Sekurang-kurangnya 4 Digit) *
              </label>
              <input
                type="password"
                required
                maxLength={8}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono font-bold border border-[#E8E2D9] rounded-xl focus:ring-2 focus:ring-[#5D4037]"
                placeholder="****"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2D241E] mb-1">
                Sahkan PIN Baharu *
              </label>
              <input
                type="password"
                required
                maxLength={8}
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono font-bold border border-[#E8E2D9] rounded-xl focus:ring-2 focus:ring-[#5D4037]"
                placeholder="****"
              />
            </div>

            {pinFeedback && (
              <div
                className={`text-xs p-3 rounded-xl border flex items-center gap-2 font-bold ${
                  pinFeedback.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-red-50 text-red-700 border-red-200'
                }`}
              >
                {pinFeedback.type === 'success' ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600" />
                )}
                <span>{pinFeedback.text}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#3E2723] hover:bg-[#5D4037] text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all shadow-sm"
            >
              Simpan & Kemaskini PIN Admin
            </button>
          </form>
        </div>
      )}

      {/* BEVERAGE MODAL (ADD / EDIT) */}
      {isBevModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#2D241E]/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-[#E8E2D9] space-y-5 my-8">
            <div className="flex justify-between items-center border-b border-[#F3EFEA] pb-3">
              <h3 className="font-bold text-lg text-[#2D241E]">
                {editingBev ? 'Sunting Item Air di CMS' : 'Tambah Air Minuman Baharu ke CMS'}
              </h3>
              <button
                onClick={() => setIsBevModalOpen(false)}
                className="text-[#8D6E63] hover:text-[#2D241E] font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveBev} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#2D241E] mb-1">Nama Item Minuman *</label>
                  <input
                    type="text"
                    required
                    placeholder="Cth: Spanish Cream Latte"
                    value={bevName}
                    onChange={(e) => setBevName(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E8E2D9] rounded-xl focus:ring-2 focus:ring-[#5D4037]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#2D241E] mb-1">Kategori *</label>
                  <select
                    value={bevCategory}
                    onChange={(e) => setBevCategory(e.target.value as DrinkCategory)}
                    className="w-full px-3 py-2 border border-[#E8E2D9] rounded-xl bg-white focus:ring-2 focus:ring-[#5D4037]"
                  >
                    <option value="kopi">Kopi Signature</option>
                    <option value="bukan_kopi">Bukan Kopi / Chocolate</option>
                    <option value="teh_buah">Teh & Fruit Breeze</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#2D241E] mb-1">Penerangan / Resipi Ringkas *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Keterangan minuman yang menarik minat pelanggan..."
                  value={bevDescription}
                  onChange={(e) => setBevDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E8E2D9] rounded-xl focus:ring-2 focus:ring-[#5D4037]"
                />
              </div>

              {/* Image URL & Presets */}
              <div className="space-y-2">
                <label className="block font-bold text-[#2D241E]">URL Gambar Item *</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    required
                    placeholder="https://..."
                    value={bevImage}
                    onChange={(e) => setBevImage(e.target.value)}
                    className="flex-1 px-3 py-2 border border-[#E8E2D9] rounded-xl focus:ring-2 focus:ring-[#5D4037]"
                  />
                  <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#E8E2D9] shrink-0 bg-[#FAF9F6]">
                    <img src={bevImage} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                </div>

                <p className="text-[11px] text-[#8D6E63] font-semibold">Pilih Gambar Sampel Bersesuaian:</p>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_IMAGES.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setBevImage(img.url)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                        bevImage === img.url
                          ? 'bg-[#3E2723] text-white border-[#3E2723]'
                          : 'bg-[#FAF9F6] text-[#5D4037] border-[#E8E2D9] hover:bg-[#EFEBE9]'
                      }`}
                    >
                      {img.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#2D241E] mb-1">Harga Jualan Pelanggan (RM) *</label>
                  <input
                    type="number"
                    step="0.10"
                    required
                    value={bevSellingPrice}
                    onChange={(e) => setBevSellingPrice(e.target.value)}
                    className="w-full px-3 py-2 font-bold border border-[#E8E2D9] rounded-xl focus:ring-2 focus:ring-[#5D4037]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#2D241E] mb-1">Lencana / Badge Pill</label>
                  <input
                    type="text"
                    placeholder="Cth: Paling Laris 🔥"
                    value={bevBadge}
                    onChange={(e) => setBevBadge(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E8E2D9] rounded-xl focus:ring-2 focus:ring-[#5D4037]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-[#2D241E]">
                  <input
                    type="checkbox"
                    checked={bevIsAvailable}
                    onChange={(e) => setBevIsAvailable(e.target.checked)}
                    className="w-4 h-4 text-[#5D4037] rounded border-[#E8E2D9]"
                  />
                  <span>Status Stok: Tersedia (In Stock)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-[#2D241E]">
                  <input
                    type="checkbox"
                    checked={bevPopularTag}
                    onChange={(e) => setBevPopularTag(e.target.checked)}
                    className="w-4 h-4 text-[#5D4037] rounded border-[#E8E2D9]"
                  />
                  <span>Tanda Pilihan Ramai ⭐</span>
                </label>
              </div>

              {/* COGS Breakdown Editor inside Modal */}
              <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#E8E2D9] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#3E2723]">Pecahan Kos Bahan (COGS Breakdown)</span>
                  <button
                    type="button"
                    onClick={handleAddCostComponent}
                    className="bg-[#EFEBE9] hover:bg-[#E8E2D9] text-[#3E2723] font-bold px-2.5 py-1 rounded-lg text-[11px]"
                  >
                    + Tambah Bahan
                  </button>
                </div>

                <div className="space-y-2">
                  {bevCostComponents.map((comp) => (
                    <div key={comp.id} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={comp.name}
                        onChange={(e) => handleUpdateCostComp(comp.id, 'name', e.target.value)}
                        className="flex-1 px-2.5 py-1 text-xs border border-[#E8E2D9] rounded-lg bg-white"
                        placeholder="Nama bahan"
                      />
                      <input
                        type="number"
                        step="0.05"
                        value={comp.cost}
                        onChange={(e) => handleUpdateCostComp(comp.id, 'cost', parseFloat(e.target.value) || 0)}
                        className="w-24 px-2.5 py-1 text-xs border border-[#E8E2D9] rounded-lg bg-white font-mono font-bold"
                        placeholder="Kos (RM)"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteCostComp(comp.id)}
                        className="text-red-600 hover:bg-red-50 p-1 rounded-lg font-bold"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-[#E8E2D9] flex justify-between items-center font-bold text-[#3E2723]">
                  <span>Jumlah Kos Bahan Per Cawan:</span>
                  <span className="text-red-700 font-mono">
                    RM {bevCostComponents.reduce((sum, c) => sum + c.cost, 0).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBevModalOpen(false)}
                  className="px-4 py-2 font-bold text-[#8D6E63] hover:bg-[#EFEBE9] rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-[#3E2723] hover:bg-[#5D4037] text-white font-bold px-5 py-2 rounded-xl shadow-sm"
                >
                  Simpan ke CMS
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* TOPPING MODAL (ADD / EDIT) */}
      {isTopModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#2D241E]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-[#E8E2D9] space-y-4">
            <div className="flex justify-between items-center border-b border-[#F3EFEA] pb-2">
              <h3 className="font-bold text-base text-[#2D241E]">
                {editingTop ? 'Sunting Topping' : 'Tambah Topping Baharu'}
              </h3>
              <button onClick={() => setIsTopModalOpen(false)} className="text-[#8D6E63] font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveTop} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#2D241E] mb-1">Nama Topping *</label>
                <input
                  type="text"
                  required
                  placeholder="Cth: Boba Tapioka"
                  value={topName}
                  onChange={(e) => setTopName(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E8E2D9] rounded-xl focus:ring-2 focus:ring-[#5D4037]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#2D241E] mb-1">Harga Jualan Pelanggan (RM) *</label>
                <input
                  type="number"
                  step="0.10"
                  required
                  value={topPrice}
                  onChange={(e) => setTopPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E8E2D9] rounded-xl focus:ring-2 focus:ring-[#5D4037] font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-[#2D241E] mb-1">Kos Bahan Mentah (RM) *</label>
                <input
                  type="number"
                  step="0.05"
                  required
                  value={topCost}
                  onChange={(e) => setTopCost(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E8E2D9] rounded-xl focus:ring-2 focus:ring-[#5D4037] font-bold text-red-700"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTopModalOpen(false)}
                  className="px-3 py-2 font-bold text-[#8D6E63] hover:bg-[#EFEBE9] rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-[#3E2723] hover:bg-[#5D4037] text-white font-bold px-4 py-2 rounded-xl shadow-sm"
                >
                  Simpan Topping
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
