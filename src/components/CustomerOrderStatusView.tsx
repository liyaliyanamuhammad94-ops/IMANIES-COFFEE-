import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../types';
import { Coffee, CheckCircle, Bell, Search, Clock, Sparkles, PhoneCall, QrCode } from 'lucide-react';
import { playReadyBell } from '../utils/audio';

interface CustomerOrderStatusViewProps {
  orders: Order[];
}

export const CustomerOrderStatusView: React.FC<CustomerOrderStatusViewProps> = ({ orders }) => {
  const [searchPhone, setSearchPhone] = useState('');
  const [playedReadySet, setPlayedReadySet] = useState<Set<string>>(new Set());

  // Filter orders matching phone number or show top active orders
  const filteredOrders = searchPhone.trim()
    ? orders.filter(o => 
        o.customerPhone.includes(searchPhone.trim()) || 
        o.orderNumber.toLowerCase().includes(searchPhone.trim().toLowerCase()) ||
        o.customerName.toLowerCase().includes(searchPhone.trim().toLowerCase())
      )
    : orders;

  // Auto sound chime trigger when status changes to 'AIR_SIAP'
  useEffect(() => {
    orders.forEach(order => {
      if (order.status === 'AIR_SIAP' && !playedReadySet.has(order.id)) {
        playReadyBell();
        setPlayedReadySet(prev => new Set(prev).add(order.id));
      }
    });
  }, [orders]);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'BARU':
        return (
          <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full border border-blue-200 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 animate-spin" /> Pesanan Diterima
          </span>
        );
      case 'SEDANG_DIBUAT':
        return (
          <span className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full border border-amber-300 flex items-center gap-1.5">
            <Coffee className="w-3.5 h-3.5 text-amber-700 animate-pulse" /> Masih Dibuat (Sedang Disediakan)
          </span>
        );
      case 'AIR_SIAP':
        return (
          <span className="bg-emerald-600 text-white text-xs font-extrabold px-3.5 py-1 rounded-full shadow-lg border border-emerald-400 animate-bounce flex items-center gap-1.5">
            <Bell className="w-3.5 h-3.5" /> AIR TELAH SIAP! Sila Ambil
          </span>
        );
      case 'SELESAI':
        return (
          <span className="bg-stone-100 text-stone-700 text-xs font-bold px-3 py-1 rounded-full border border-stone-300 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-stone-500" /> Selesai Diambil
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-[#3E2723] text-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#5D4037] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-[#5D4037] text-amber-200 text-xs font-semibold px-3 py-1 rounded-full border border-[#8D6E63]/40 uppercase tracking-wider">
            <Bell className="w-3.5 h-3.5 text-amber-300 animate-pulse" /> Status Langsung Pesanan Air
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Semak Status Minuman Anda
          </h1>
          <p className="text-[#E8E2D9] text-xs sm:text-sm max-w-xl opacity-90">
            Sistem pemberitahuan langsung! Bunyi loceng akan berbunyi automatik sebaik sahaja air minuman Imanies Coffee anda <span className="text-amber-300 font-bold underline underline-offset-2">TELAH SIAP</span> dibuat.
          </p>
        </div>

        {/* Search Field */}
        <div className="w-full md:w-72 bg-[#5D4037] p-2.5 rounded-xl border border-[#8D6E63]/60">
          <label className="block text-[11px] font-bold text-amber-200 mb-1 px-1">
            Carian Nombor Telefon / Nama:
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-amber-300 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="012-3456789 atau Nama"
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#3E2723] text-white border border-[#8D6E63] rounded-lg focus:ring-2 focus:ring-amber-400 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Orders Status List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-[#E8E2D9] space-y-3">
            <Coffee className="w-12 h-12 text-[#8D6E63] mx-auto" />
            <h3 className="text-base font-bold text-[#3E2723]">Tiada Pesanan Ditemui</h3>
            <p className="text-xs text-[#8D6E63] max-w-md mx-auto">
              Sila buat pesanan baru di tab menu atau masukkan nombor telefon yang tepat untuk semakan status.
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isReady = order.status === 'AIR_SIAP';
            const isPreparing = order.status === 'SEDANG_DIBUAT';

            return (
              <div
                key={order.id}
                className={`bg-white rounded-2xl p-5 sm:p-6 border transition-all shadow-sm space-y-4 ${
                  isReady
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/20'
                    : isPreparing
                    ? 'border-amber-500 bg-[#FDFBF7]'
                    : 'border-[#E8E2D9]'
                }`}
              >
                {/* Top Row: Order No & Status */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F3EFEA] pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-base text-[#3E2723] bg-[#EFEBE9] px-3 py-1 rounded-xl border border-[#E8E2D9]">
                        {order.orderNumber}
                      </span>
                      <span className="text-sm font-bold text-[#2D241E]">
                        {order.customerName}
                      </span>
                      <span className="text-xs text-[#8D6E63]">
                        ({order.tableOrPickup})
                      </span>
                    </div>
                    <p className="text-[11px] text-[#8D6E63] mt-1">
                      Masa Pesanan: {order.timeFormatted} • Tel: {order.customerPhone}
                    </p>
                  </div>

                  <div>{getStatusBadge(order.status)}</div>
                </div>

                {/* Status Timeline Bar */}
                <div className="py-2">
                  <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
                    
                    {/* Step 1: Baru */}
                    <div className="space-y-1">
                      <div className={`h-2 rounded-full ${order.status !== 'BATAL' ? 'bg-[#3E2723]' : 'bg-[#E8E2D9]'}`} />
                      <span className="font-bold text-[#2D241E]">1. Diterima</span>
                    </div>

                    {/* Step 2: Masih Dibuat */}
                    <div className="space-y-1">
                      <div
                        className={`h-2 rounded-full ${
                          ['SEDANG_DIBUAT', 'AIR_SIAP', 'SELESAI'].includes(order.status)
                            ? 'bg-[#5D4037]'
                            : 'bg-[#E8E2D9]'
                        }`}
                      />
                      <span className={`font-bold ${isPreparing ? 'text-[#3E2723] font-bold' : 'text-[#8D6E63]'}`}>
                        2. Masih Dibuat ☕
                      </span>
                    </div>

                    {/* Step 3: Air Siap */}
                    <div className="space-y-1">
                      <div
                        className={`h-2 rounded-full ${
                          ['AIR_SIAP', 'SELESAI'].includes(order.status)
                            ? 'bg-emerald-600 animate-pulse'
                            : 'bg-[#E8E2D9]'
                        }`}
                      />
                      <span className={`font-bold ${isReady ? 'text-emerald-700 font-extrabold' : 'text-[#8D6E63]'}`}>
                        3. AIR TELAH SIAP! 🔔
                      </span>
                    </div>

                    {/* Step 4: Selesai */}
                    <div className="space-y-1">
                      <div
                        className={`h-2 rounded-full ${
                          order.status === 'SELESAI' ? 'bg-[#3E2723]' : 'bg-[#E8E2D9]'
                        }`}
                      />
                      <span className="font-bold text-[#8D6E63]">4. Selesai</span>
                    </div>

                  </div>
                </div>

                {/* Air Siap Special Alert Box */}
                {isReady && (
                  <div className="bg-emerald-600 text-white rounded-xl p-4 flex items-center justify-between gap-4 shadow-sm animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl">
                        🔔
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">AIR ANDA TELAH SIAP!</h4>
                        <p className="text-xs text-emerald-100">
                          Sila bawa nombor pesanan <span className="font-bold underline">{order.orderNumber}</span> ke kaunter untuk mengambil minuman anda.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Items Ordered List */}
                <div className="bg-[#FDFBF7] rounded-2xl p-3 border border-[#F3EFEA] space-y-2">
                  <span className="text-[11px] font-bold text-[#8D6E63] uppercase tracking-wider block">
                    Senarai Air Dipesan ({order.items.reduce((a, b) => a + b.quantity, 0)} cawan)
                  </span>

                  <div className="divide-y divide-[#F3EFEA]">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="py-2 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold bg-[#EFEBE9] text-[#3E2723] w-5 h-5 rounded-md flex items-center justify-center text-[10px]">
                            {item.quantity}x
                          </span>
                          <div>
                            <span className="font-bold text-[#2D241E]">{item.beverageName}</span>
                            <span className="text-[#8D6E63] ml-1.5 text-[11px]">
                              ({item.size}, {item.temp}, {item.sweetness})
                            </span>
                            {item.toppings.length > 0 && (
                              <p className="text-[10px] text-[#5D4037] font-semibold">
                                Topping: {item.toppings.map(t => t.name).join(', ')}
                              </p>
                            )}
                          </div>
                        </div>

                        <span className="font-bold text-[#3E2723]">
                          RM {item.itemTotalPrice.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-[#E8E2D9] flex justify-between items-center text-xs">
                    <span className="text-[#5D4037] font-bold">
                      Jumlah Bayaran ({order.paymentMethod}):
                    </span>
                    <span className="font-bold text-[#3E2723] text-sm">
                      RM {order.totalAmount.toFixed(2)}
                      {order.discount > 0 && (
                        <span className="text-[10px] text-emerald-700 font-semibold ml-1">
                          (Jimat RM{order.discount.toFixed(2)} Promo)
                        </span>
                      )}
                    </span>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
