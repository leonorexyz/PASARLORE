export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
}

export interface StockAvailability {
  status: "in_stock" | "low_stock" | "out_of_stock";
  label: string;
  isAvailable: boolean;
  quantity: number;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  category?: Category;
  imageUrl: string;
  isActive: boolean;
  unit: string;
  rating?: number;
  soldCount?: number;
  isFeatured?: boolean;
  stockAvailability?: StockAvailability;
  createdAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "customer";
  createdAt: string;
}

export interface Address {
  id: string;
  userId: string;
  label: string;
  recipientName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

export interface PaymentMethod {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  instructions: string;
  isActive: boolean;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
  imageUrl?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  addressId: string;
  address?: Address;
  totalAmount: number;
  status: "menunggu_pembayaran" | "menunggu_verifikasi" | "diproses" | "dikirim" | "selesai" | "dibatalkan";
  createdAt: string;
  items: OrderItem[];
  payment?: Payment;
}

export interface Payment {
  id: string;
  orderId: string;
  paymentMethodId: string;
  paymentMethod?: PaymentMethod;
  proofImageUrl?: string;
  transferredAmount: number;
  status: "menunggu" | "valid" | "ditolak";
  notes?: string;
  createdAt: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  product?: Product;
  change: number;
  reason: string;
  createdAt: string;
}
