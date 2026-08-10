import React, { useState } from 'react';
import { Order, OrderStatus } from '../types';
import { Coffee, Bell, CheckCircle2, MessageSquare, Clock, Search, AlertCircle, Phone, ArrowRight } from 'lucide-react';
import { playReadyBell } from '../utils/audio';

interface SellerOrderManagementViewProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
}

export const SellerOrderManagementView: React.FC<SellerOrderManagementViewProps> = ({
  orders,
  onUpdateOrderStatus,
}) => {
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'SEMUA'>('SEMUA');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = filterStatus === 'SEMUA' || o.status === filterStatus;
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerPhone.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  const handleSetReady = (order: Order) => {
    onUpdateOrderStatus(order.id, 'AIR_SIAP');
    playReadyBell();
  };

  const handleSendWhatsAppNotice = (order: Order) => {
    const cleanPhone = order.customerPhone.replace(/[^0-9]/g, '');
    const phoneWithCountry = cleanPhone.startsWith('0') ? `6${cleanPhone}` : cleanPhone;
    
    const itemsSummary = order.items.map(i => `${i.quantity}x ${i.beverageName} (${i.size})`).join(', ');
    const msg = `Salam *${order.customerName}*! ☕\n\nMinuman Imanies Coffee anda (*${order.orderNumber}*) *TELAH SIAP!* 🎉\n\n- Pesanan: ${itemsSummary}\n- Lokasi: ${order.tableOrPickup}\n\nSila ambil di kaunter sekarang. Terima kasih!`;

    const waUrl = `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-[#3E2723] text-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#5D4037] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs bg-[#5D4037] text-amber-200 font-semibold px-3 py-1 rounded-full border border-[#8D6E63]/40 uppercase tracking-wider">
            Mod Peniaga / Barista
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold mt-2">
            Pengurusan Pesanan & Notifikasi Air Siap
          </h1>
          <p className="text-[#E8E2D9] text-xs sm:text-sm mt-1 opacity-90">
            Urus aliran pesanan pelanggan dari bancuhan hingga sedia untuk diambil.
          </p>
        </div>

        {/* Quick Stats Pills */}
        <div className="flex gap-2 text-xs">
          <div className="bg-[#5D4037] px-3.5 py-2 rounded-xl border border-[#8D6E63]/50 text-center">
            <span className="text-amber-200 block text-[10px] uppercase font-bold">Baru</span>
            <span className="text-lg font-bold text-white">
              {orders.filter(o => o.status === 'BARU').length}
            </span>
          </div>
          <div className="bg-[#5D4037] px-3.5 py-2 rounded-xl border border-[#8D6E63]/50 text-center">
            <span className="text-amber-200 block text-[10px] uppercase font-bold">Masih Dibuat</span>
            <span className="text-lg font-bold text-amber-300">
              {orders.filter(o => o.status === 'SEDANG_DIBUAT').length}
            </span>
          </div>
          <div className="bg-[#5D4037] px-3.5 py-2 rounded-xl border border-[#8D6E63]/50 text-center">
            <span className="text-emerald-300 block text-[10px] uppercase font-bold">Air Siap!</span>
            <span className="text-lg font-bold text-emerald-400">
              {orders.filter(o => o.status === 'AIR_SIAP').length}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-[#E8E2D9] pb-4">
        
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {(
            [
              { key: 'SEMUA', label: 'Semua Pesanan' },
              { key: 'BARU', label: '🆕 Baru' },
              { key: 'SEDANG_DIBUAT', label: '☕ Masih Dibuat' },
              { key: 'AIR_SIAP', label: '🔔 Air Siap!' },
              { key: 'SELESAI', label: '✅ Selesai' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterStatus(tab.key)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                filterStatus === tab.key
                  ? 'bg-[#3E2723] text-white shadow-sm'
                  : 'bg-[#FDFBF7] text-[#5D4037] border border-[#E8E2D9] hover:bg-[#EFEBE9]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#8D6E63] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari pesanan / nama..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-[#E8E2D9] rounded-xl bg-white focus:ring-2 focus:ring-[#5D4037] focus:outline-none"
          />
        </div>
      </div>

      {/* Orders Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredOrders.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl p-12 text-center border border-[#E8E2D9] space-y-2">
            <Coffee className="w-12 h-12 text-[#8D6E63] mx-auto" />
            <p className="font-bold text-[#3E2723]">Tiada pesanan dalam kategori ini.</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isNew = order.status === 'BARU';
            const isPreparing = order.status === 'SEDANG_DIBUAT';
            const isReady = order.status === 'AIR_SIAP';
            const isCompleted = order.status === 'SELESAI';

            return (
              <div
                key={order.id}
                className={`bg-white rounded-2xl p-5 border shadow-sm transition-all flex flex-col justify-between space-y-4 ${
                  isReady
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/10'
                    : isPreparing
                    ? 'border-amber-500 bg-[#FDFBF7]'
                    : isNew
                    ? 'border-[#8D6E63] bg-[#FAF9F6]'
                    : 'border-[#E8E2D9]'
                }`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between border-b border-[#F3EFEA] pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-base text-[#3E2723] bg-[#EFEBE9] px-3 py-1 rounded-xl border border-[#E8E2D9]">
                          {order.orderNumber}
                        </span>
                        <h3 className="font-bold text-[#2D241E] text-sm">
                          {order.customerName}
                        </h3>
                      </div>
                      <p className="text-[11px] text-[#8D6E63] mt-1 flex items-center gap-2">
                        <span>📞 {order.customerPhone}</span>
                        <span>•</span>
                        <span>📍 {order.tableOrPickup}</span>
                      </p>
                    </div>

                    <span className="text-xs font-semibold text-[#5D4037] bg-[#EFEBE9] px-2.5 py-1 rounded-lg">
                      {order.timeFormatted}
                    </span>
                  </div>

                  {/* Items list */}
                  <div className="py-3 space-y-2">
                    <span className="text-[11px] font-bold text-[#8D6E63] uppercase tracking-wider block">
                      Kandungan Pesanan ({order.items.reduce((a, b) => a + b.quantity, 0)} cawan):
                    </span>

                    <div className="space-y-1.5">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="bg-[#FDFBF7] p-2.5 rounded-xl border border-[#F3EFEA] text-xs space-y-1">
                          <div className="flex justify-between font-bold text-[#2D241E]">
                            <span>
                              {item.quantity}x {item.beverageName} ({item.size})
                            </span>
                            <span>RM {item.itemTotalPrice.toFixed(2)}</span>
                          </div>
                          <p className="text-[11px] text-[#5D4037] font-medium">
                            {item.temp} • {item.sweetness}
                          </p>
                          {item.toppings.length > 0 && (
                            <p className="text-[10px] text-[#8D6E63]">
                              + Topping: {item.toppings.map(t => t.name).join(', ')}
                            </p>
                          )}
                          {item.notes && (
                            <p className="text-[10px] text-[#8D6E63] italic bg-[#EFEBE9] p-1 rounded border border-[#E8E2D9]">
                              Catatan: "{item.notes}"
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Financial Quick Info */}
                  <div className="flex items-center justify-between text-xs bg-[#FAF9F6] p-2.5 rounded-xl border border-[#E8E2D9]">
                    <div>
                      <span className="text-[#8D6E63] text-[10px] font-bold block uppercase">Jumlah Bayaran</span>
                      <span className="font-bold text-[#3E2723] text-sm">RM {order.totalAmount.toFixed(2)}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-[#8D6E63] text-[10px] font-bold block uppercase">Untung Bersih (Margin)</span>
                      <span className="font-bold text-emerald-700">RM {order.netProfit.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Card Action Controls */}
                <div className="pt-2 border-t border-[#F3EFEA] space-y-2">
                  
                  {/* Status Change Buttons */}
                  <div className="grid grid-cols-3 gap-2">
                    
                    {/* Step 1 -> Step 2 */}
                    <button
                      type="button"
                      onClick={() => onUpdateOrderStatus(order.id, 'SEDANG_DIBUAT')}
                      disabled={isPreparing || isReady || isCompleted}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                        isPreparing
                          ? 'bg-[#3E2723] text-white font-bold'
                          : 'bg-[#EFEBE9] text-[#3E2723] hover:bg-[#E8E2D9] disabled:opacity-40'
                      }`}
                    >
                      <Coffee className="w-3.5 h-3.5" />
                      Mula Buat Air
                    </button>

                    {/* Step 2 -> Step 3 (AIR TELAH SIAP) */}
                    <button
                      type="button"
                      onClick={() => handleSetReady(order)}
                      disabled={isReady || isCompleted}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                        isReady
                          ? 'bg-emerald-600 text-white font-bold shadow-md animate-pulse'
                          : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-600 hover:text-white border border-emerald-300 disabled:opacity-40'
                      }`}
                    >
                      <Bell className="w-3.5 h-3.5" />
                      Air Dah Siap!
                    </button>

                    {/* Step 3 -> Step 4 */}
                    <button
                      type="button"
                      onClick={() => onUpdateOrderStatus(order.id, 'SELESAI')}
                      disabled={isCompleted}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                        isCompleted
                          ? 'bg-[#3E2723] text-white font-bold'
                          : 'bg-[#EFEBE9] text-[#3E2723] hover:bg-[#E8E2D9] disabled:opacity-40'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Selesai
                    </button>
                  </div>

                  {/* Send WhatsApp notification simulation button */}
                  <button
                    type="button"
                    onClick={() => handleSendWhatsAppNotice(order)}
                    className="w-full bg-[#FAF9F6] hover:bg-[#EFEBE9] text-[#3E2723] font-bold py-2 px-3 rounded-xl border border-[#E8E2D9] text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#5D4037]" />
                    Hantar Mesej WhatsApp Air Dah Siap kepada {order.customerName}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
