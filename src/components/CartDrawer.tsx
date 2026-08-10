import React, { useState } from 'react';
import { CartItem, PromoCode, Order } from '../types';
import { ShoppingBag, Trash2, Tag, CheckCircle2, ArrowRight, QrCode, AlertCircle, Sparkles } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  promoCodes: PromoCode[];
  onPlaceOrder: (newOrder: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'timeFormatted'>) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  promoCodes,
  onPlaceOrder,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [tableOrPickup, setTableOrPickup] = useState('Bawa Pulang / Takeaway');
  const [paymentMethod, setPaymentMethod] = useState<'DuitNow QR' | 'Tunai / Cash' | 'Kad Debit/Kredit'>('DuitNow QR');
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoError, setPromoError] = useState('');

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.itemTotalPrice, 0);
  const totalCost = cartItems.reduce((sum, item) => sum + item.itemTotalCost, 0);

  // Calculate promo discount
  let discountAmount = 0;
  if (appliedPromo) {
    if (subtotal < appliedPromo.minSpend) {
      // Auto cancel promo if subtotal drops below min spend
      setAppliedPromo(null);
      setPromoError(`Pembelian minima RM${appliedPromo.minSpend.toFixed(2)} diperlukan untuk promo ini.`);
    } else {
      if (appliedPromo.discountType === 'percentage') {
        discountAmount = (subtotal * appliedPromo.discountValue) / 100;
      } else {
        discountAmount = appliedPromo.discountValue;
      }
      discountAmount = Math.min(discountAmount, subtotal); // cannot exceed subtotal
    }
  }

  const finalTotal = Math.max(0, subtotal - discountAmount);
  const netProfit = finalTotal - totalCost;

  const handleApplyPromo = (codeToApply?: string) => {
    const targetCode = (codeToApply || promoInput).trim().toUpperCase();
    setPromoError('');

    if (!targetCode) {
      setPromoError('Sila masukkan kod promo.');
      return;
    }

    const found = promoCodes.find(p => p.code.toUpperCase() === targetCode && p.active);
    if (!found) {
      setPromoError('Kod promo tidak sah atau telah tamat tempoh.');
      return;
    }

    if (subtotal < found.minSpend) {
      setPromoError(`Kod promo ${found.code} memerlukan belian minima RM${found.minSpend.toFixed(2)}.`);
      return;
    }

    setAppliedPromo(found);
    setPromoInput(found.code);
    setPromoError('');
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (cartItems.length === 0) return;

    if (!customerName.trim()) {
      alert('Sila masukkan nama anda.');
      return;
    }
    if (!customerPhone.trim()) {
      alert('Sila masukkan nombor telefon / WhatsApp untuk notifikasi air siap.');
      return;
    }

    onPlaceOrder({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      tableOrPickup,
      items: [...cartItems],
      subtotal,
      discount: discountAmount,
      promoCode: appliedPromo ? appliedPromo.code : undefined,
      totalAmount: finalTotal,
      totalCost,
      netProfit,
      status: 'BARU',
      paymentMethod,
    });

    // Reset local state
    setCustomerName('');
    setCustomerPhone('');
    setAppliedPromo(null);
    setPromoInput('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex justify-end">
      <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#3E2723] text-white flex items-center justify-between border-b border-[#5D4037]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-200" />
            <h2 className="font-bold text-base uppercase tracking-wider">Troli Pesanan Air</h2>
            <span className="text-xs bg-[#5D4037] text-amber-100 font-bold px-2.5 py-0.5 rounded-full border border-[#8D6E63]/40">
              {cartItems.reduce((acc, i) => acc + i.quantity, 0)} Cawan
            </span>
          </div>

          <button
            onClick={onClose}
            className="text-stone-300 hover:text-white p-1 rounded-lg text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* Cart Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
          
          {cartItems.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 bg-[#EFEBE9] text-[#5D4037] rounded-full flex items-center justify-center mx-auto text-3xl">
                ☕
              </div>
              <p className="font-bold text-[#3E2723]">Troli anda masih kosong</p>
              <p className="text-xs text-[#8D6E63]">Sila pilih dari 8 variasi minuman Imanies Coffee di menu.</p>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs text-[#8D6E63] font-bold uppercase tracking-wider">
                  <span>Senarai Minuman ({cartItems.length})</span>
                  <button
                    onClick={onClearCart}
                    className="text-red-600 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Kosongkan
                  </button>
                </div>

                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#FDFBF7] rounded-2xl p-3 border border-[#F3EFEA] flex gap-3 items-start relative"
                  >
                    <img
                      src={item.image}
                      alt={item.beverageName}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-xl object-cover border border-[#E8E2D9] shrink-0"
                    />

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-[#3E2723] text-sm truncate">
                          {item.beverageName}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-[#8D6E63] hover:text-red-600 text-xs font-bold p-0.5"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="text-[11px] text-[#5D4037] space-y-0.5">
                        <p>
                          <span className="font-bold text-[#3E2723]">{item.size}</span> • {item.temp} • {item.sweetness}
                        </p>
                        {item.toppings.length > 0 && (
                          <p className="text-[#8D6E63] font-semibold truncate">
                            + {item.toppings.map(t => t.name).join(', ')}
                          </p>
                        )}
                        {item.notes && (
                          <p className="text-[#8D6E63] italic">"{item.notes}"</p>
                        )}
                      </div>

                      <div className="flex justify-between items-center pt-1">
                        <span className="font-bold text-[#3E2723] text-sm">
                          RM {item.itemTotalPrice.toFixed(2)}
                        </span>

                        <div className="flex items-center gap-2 bg-white px-2 py-0.5 rounded-lg border border-[#E8E2D9] shadow-sm">
                          <button
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="font-bold text-[#3E2723] hover:text-[#5D4037] text-xs px-1"
                          >
                            -
                          </button>
                          <span className="font-bold text-xs text-[#3E2723]">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="font-bold text-[#3E2723] hover:text-[#5D4037] text-xs px-1"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code Section */}
              <div className="bg-[#F9F6F2] rounded-2xl p-3.5 border border-dashed border-[#8D6E63] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[#3E2723] font-bold text-xs">
                    <Tag className="w-4 h-4 text-[#5D4037]" />
                    <span>Promo Kod Pelanggan Setia (Repeated)</span>
                  </div>
                  {appliedPromo && (
                    <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Berjaya
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Masukkan kod (cth: REPEAT10)"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    className="flex-1 bg-white px-3 py-1.5 text-xs font-mono font-bold border border-[#E8E2D9] rounded-xl uppercase focus:ring-2 focus:ring-[#5D4037] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyPromo()}
                    className="bg-[#3E2723] text-white font-bold text-xs px-3 py-1.5 rounded-xl hover:bg-[#5D4037] transition-colors shadow-sm"
                  >
                    Guna Kod
                  </button>
                </div>

                {promoError && (
                  <p className="text-[11px] text-red-600 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {promoError}
                  </p>
                )}

                {/* Preset Repeated Customer Promo Suggestions */}
                <div className="pt-1">
                  <span className="text-[10px] text-[#8D6E63] font-bold block mb-1.5">
                    🎁 Tekan untuk tebus kod promo pilihan:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {promoCodes.filter(p => p.active).map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleApplyPromo(p.code)}
                        className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg border transition-all ${
                          appliedPromo?.id === p.id
                            ? 'bg-[#3E2723] text-white border-[#3E2723] shadow-sm'
                            : 'bg-white text-[#3E2723] border-[#E8E2D9] hover:bg-[#EFEBE9]'
                        }`}
                      >
                        {p.code} ({p.discountType === 'percentage' ? `${p.discountValue}%` : `RM${p.discountValue}`})
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Customer Info Form */}
              <form id="orderForm" onSubmit={handleSubmitOrder} className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-[#3E2723] uppercase tracking-wider">
                  Maklumat Pelanggan & Ambil Air
                </h4>

                <div>
                  <label className="block text-[11px] font-bold text-[#5D4037] mb-1">
                    Nama Pelanggan *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nama anda (cth: Ahmad / Siti)"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#E8E2D9] rounded-xl focus:ring-2 focus:ring-[#5D4037] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#5D4037] mb-1">
                    Nombor Telefon / WhatsApp (Untuk Notifikasi Air Siap) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="cth: 012-3456789"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#E8E2D9] rounded-xl focus:ring-2 focus:ring-[#5D4037] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#5D4037] mb-1">
                    Jenis Ambil Air / Lokasi
                  </label>
                  <select
                    value={tableOrPickup}
                    onChange={(e) => setTableOrPickup(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#E8E2D9] rounded-xl bg-white focus:ring-2 focus:ring-[#5D4037] focus:outline-none"
                  >
                    <option value="Bawa Pulang / Takeaway">Bawa Pulang / Takeaway (Bungkus)</option>
                    <option value="Drive-Thru / Dalam Kereta">Drive-Thru / Pandu Lalu</option>
                    <option value="Meja No. 1">Meja No. 1</option>
                    <option value="Meja No. 2">Meja No. 2</option>
                    <option value="Meja No. 3">Meja No. 3</option>
                    <option value="Meja No. 4">Meja No. 4</option>
                    <option value="Meja No. 5">Meja No. 5</option>
                  </select>
                </div>

                {/* Payment Option */}
                <div>
                  <label className="block text-[11px] font-bold text-[#5D4037] mb-1">
                    Kaedah Pembayaran
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['DuitNow QR', 'Tunai / Cash', 'Kad Debit/Kredit'] as const).map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={`py-2 px-1 rounded-xl text-[10px] font-bold border transition-all text-center ${
                          paymentMethod === method
                            ? 'bg-[#3E2723] text-white border-[#3E2723] shadow-sm'
                            : 'bg-[#FAF9F6] text-[#2D241E] border-[#E8E2D9] hover:bg-[#EFEBE9]'
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>

                  {/* QR Preview if DuitNow */}
                  {paymentMethod === 'DuitNow QR' && (
                    <div className="mt-2 p-3 bg-[#FDFBF7] border border-[#E8E2D9] rounded-2xl flex items-center gap-3">
                      <div className="w-12 h-12 bg-white rounded-xl border border-[#E8E2D9] p-1 flex items-center justify-center shrink-0">
                        <QrCode className="w-10 h-10 text-[#3E2723]" />
                      </div>
                      <div className="text-[11px] text-[#3E2723]">
                        <p className="font-bold">Imbas QR DuitNow Imanies Coffee</p>
                        <p className="text-[#8D6E63] text-[10px]">Bayar dengan Maybank2u, MAE, Touch 'n Go eWallet & semua bank.</p>
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </>
          )}
        </div>

        {/* Footer Pricing Summary & Submit */}
        {cartItems.length > 0 && (
          <div className="p-4 bg-[#FAF9F6] border-t border-[#E8E2D9] space-y-3">
            <div className="space-y-1 text-xs text-[#5D4037]">
              <div className="flex justify-between">
                <span>Jumlah Kecil (Subtotal)</span>
                <span className="font-bold">RM {subtotal.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Diskaun Promo ({appliedPromo?.code})</span>
                  <span>- RM {discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-base font-bold text-[#3E2723] pt-2 border-t border-[#E8E2D9]">
                <span>Jumlah Perlu Dibayar</span>
                <span className="text-[#3E2723]">RM {finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              form="orderForm"
              className="w-full bg-[#3E2723] hover:bg-[#5D4037] text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-md text-sm flex items-center justify-center gap-2"
            >
              Hantar Pesanan Air
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
