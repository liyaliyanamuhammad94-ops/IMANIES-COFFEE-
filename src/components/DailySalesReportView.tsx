import React, { useState } from 'react';
import { Order, OperationalExpense, Beverage } from '../types';
import { FileText, TrendingUp, DollarSign, Calendar, Sparkles, Plus, Trash2, Printer, Share2, Coffee, CheckCircle, AlertCircle } from 'lucide-react';

interface DailySalesReportViewProps {
  orders: Order[];
  operationalExpenses: OperationalExpense[];
  beverages: Beverage[];
  onAddOperationalExpense: (newExpense: OperationalExpense) => void;
  onDeleteOperationalExpense: (id: string) => void;
}

export const DailySalesReportView: React.FC<DailySalesReportViewProps> = ({
  orders,
  operationalExpenses,
  beverages,
  onAddOperationalExpense,
  onDeleteOperationalExpense,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  
  // Daily Expense Modal State
  const [showExpModal, setShowExpModal] = useState(false);
  const [expTitle, setExpTitle] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expCat, setExpCat] = useState<'Ais Kristal' | 'Barang Operasi' | 'Sewa Tapak' | 'Staf / Kebajikan' | 'Lain-lain'>('Ais Kristal');

  // AI Report state
  const [aiReportText, setAiReportText] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Filter orders for selected date (or all orders if today)
  const dateOrders = orders.filter((o) => {
    const oDate = new Date(o.createdAt).toISOString().split('T')[0];
    return oDate === selectedDate;
  });

  const dateExpenses = operationalExpenses.filter(e => e.date === selectedDate);

  // Financial Calculations
  const totalSales = dateOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalSubtotal = dateOrders.reduce((sum, o) => sum + o.subtotal, 0);
  const totalPromoDiscounts = dateOrders.reduce((sum, o) => sum + o.discount, 0);
  const totalCOGS = dateOrders.reduce((sum, o) => sum + o.totalCost, 0);
  const totalOpExpenses = dateExpenses.reduce((sum, e) => sum + e.amount, 0);
  
  const netProfit = totalSales - totalCOGS - totalOpExpenses;
  const profitMargin = totalSales > 0 ? (netProfit / totalSales) * 100 : 0;

  const totalCupsSold = dateOrders.reduce(
    (sum, o) => sum + o.items.reduce((a, b) => a + b.quantity, 0),
    0
  );

  // Beverage Sales Breakdown
  const bevStatsMap: { [key: string]: { name: string; cups: number; revenue: number; cost: number } } = {};
  dateOrders.forEach(o => {
    o.items.forEach(item => {
      if (!bevStatsMap[item.beverageId]) {
        bevStatsMap[item.beverageId] = {
          name: item.beverageName,
          cups: 0,
          revenue: 0,
          cost: 0,
        };
      }
      bevStatsMap[item.beverageId].cups += item.quantity;
      bevStatsMap[item.beverageId].revenue += item.itemTotalPrice;
      bevStatsMap[item.beverageId].cost += item.itemTotalCost;
    });
  });

  const bevStatsArray = Object.values(bevStatsMap).sort((a, b) => b.cups - a.cups);
  const topSellingDrink = bevStatsArray.length > 0 ? bevStatsArray[0].name : 'Tiada jualan lagi';

  // Handle Add Operational Expense
  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expTitle.trim() || !expAmount || isNaN(Number(expAmount))) return;

    const newExp: OperationalExpense = {
      id: 'exp-' + Date.now(),
      date: selectedDate,
      title: expTitle.trim(),
      amount: parseFloat(expAmount),
      category: expCat,
    };

    onAddOperationalExpense(newExp);
    setExpTitle('');
    setExpAmount('');
    setShowExpModal(false);
  };

  // Generate AI Daily Summary via Gemini Backend API
  const handleGenerateAiReport = async () => {
    setIsAiLoading(true);
    setAiError(null);

    try {
      const res = await fetch('/api/generate-ai-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDate,
          totalSales,
          totalExpenses: totalCOGS + totalOpExpenses,
          netProfit,
          profitMargin,
          totalCups: totalCupsSold,
          topSelling: topSellingDrink,
          ordersSummary: bevStatsArray,
        }),
      });

      const data = await res.json();
      if (data.success && data.report) {
        setAiReportText(data.report);
      } else {
        setAiError(data.error || 'Gagal menjana laporan AI.');
      }
    } catch (err: any) {
      setAiError('Ralat sambungan ke pelayan AI.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCopyWhatsAppSummary = () => {
    const text = `*LAPORAN HARIAN IMANIES COFFEE (${selectedDate})* ☕📊\n\n` +
      `💰 *Jumlah Jualan Kasar:* RM ${totalSales.toFixed(2)}\n` +
      `📦 *Kos Bahan (COGS):* RM ${totalCOGS.toFixed(2)}\n` +
      `🛠️ *Perbelanjaan Operasi:* RM ${totalOpExpenses.toFixed(2)}\n` +
      `🎁 *Diskaun Promo:* RM ${totalPromoDiscounts.toFixed(2)}\n` +
      `---------------------------------\n` +
      `📈 *KEUNTUNGAN BERSIH:* RM ${netProfit.toFixed(2)} (${profitMargin.toFixed(1)}%)\n` +
      `🥤 *Jumlah Terjual:* ${totalCupsSold} Cawan\n` +
      `🔥 *Minuman Laris:* ${topSellingDrink}\n\n` +
      `Disediakan secara automatik oleh Sistem Pengurusan Imanies Coffee.`;

    navigator.clipboard.writeText(text);
    alert('Ringkasan laporan telah disalin! Boleh tampal di WhatsApp.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-[#3E2723] text-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#5D4037] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-[#5D4037] text-amber-200 text-xs font-semibold px-3 py-1 rounded-full border border-[#8D6E63]/40 uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5 text-amber-300" /> Penjana Laporan Automatik
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Laporan Keuntungan & Penjualan Harian
          </h1>
          <p className="text-[#E8E2D9] text-xs sm:text-sm max-w-xl opacity-90">
            Aplikasi mengira pendapatan, perbelanjaan bahan, promo dan keuntungan bersih secara automatik untuk melihat prestasi perniagaan Imanies Coffee.
          </p>
        </div>

        {/* Date Selector & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-[#5D4037] p-2 rounded-xl border border-[#8D6E63]/60 text-xs">
            <label className="block text-[10px] text-amber-200 font-bold uppercase mb-1">Pilih Tarikh:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-[#3E2723] text-white font-bold px-3 py-1.5 rounded-lg border border-[#8D6E63] focus:outline-none"
            />
          </div>

          <button
            onClick={handleCopyWhatsAppSummary}
            className="bg-[#5D4037] hover:bg-[#8D6E63] text-white font-bold px-4 py-3 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all border border-[#8D6E63]/40"
          >
            <Share2 className="w-4 h-4" /> Salin ke WhatsApp
          </button>
        </div>
      </div>

      {/* KPI Key Financial Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Card 1: Sales */}
        <div className="bg-white rounded-2xl p-5 border border-[#E8E2D9] shadow-sm space-y-1">
          <span className="text-xs text-[#8D6E63] font-bold uppercase tracking-wider block">
            Jumlah Jualan Kasar
          </span>
          <span className="text-2xl sm:text-3xl font-bold text-[#2D241E] block">
            RM {totalSales.toFixed(2)}
          </span>
          <span className="text-[11px] text-[#8D6E63] block">
            {dateOrders.length} Pesanan Diterima
          </span>
        </div>

        {/* Card 2: Total COGS Expenses */}
        <div className="bg-white rounded-2xl p-5 border border-[#E8E2D9] shadow-sm space-y-1">
          <span className="text-xs text-[#8D6E63] font-bold uppercase tracking-wider block">
            Kos Bahan & Operasi
          </span>
          <span className="text-2xl sm:text-3xl font-bold text-red-700 block">
            RM {(totalCOGS + totalOpExpenses).toFixed(2)}
          </span>
          <span className="text-[11px] text-[#8D6E63] block">
            Bahan: RM{totalCOGS.toFixed(2)} • Operasi: RM{totalOpExpenses.toFixed(2)}
          </span>
        </div>

        {/* Card 3: Net Profit */}
        <div className="bg-[#3E2723] text-white rounded-2xl p-5 border border-[#5D4037] shadow-sm space-y-1">
          <span className="text-xs text-amber-200 font-bold uppercase tracking-wider block">
            Keuntungan Bersih (Profit)
          </span>
          <span className="text-2xl sm:text-3xl font-bold text-emerald-400 block">
            RM {netProfit.toFixed(2)}
          </span>
          <span className="text-[11px] text-[#E8E2D9] font-bold block">
            Margin: {profitMargin.toFixed(1)}%
          </span>
        </div>

        {/* Card 4: Volume */}
        <div className="bg-white rounded-2xl p-5 border border-[#E8E2D9] shadow-sm space-y-1">
          <span className="text-xs text-[#8D6E63] font-bold uppercase tracking-wider block">
            Jumlah Cawan Terjual
          </span>
          <span className="text-2xl sm:text-3xl font-bold text-[#3E2723] block">
            {totalCupsSold} Cawan
          </span>
          <span className="text-[11px] text-[#5D4037] font-semibold block truncate">
            🔥 Laris: {topSellingDrink}
          </span>
        </div>
      </div>

      {/* AI Daily Executive Report Generator Box */}
      <div className="bg-[#3E2723] text-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#5D4037] space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-300 animate-spin" />
              <h3 className="font-bold text-lg text-amber-100">
                Laporan & Analisis Perniagaan AI Gemini
              </h3>
            </div>
            <p className="text-xs text-[#E8E2D9]">
              Jana analisis prestasi perniagaan harian secara automatik dengan cadangan penambahbaikan.
            </p>
          </div>

          <button
            onClick={handleGenerateAiReport}
            disabled={isAiLoading}
            className="bg-[#5D4037] hover:bg-[#8D6E63] text-white font-bold px-5 py-3 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all disabled:opacity-50 border border-[#8D6E63]/40"
          >
            {isAiLoading ? (
              <>Sedang Menjana Analisis AI...</>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Jana Laporan Eksekutif AI
              </>
            )}
          </button>
        </div>

        {aiError && (
          <div className="p-3 bg-red-900/60 border border-red-700 text-red-200 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{aiError}</span>
          </div>
        )}

        {aiReportText && (
          <div className="bg-[#5D4037]/80 p-5 rounded-xl border border-[#8D6E63]/60 text-xs text-[#FAF9F6] whitespace-pre-wrap font-sans leading-relaxed shadow-inner">
            {aiReportText}
          </div>
        )}
      </div>

      {/* Beverage Sales Volume Breakdown & Operational Expense Tracker Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Drink Sales Breakdown */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-[#E8E2D9] shadow-sm space-y-4">
          <h3 className="font-bold text-lg text-[#2D241E] flex items-center gap-2">
            <Coffee className="w-5 h-5 text-[#5D4037]" /> Pecahan Penjualan Air Mengikut Jenis
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#2D241E]">
              <thead className="bg-[#FDFBF7] text-[#3E2723] font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3 rounded-l-xl">Jenis Minuman</th>
                  <th className="p-3">Kuantiti Terjual</th>
                  <th className="p-3">Jumlah Jualan (RM)</th>
                  <th className="p-3">Kos Bahan (RM)</th>
                  <th className="p-3 rounded-r-xl">Untung Bersih</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3EFEA] font-medium">
                {bevStatsArray.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-[#8D6E63]">
                      Tiada data jualan minuman bagi tarikh ini.
                    </td>
                  </tr>
                ) : (
                  bevStatsArray.map((st, i) => {
                    const profit = st.revenue - st.cost;
                    return (
                      <tr key={i} className="hover:bg-[#FAF9F6]">
                        <td className="p-3 font-bold text-[#2D241E]">{st.name}</td>
                        <td className="p-3 font-mono font-bold text-[#3E2723]">{st.cups} Cawan</td>
                        <td className="p-3 font-mono">RM {st.revenue.toFixed(2)}</td>
                        <td className="p-3 font-mono text-red-700">RM {st.cost.toFixed(2)}</td>
                        <td className="p-3 font-mono font-bold text-emerald-700">
                          RM {profit.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Operational Expenses Tracker */}
        <div className="bg-white rounded-2xl p-6 border border-[#E8E2D9] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-[#2D241E]">
              Perbelanjaan Operasi Harian
            </h3>
            <button
              onClick={() => setShowExpModal(true)}
              className="bg-[#3E2723] text-white font-bold text-xs px-3 py-1.5 rounded-xl hover:bg-[#5D4037] flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah
            </button>
          </div>

          <p className="text-xs text-[#8D6E63]">
            Catatkan kos luar jangka seperti Ais Kristal, plastik, penyedut, atau elaun makan staf.
          </p>

          <div className="space-y-2">
            {dateExpenses.length === 0 ? (
              <div className="p-6 bg-[#FAF9F6] rounded-xl text-center text-xs text-[#8D6E63]">
                Tiada perbelanjaan tambahan dicatat.
              </div>
            ) : (
              dateExpenses.map((exp) => (
                <div
                  key={exp.id}
                  className="flex items-center justify-between p-3 bg-[#FAF9F6] rounded-xl border border-[#E8E2D9] text-xs"
                >
                  <div>
                    <span className="font-bold text-[#2D241E] block">{exp.title}</span>
                    <span className="text-[10px] text-[#8D6E63] bg-white px-2 py-0.5 rounded border border-[#E8E2D9]">
                      {exp.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-bold text-red-700 font-mono">
                      RM {exp.amount.toFixed(2)}
                    </span>
                    <button
                      onClick={() => onDeleteOperationalExpense(exp.id)}
                      className="text-[#8D6E63] hover:text-red-600 text-xs transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal Add Expense */}
      {showExpModal && (
        <div className="fixed inset-0 z-50 bg-[#2D241E]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-[#E8E2D9] space-y-4">
            <div className="flex justify-between items-center border-b border-[#F3EFEA] pb-2">
              <h3 className="font-bold text-base text-[#2D241E]">Tambah Perbelanjaan Operasi</h3>
              <button onClick={() => setShowExpModal(false)} className="text-[#8D6E63] hover:text-[#2D241E] font-bold">✕</button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#2D241E] mb-1">Perkara Perbelanjaan *</label>
                <input
                  type="text"
                  required
                  placeholder="Cth: Ais Kristal 2 Beg Besar"
                  value={expTitle}
                  onChange={(e) => setExpTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#E8E2D9] rounded-xl focus:ring-2 focus:ring-[#5D4037]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D241E] mb-1">Jumlah Kos (RM) *</label>
                <input
                  type="number"
                  required
                  step="0.10"
                  placeholder="12.00"
                  value={expAmount}
                  onChange={(e) => setExpAmount(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-bold border border-[#E8E2D9] rounded-xl focus:ring-2 focus:ring-[#5D4037]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D241E] mb-1">Kategori</label>
                <select
                  value={expCat}
                  onChange={(e) => setExpCat(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-[#E8E2D9] rounded-xl bg-white focus:ring-2 focus:ring-[#5D4037]"
                >
                  <option value="Ais Kristal">Ais Kristal</option>
                  <option value="Barang Operasi">Barang Operasi (Plastik/Straw)</option>
                  <option value="Sewa Tapak">Sewa Tapak</option>
                  <option value="Staf / Kebajikan">Staf / Kebajikan</option>
                  <option value="Lain-lain">Lain-lain</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowExpModal(false)}
                  className="px-3 py-2 text-xs font-bold text-[#8D6E63] hover:bg-[#EFEBE9] rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-[#3E2723] text-white font-bold px-4 py-2 text-xs rounded-xl shadow-sm hover:bg-[#5D4037]"
                >
                  Simpan Perbelanjaan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
