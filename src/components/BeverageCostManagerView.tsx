import React, { useState } from 'react';
import { Beverage, CostComponent } from '../types';
import { Receipt, Edit3, Plus, Trash2, Check, DollarSign, TrendingUp, Sparkles, PieChart, Info } from 'lucide-react';

interface BeverageCostManagerViewProps {
  beverages: Beverage[];
  onUpdateBeverage: (updatedBeverage: Beverage) => void;
  onAddBeverage: (newBeverage: Beverage) => void;
}

export const BeverageCostManagerView: React.FC<BeverageCostManagerViewProps> = ({
  beverages,
  onUpdateBeverage,
  onAddBeverage,
}) => {
  const [editingBevId, setEditingBevId] = useState<string | null>(null);
  
  // Edit Form state
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editComponents, setEditComponents] = useState<CostComponent[]>([]);
  const [newCompName, setNewCompName] = useState<string>('');
  const [newCompCost, setNewCompCost] = useState<string>('');

  const handleStartEdit = (bev: Beverage) => {
    setEditingBevId(bev.id);
    setEditPrice(bev.sellingPrice);
    setEditComponents([...bev.costComponents]);
    setNewCompName('');
    setNewCompCost('');
  };

  const handleAddComponent = () => {
    if (!newCompName.trim() || !newCompCost || isNaN(Number(newCompCost))) return;
    
    const newComp: CostComponent = {
      id: 'comp-' + Date.now(),
      name: newCompName.trim(),
      cost: parseFloat(newCompCost),
    };

    setEditComponents([...editComponents, newComp]);
    setNewCompName('');
    setNewCompCost('');
  };

  const handleRemoveComponent = (compOptId: string) => {
    setEditComponents(editComponents.filter(c => c.id !== compOptId));
  };

  const handleSaveEdit = (bev: Beverage) => {
    const updated: Beverage = {
      ...bev,
      sellingPrice: editPrice,
      costComponents: editComponents,
    };

    onUpdateBeverage(updated);
    setEditingBevId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-[#3E2723] text-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#5D4037] space-y-3">
        <div className="inline-flex items-center gap-2 bg-[#5D4037] text-amber-200 text-xs font-semibold px-3 py-1 rounded-full border border-[#8D6E63]/40 uppercase tracking-wider">
          <Receipt className="w-3.5 h-3.5 text-amber-300" /> Senarai Kos & Keuntungan Per Cawan
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold">
          Pengurusan Perbelanjaan & Kos Setiap Minuman (COGS)
        </h1>
        <p className="text-[#E8E2D9] text-xs sm:text-sm max-w-3xl leading-relaxed opacity-90">
          Semak pecahan perbelanjaan bahan bagi setiap satu produk air Imanies Coffee. Kemaskini kos biji kopi, susu, cawan, ais & sirap untuk mengetahui marjin keuntungan bersih per cawan secara telus dan tepat.
        </p>
      </div>

      {/* Beverage Costs Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {beverages.map((bev) => {
          const totalCogs = bev.costComponents.reduce((sum, c) => sum + c.cost, 0);
          const netProfit = bev.sellingPrice - totalCogs;
          const profitMargin = ((netProfit / bev.sellingPrice) * 100).toFixed(1);

          const isEditing = editingBevId === bev.id;

          return (
            <div
              key={bev.id}
              className="bg-white rounded-2xl p-6 border border-[#E8E2D9] shadow-sm hover:shadow transition-all space-y-5"
            >
              {/* Card Title & Overview Header */}
              <div className="flex items-start justify-between gap-4 border-b border-[#F3EFEA] pb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={bev.image}
                    alt={bev.name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-xl object-cover border border-[#E8E2D9] shadow-sm shrink-0"
                  />
                  <div>
                    <h3 className="font-bold text-lg text-[#2D241E] leading-tight">
                      {bev.name}
                    </h3>
                    <span className="text-xs text-[#8D6E63] capitalize">
                      Kategori: {bev.category.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {!isEditing ? (
                  <button
                    onClick={() => handleStartEdit(bev)}
                    className="bg-[#EFEBE9] hover:bg-[#E8E2D9] text-[#3E2723] font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Kemaskini Kos
                  </button>
                ) : (
                  <button
                    onClick={() => handleSaveEdit(bev)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" /> Simpan
                  </button>
                )}
              </div>

              {/* Financial KPI Summary Bar */}
              <div className="grid grid-cols-3 gap-2 bg-[#FDFBF7] p-3 rounded-xl border border-[#F3EFEA] text-center">
                <div>
                  <span className="text-[10px] font-bold text-[#8D6E63] uppercase block">Harga Jualan</span>
                  <span className="font-bold text-[#2D241E] text-sm sm:text-base">
                    RM {bev.sellingPrice.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#8D6E63] uppercase block">Jumlah Kos (COGS)</span>
                  <span className="font-bold text-red-700 text-sm sm:text-base">
                    RM {totalCogs.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#8D6E63] uppercase block">Untung Bersih / Cawan</span>
                  <span className="font-bold text-emerald-700 text-sm sm:text-base">
                    RM {netProfit.toFixed(2)} ({profitMargin}%)
                  </span>
                </div>
              </div>

              {/* Cost Components Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-bold text-[#3E2723]">
                  <span>Pecahan Kos Bahan Terlibat ({bev.costComponents.length} Komponen):</span>
                  <span className="text-[11px] text-[#8D6E63]">Per cawan</span>
                </div>

                {!isEditing ? (
                  /* Display View */
                  <div className="space-y-1.5">
                    {bev.costComponents.map((comp) => {
                      const compPercent = ((comp.cost / totalCogs) * 100).toFixed(0);
                      return (
                        <div
                          key={comp.id}
                          className="flex items-center justify-between text-xs bg-[#FAF9F6] px-3 py-2 rounded-xl border border-[#E8E2D9]"
                        >
                          <span className="font-semibold text-[#2D241E]">{comp.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-[#8D6E63] bg-white px-2 py-0.5 rounded border border-[#E8E2D9] font-mono">
                              {compPercent}%
                            </span>
                            <span className="font-bold text-[#3E2723] font-mono">
                              RM {comp.cost.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* Edit View Form */
                  <div className="space-y-3 bg-[#FAF9F6] p-4 rounded-xl border border-[#E8E2D9]">
                    
                    {/* Edit Selling Price */}
                    <div>
                      <label className="block text-xs font-bold text-[#2D241E] mb-1">
                        Harga Jualan baharu (RM):
                      </label>
                      <input
                        type="number"
                        step="0.10"
                        value={editPrice}
                        onChange={(e) => setEditPrice(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 text-xs font-bold border border-[#E8E2D9] rounded-xl bg-white focus:ring-2 focus:ring-[#5D4037] focus:outline-none"
                      />
                    </div>

                    {/* Edit Cost Items */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-[#2D241E]">
                        Kemaskini Komponen Kos Bahan:
                      </label>

                      {editComponents.map((comp, idx) => (
                        <div key={comp.id} className="flex gap-2 items-center">
                          <input
                            type="text"
                            value={comp.name}
                            onChange={(e) => {
                              const updatedComps = [...editComponents];
                              updatedComps[idx].name = e.target.value;
                              setEditComponents(updatedComps);
                            }}
                            className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-[#E8E2D9] rounded-xl"
                          />
                          <input
                            type="number"
                            step="0.05"
                            value={comp.cost}
                            onChange={(e) => {
                              const updatedComps = [...editComponents];
                              updatedComps[idx].cost = parseFloat(e.target.value) || 0;
                              setEditComponents(updatedComps);
                            }}
                            className="w-24 px-2.5 py-1.5 text-xs bg-white border border-[#E8E2D9] rounded-xl font-mono font-bold"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveComponent(comp.id)}
                            className="text-red-600 hover:bg-red-50 p-1.5 rounded-lg text-xs font-bold"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}

                      {/* Add New Cost Component */}
                      <div className="pt-2 flex gap-2">
                        <input
                          type="text"
                          placeholder="Nama bahan baru (cth: Susu Khas)"
                          value={newCompName}
                          onChange={(e) => setNewCompName(e.target.value)}
                          className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-[#E8E2D9] rounded-xl"
                        />
                        <input
                          type="number"
                          step="0.05"
                          placeholder="Kos (RM)"
                          value={newCompCost}
                          onChange={(e) => setNewCompCost(e.target.value)}
                          className="w-24 px-2.5 py-1.5 text-xs bg-white border border-[#E8E2D9] rounded-xl font-mono"
                        />
                        <button
                          type="button"
                          onClick={handleAddComponent}
                          className="bg-[#3E2723] text-white font-bold px-3 py-1.5 text-xs rounded-xl hover:bg-[#5D4037]"
                        >
                          + Tambah
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
