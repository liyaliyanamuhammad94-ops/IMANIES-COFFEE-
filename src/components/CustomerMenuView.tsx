import React, { useState } from 'react';
import { Beverage, DrinkCategory, ToppingOption, CartItem } from '../types';
import { Coffee, Sparkles, Plus, Check, Info, Flame } from 'lucide-react';

interface CustomerMenuViewProps {
  beverages: Beverage[];
  toppings: ToppingOption[];
  onAddToCart: (item: Omit<CartItem, 'id'>) => void;
  onOpenCart: () => void;
}

export const CustomerMenuView: React.FC<CustomerMenuViewProps> = ({
  beverages,
  toppings,
  onAddToCart,
  onOpenCart,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<DrinkCategory | 'semua'>('semua');
  const [selectedBev, setSelectedBev] = useState<Beverage | null>(null);

  // Customization state for modal
  const [selectedSize, setSelectedSize] = useState<'Regular' | 'Large'>('Regular');
  const [sweetness, setSweetness] = useState<string>('Standard (100%)');
  const [temp, setTemp] = useState<'Ais / Cold' | 'Panas / Hot'>('Ais / Cold');
  const [selectedToppings, setSelectedToppings] = useState<ToppingOption[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [notes, setNotes] = useState<string>('');

  const filteredBeverages = selectedCategory === 'semua' 
    ? beverages 
    : beverages.filter(b => b.category === selectedCategory);

  const openCustomizeModal = (bev: Beverage) => {
    setSelectedBev(bev);
    setSelectedSize('Regular');
    setSweetness('Standard (100%)');
    setTemp('Ais / Cold');
    setSelectedToppings([]);
    setQuantity(1);
    setNotes('');
  };

  const toggleTopping = (topping: ToppingOption) => {
    if (selectedToppings.some(t => t.id === topping.id)) {
      setSelectedToppings(selectedToppings.filter(t => t.id !== topping.id));
    } else {
      setSelectedToppings([...selectedToppings, topping]);
    }
  };

  // Calculate live item price
  const calculateItemPrice = () => {
    if (!selectedBev) return 0;
    let price = selectedBev.sellingPrice;
    if (selectedSize === 'Large') price += 1.50;
    selectedToppings.forEach(t => {
      price += t.price;
    });
    return price * quantity;
  };

  // Calculate item COGS cost
  const calculateItemCost = () => {
    if (!selectedBev) return 0;
    const baseCogs = selectedBev.costComponents.reduce((sum, c) => sum + c.cost, 0);
    let sizeCost = selectedSize === 'Large' ? 0.40 : 0; // extra cup & milk
    let toppingCost = selectedToppings.reduce((sum, t) => sum + t.cost, 0);
    return (baseCogs + sizeCost + toppingCost) * quantity;
  };

  const handleConfirmAddToCart = () => {
    if (!selectedBev) return;

    const unitPrice = calculateItemPrice() / quantity;
    const unitCost = calculateItemCost() / quantity;

    onAddToCart({
      beverageId: selectedBev.id,
      beverageName: selectedBev.name,
      image: selectedBev.image,
      size: selectedSize,
      sweetness,
      temp,
      toppings: selectedToppings.map(t => ({ name: t.name, price: t.price, cost: t.cost })),
      quantity,
      unitPrice,
      unitCost,
      itemTotalPrice: calculateItemPrice(),
      itemTotalCost: calculateItemCost(),
      notes: notes.trim() ? notes.trim() : undefined,
    });

    setSelectedBev(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Hero Banner for Imanies Coffee */}
      <div className="relative rounded-2xl overflow-hidden bg-[#3E2723] text-white p-6 sm:p-8 shadow-sm border border-[#5D4037]">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none text-9xl">
          ☕
        </div>
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 bg-[#5D4037] text-amber-200 text-xs font-semibold px-3 py-1 rounded-full border border-[#8D6E63]/40 uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 text-amber-300" />
            Menu Utama 8 Jenis Air Khas Imanies Coffee
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
            Kopi Fresh, Halus & Nikmat Luar Biasa.
          </h1>
          <p className="text-[#E8E2D9] text-xs sm:text-sm leading-relaxed opacity-90">
            Pilih dari 8 variasi minuman kegemaran ramai! Nikmati harga berpatutan dengan rasa kopi asli premium. Gunakan <span className="text-amber-300 font-bold underline underline-offset-2">Promo Kod</span> untuk diskaun tambahan!
          </p>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-[#E8E2D9]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedCategory('semua')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === 'semua'
                ? 'bg-[#3E2723] text-white shadow-sm'
                : 'bg-[#FDFBF7] text-[#5D4037] border border-[#E8E2D9] hover:bg-[#EFEBE9]'
            }`}
          >
            ☕ Semua 8 Jenis Air ({beverages.length})
          </button>
          <button
            onClick={() => setSelectedCategory('kopi')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === 'kopi'
                ? 'bg-[#3E2723] text-white shadow-sm'
                : 'bg-[#FDFBF7] text-[#5D4037] border border-[#E8E2D9] hover:bg-[#EFEBE9]'
            }`}
          >
            Kopi Signature
          </button>
          <button
            onClick={() => setSelectedCategory('bukan_kopi')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === 'bukan_kopi'
                ? 'bg-[#3E2723] text-white shadow-sm'
                : 'bg-[#FDFBF7] text-[#5D4037] border border-[#E8E2D9] hover:bg-[#EFEBE9]'
            }`}
          >
            Bukan Kopi & Chocolate
          </button>
          <button
            onClick={() => setSelectedCategory('teh_buah')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === 'teh_buah'
                ? 'bg-[#3E2723] text-white shadow-sm'
                : 'bg-[#FDFBF7] text-[#5D4037] border border-[#E8E2D9] hover:bg-[#EFEBE9]'
            }`}
          >
            Teh & Fruit Breeze
          </button>
        </div>

        <span className="text-xs text-[#8D6E63] hidden md:block">
          Tekan kad air untuk memilih saiz & topping
        </span>
      </div>

      {/* Beverage Grid (8 Drinks) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredBeverages.map((bev) => {
          const cogs = bev.costComponents.reduce((sum, c) => sum + c.cost, 0);
          const profit = bev.sellingPrice - cogs;
          const margin = ((profit / bev.sellingPrice) * 100).toFixed(0);

          return (
            <div
              key={bev.id}
              onClick={() => openCustomizeModal(bev)}
              className="group bg-white rounded-2xl border border-[#E8E2D9] shadow-sm hover:shadow-md hover:border-[#8D6E63] transition-all duration-200 overflow-hidden cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Image Container */}
                <div className="relative h-44 w-full overflow-hidden bg-[#FAF9F6]">
                  <img
                    src={bev.image}
                    alt={bev.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Badge */}
                  {bev.badge && (
                    <span className="absolute top-2.5 left-2.5 bg-[#3E2723] text-amber-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                      {bev.badge}
                    </span>
                  )}

                  {/* Price Tag */}
                  <div className="absolute bottom-2.5 right-2.5 bg-[#3E2723] text-white font-bold text-xs px-2.5 py-1 rounded-lg shadow-sm">
                    RM {bev.sellingPrice.toFixed(2)}
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className="font-bold text-base text-[#3E2723] group-hover:text-[#5D4037] transition-colors leading-tight">
                      {bev.name}
                    </h3>
                  </div>

                  <p className="text-xs text-[#8D6E63] line-clamp-2 leading-relaxed">
                    {bev.description}
                  </p>

                  {/* COGS & Cost transparency bar */}
                  <div className="pt-2 flex items-center justify-between text-[11px] text-[#8D6E63] border-t border-[#F3EFEA]">
                    <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold">
                      Kos Bahan: RM {cogs.toFixed(2)}
                    </span>
                    <span className="text-[#5D4037] font-bold">
                      Untung: RM {profit.toFixed(2)} ({margin}%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-4 pt-0">
                <button
                  type="button"
                  className="w-full bg-[#3E2723] hover:bg-[#5D4037] text-white font-bold py-2 px-4 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-300" />
                  Pilih & Beli
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Drink Customization Modal */}
      {selectedBev && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-amber-100 my-8 animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header Image */}
            <div className="relative h-44 bg-[#3E2723]">
              <img
                src={selectedBev.image}
                alt={selectedBev.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-85"
              />
              <button
                onClick={() => setSelectedBev(null)}
                className="absolute top-3 right-3 bg-black/60 hover:bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold"
              >
                ✕
              </button>
              <div className="absolute bottom-3 left-4 right-4 text-white drop-shadow-md">
                <span className="bg-[#5D4037] text-white font-semibold text-[10px] px-2.5 py-0.5 rounded-md uppercase tracking-wide border border-white/20">
                  {selectedBev.category.replace('_', ' ')}
                </span>
                <h2 className="text-xl font-bold">{selectedBev.name}</h2>
              </div>
            </div>

            {/* Modal Content Form */}
            <div className="p-5 sm:p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              <p className="text-xs text-[#8D6E63] italic">
                {selectedBev.description}
              </p>

              {/* Temperature Choice */}
              <div>
                <label className="block text-xs font-bold text-[#3E2723] uppercase tracking-wider mb-2">
                  Suhu Minuman
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Ais / Cold', 'Panas / Hot'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTemp(t)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                        temp === t
                          ? 'bg-[#3E2723] text-white border-[#3E2723] shadow-sm'
                          : 'bg-[#FAF9F6] text-[#2D241E] border-[#E8E2D9] hover:bg-[#EFEBE9]'
                      }`}
                    >
                      {t === 'Ais / Cold' ? '🧊 Ais / Sejuk (Cold)' : '☕ Panas (Hot)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Choice */}
              <div>
                <label className="block text-xs font-bold text-[#3E2723] uppercase tracking-wider mb-2">
                  Saiz Cawan
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedSize('Regular')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border text-left flex justify-between items-center transition-all ${
                      selectedSize === 'Regular'
                        ? 'bg-[#3E2723] text-white border-[#3E2723] shadow-sm'
                        : 'bg-[#FAF9F6] text-[#2D241E] border-[#E8E2D9] hover:bg-[#EFEBE9]'
                    }`}
                  >
                    <span>Regular (Standard)</span>
                    <span className={selectedSize === 'Regular' ? 'text-amber-300' : 'text-[#8D6E63]'}>RM 0.00</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedSize('Large')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border text-left flex justify-between items-center transition-all ${
                      selectedSize === 'Large'
                        ? 'bg-[#3E2723] text-white border-[#3E2723] shadow-sm'
                        : 'bg-[#FAF9F6] text-[#2D241E] border-[#E8E2D9] hover:bg-[#EFEBE9]'
                    }`}
                  >
                    <span>Large (Besar)</span>
                    <span className={selectedSize === 'Large' ? 'text-amber-300' : 'text-[#8D6E63]'}>+RM 1.50</span>
                  </button>
                </div>
              </div>

              {/* Sweetness Choice */}
              <div>
                <label className="block text-xs font-bold text-[#3E2723] uppercase tracking-wider mb-2">
                  Tahap Manis (Sweetness)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Kurang Manis (50%)', 'Standard (100%)', 'Lebih Manis (120%)'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSweetness(s)}
                      className={`py-2 px-2 rounded-xl text-[11px] font-bold border text-center transition-all ${
                        sweetness === s
                          ? 'bg-[#3E2723] text-white border-[#3E2723] shadow-sm'
                          : 'bg-[#FAF9F6] text-[#2D241E] border-[#E8E2D9] hover:bg-[#EFEBE9]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toppings Choice */}
              <div>
                <label className="block text-xs font-bold text-[#3E2723] uppercase tracking-wider mb-2">
                  Tambah Topping (Pilihan)
                </label>
                <div className="space-y-1.5">
                  {toppings.map((top) => {
                    const isSelected = selectedToppings.some(t => t.id === top.id);
                    return (
                      <button
                        key={top.id}
                        type="button"
                        onClick={() => toggleTopping(top)}
                        className={`w-full py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-[#EFEBE9] border-[#5D4037] text-[#3E2723]'
                            : 'bg-white border-[#E8E2D9] text-[#2D241E] hover:bg-[#FAF9F6]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded border flex items-center justify-center ${isSelected ? 'bg-[#5D4037] border-[#5D4037] text-white' : 'border-[#E8E2D9]'}`}>
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span>{top.name}</span>
                        </div>
                        <span className="text-[#5D4037] font-bold">+RM {top.price.toFixed(2)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-[#3E2723] uppercase tracking-wider mb-1">
                  Catatan Khas (Pilihan)
                </label>
                <input
                  type="text"
                  placeholder="Cth: Ais sikit sahaja, ekstra penyedut minuman..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#E8E2D9] rounded-xl focus:ring-2 focus:ring-[#5D4037] focus:outline-none"
                />
              </div>

              {/* Quantity Counter */}
              <div className="flex items-center justify-between pt-2 border-t border-[#F3EFEA]">
                <span className="text-xs font-bold text-[#3E2723]">Kuantiti</span>
                <div className="flex items-center gap-3 bg-[#FAF9F6] p-1 rounded-xl border border-[#E8E2D9]">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg bg-white font-black text-[#3E2723] shadow-sm flex items-center justify-center hover:bg-[#EFEBE9]"
                  >
                    -
                  </button>
                  <span className="font-extrabold text-sm px-2 text-[#3E2723]">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-lg bg-white font-black text-[#3E2723] shadow-sm flex items-center justify-center hover:bg-[#EFEBE9]"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer with Price Summary & Add Button */}
            <div className="p-4 bg-[#FAF9F6] border-t border-[#E8E2D9] flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-[#8D6E63] font-bold uppercase tracking-wider block">Jumlah Harga</span>
                <span className="text-xl font-bold text-[#3E2723]">
                  RM {calculateItemPrice().toFixed(2)}
                </span>
              </div>

              <button
                type="button"
                onClick={handleConfirmAddToCart}
                className="flex-1 bg-[#3E2723] hover:bg-[#5D4037] text-white font-bold py-3 px-5 rounded-xl transition-all shadow-md text-sm flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5 stroke-[3]" />
                Tambah ke Troli
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
