import React, { useState } from 'react';
import { PromoCode } from '../types';
import { Tag, Plus, CheckCircle, Trash2, Power, Users, Gift, Sparkles } from 'lucide-react';

interface PromoCodeManagerViewProps {
  promoCodes: PromoCode[];
  onAddPromoCode: (newPromo: PromoCode) => void;
  onTogglePromoCode: (id: string) => void;
  onDeletePromoCode: (id: string) => void;
}

export const PromoCodeManagerView: React.FC<PromoCodeManagerViewProps> = ({
  promoCodes,
  onAddPromoCode,
  onTogglePromoCode,
  onDeletePromoCode,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<string>('10');
  const [minSpend, setMinSpend] = useState<string>('15');
  const [description, setDescription] = useState('');
  const [forRepeated, setForRepeated] = useState(true);

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !discountValue || isNaN(Number(discountValue))) return;

    const newPromo: PromoCode = {
      id: 'promo-' + Date.now(),
      code: code.trim().toUpperCase(),
      discountType,
      discountValue: parseFloat(discountValue),
      minSpend: parseFloat(minSpend) || 0,
      description: description.trim() || 'Diskaun khas untuk pelanggan Imanies Coffee',
      active: true,
      usedCount: 0,
      forRepeatedCustomersOnly: forRepeated,
    };

    onAddPromoCode(newPromo);
    setCode('');
    setDiscountValue('10');
    setMinSpend('15');
    setDescription('');
    setShowAddModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-[#3E2723] text-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#5D4037] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-[#5D4037] text-amber-200 text-xs font-semibold px-3 py-1 rounded-full border border-[#8D6E63]/40 uppercase tracking-wider">
            <Gift className="w-3.5 h-3.5 text-amber-300" /> Program Kesetiaan & Diskaun
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Pengurusan Promo Kod Pelanggan Setia (Repeated Customer)
          </h1>
          <p className="text-[#E8E2D9] text-xs sm:text-sm max-w-xl opacity-90">
            Cipta dan berikan kupon diskaun istimewa kepada pelanggan tetap Imanies Coffee untuk menggalakkan pembelian berulang!
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#5D4037] hover:bg-[#8D6E63] text-white font-bold px-5 py-3 rounded-xl shadow-sm transition-all flex items-center gap-2 text-sm shrink-0 border border-[#8D6E63]/40"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" /> Cipta Kod Promo Baru
        </button>
      </div>

      {/* Promo Codes List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promoCodes.map((promo) => (
          <div
            key={promo.id}
            className={`bg-white rounded-2xl p-6 border transition-all shadow-sm flex flex-col justify-between space-y-4 ${
              promo.active
                ? 'border-[#E8E2D9] hover:border-[#5D4037]'
                : 'border-[#E8E2D9] bg-[#FAF9F6] opacity-60'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-lg text-[#3E2723] bg-[#EFEBE9] border border-[#E8E2D9] px-3.5 py-1 rounded-xl">
                  {promo.code}
                </span>

                <button
                  type="button"
                  onClick={() => onTogglePromoCode(promo.id)}
                  className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-colors ${
                    promo.active
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      : 'bg-[#EFEBE9] text-[#5D4037] hover:bg-[#E8E2D9]'
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                  {promo.active ? 'Aktif' : 'Nyahaktif'}
                </button>
              </div>

              <div className="space-y-1">
                <span className="text-xl font-bold text-[#3E2723] block">
                  {promo.discountType === 'percentage'
                    ? `Diskaun ${promo.discountValue}%`
                    : `Potongan RM ${promo.discountValue.toFixed(2)}`}
                </span>

                <p className="text-xs text-[#8D6E63]">
                  {promo.description}
                </p>
              </div>

              <div className="bg-[#FDFBF7] p-3 rounded-xl border border-[#F3EFEA] text-xs space-y-1 text-[#2D241E]">
                <div className="flex justify-between">
                  <span>Belian Minima:</span>
                  <span className="font-bold text-[#2D241E]">RM {promo.minSpend.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Kategori Sasaran:</span>
                  <span className="font-bold text-[#3E2723]">
                    {promo.forRepeatedCustomersOnly ? '👥 Pelanggan Setia (Repeated)' : '🌐 Semua Pelanggan'}
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-[#E8E2D9]">
                  <span>Jumlah Tebusan Diguna:</span>
                  <span className="font-bold text-emerald-700">{promo.usedCount} Kali</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end pt-2 border-t border-[#F3EFEA]">
              <button
                type="button"
                onClick={() => onDeletePromoCode(promo.id)}
                className="text-red-600 hover:text-red-800 text-xs font-bold flex items-center gap-1 px-2 py-1 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Padam Kod
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add New Promo Code */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#2D241E]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#E8E2D9] space-y-5">
            <div className="flex justify-between items-center border-b border-[#F3EFEA] pb-3">
              <h3 className="font-bold text-lg text-[#2D241E]">
                Cipta Promo Kod Baharu
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#8D6E63] hover:text-[#2D241E] text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePromo} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#2D241E] mb-1">
                  Kod Promo (Cth: REPEAT15) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="REPEAT15"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 text-xs font-mono font-bold uppercase border border-[#E8E2D9] rounded-xl focus:ring-2 focus:ring-[#5D4037] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#2D241E] mb-1">
                    Jenis Diskaun
                  </label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-[#E8E2D9] rounded-xl bg-white focus:ring-2 focus:ring-[#5D4037]"
                  >
                    <option value="percentage">Peratusan (%)</option>
                    <option value="fixed">Jumlah Tetap (RM)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2D241E] mb-1">
                    Nilai Diskaun ({discountType === 'percentage' ? '%' : 'RM'}) *
                  </label>
                  <input
                    type="number"
                    required
                    step="0.10"
                    placeholder="10"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-bold border border-[#E8E2D9] rounded-xl focus:ring-2 focus:ring-[#5D4037]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D241E] mb-1">
                  Belian Minima (RM)
                </label>
                <input
                  type="number"
                  step="1.00"
                  placeholder="15.00"
                  value={minSpend}
                  onChange={(e) => setMinSpend(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-bold border border-[#E8E2D9] rounded-xl focus:ring-2 focus:ring-[#5D4037]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D241E] mb-1">
                  Penerangan / Catatan
                </label>
                <input
                  type="text"
                  placeholder="Diskaun 10% untuk pelanggan repeated..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#E8E2D9] rounded-xl focus:ring-2 focus:ring-[#5D4037]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="repeatedCheck"
                  checked={forRepeated}
                  onChange={(e) => setForRepeated(e.target.checked)}
                  className="w-4 h-4 text-[#5D4037] rounded border-[#E8E2D9]"
                />
                <label htmlFor="repeatedCheck" className="text-xs font-bold text-[#2D241E]">
                  Khas untuk Pelanggan Setia (Repeated Customers)
                </label>
              </div>

              <div className="pt-3 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-[#8D6E63] hover:bg-[#EFEBE9] rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-[#3E2723] hover:bg-[#5D4037] text-white font-bold px-5 py-2 text-xs rounded-xl shadow-sm"
                >
                  Simpan Kod Promo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
