export type DrinkCategory = 'kopi' | 'bukan_kopi' | 'teh_buah';

export interface CostComponent {
  id: string;
  name: string;
  cost: number; // In RM
}

export interface Beverage {
  id: string;
  name: string;
  category: DrinkCategory;
  description: string;
  image: string;
  sellingPrice: number; // In RM
  costComponents: CostComponent[];
  popularTag?: boolean;
  badge?: string;
  isAvailable: boolean;
}

export interface ToppingOption {
  id: string;
  name: string;
  price: number;
  cost: number;
}

export interface CartItem {
  id: string;
  beverageId: string;
  beverageName: string;
  image: string;
  size: 'Regular' | 'Large';
  sweetness: string;
  temp: 'Ais / Cold' | 'Panas / Hot';
  toppings: { name: string; price: number; cost: number }[];
  quantity: number;
  unitPrice: number;
  unitCost: number;
  itemTotalPrice: number;
  itemTotalCost: number;
  notes?: string;
}

export interface PromoCode {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number; // 10 for 10% or 2.00 for RM2.00
  minSpend: number;
  description: string;
  active: boolean;
  usedCount: number;
  forRepeatedCustomersOnly?: boolean;
}

export type OrderStatus = 'BARU' | 'SEDANG_DIBUAT' | 'AIR_SIAP' | 'SELESAI' | 'BATAL';

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  tableOrPickup: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  promoCode?: string;
  totalAmount: number;
  totalCost: number; // COGS
  netProfit: number;
  status: OrderStatus;
  paymentMethod: 'DuitNow QR' | 'Tunai / Cash' | 'Kad Debit/Kredit';
  createdAt: string; // ISO String
  timeFormatted: string;
  updatedAt: string;
  notifiedClient?: boolean;
}

export interface OperationalExpense {
  id: string;
  date: string;
  title: string;
  amount: number;
  category: 'Sewa Tapak' | 'Ais Kristal' | 'Barang Operasi' | 'Staf / Kebajikan' | 'Lain-lain';
}

export interface DailyReportSummary {
  date: string;
  totalSales: number;
  totalCOGS: number;
  totalOperationalExpenses: number;
  netProfit: number;
  profitMargin: number;
  totalCupsSold: number;
  totalOrdersCount: number;
  topSellingDrink: string;
  promoDiscountsGiven: number;
  aiReportMarkdown?: string;
}
