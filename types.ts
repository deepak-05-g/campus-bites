export enum Category {
  SOUTH_INDIAN = 'South Indian',
  NORTH_INDIAN = 'North Indian',
  SNACKS = 'Snacks',
  BEVERAGES = 'Beverages',
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  imageUrl: string;
  isSpicy?: boolean;
  isVeg: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export type OrderStatus = 'pending' | 'cooking' | 'ready' | 'completed';

export interface Order {
  id: string;
  tokenNumber: string;
  items: CartItem[];
  total: number;
  paymentMethod: string;
  status: OrderStatus;
  timestamp: any; // Firebase timestamp
}
