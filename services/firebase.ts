import { CartItem, Order, OrderStatus } from "../types";

// MOCK IMPLEMENTATION - Firebase dependency replaced with LocalStorage
// due to module resolution issues with 'firebase/app'.
// This ensures the app runs correctly in the provided environment.

export const placeOrderInDB = async (cart: CartItem[], total: number, paymentMethod: string, tokenNumber: string) => {
  try {
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      tokenNumber,
      items: cart,
      total,
      paymentMethod,
      status: 'pending',
      timestamp: new Date(),
    };
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    storedOrders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(storedOrders));
    
    // Dispatch custom event for local listeners
    window.dispatchEvent(new Event('local-orders-update'));
    return true;
  } catch (error) {
    console.error("Error placing order:", error);
    return false;
  }
};

export const subscribeToOrders = (callback: (orders: Order[]) => void) => {
  const loadOrders = () => {
    try {
      const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      // Sort by timestamp descending (newest first)
      const sortedOrders = storedOrders.map((o: any) => ({
        ...o,
        timestamp: new Date(o.timestamp) // Convert string back to Date
      })).sort((a: Order, b: Order) => b.timestamp.getTime() - a.timestamp.getTime());
      
      callback(sortedOrders);
    } catch (error) {
      console.error("Error loading orders from storage", error);
    }
  };

  // Initial load
  loadOrders();

  // Listen for local updates
  const handler = () => loadOrders();
  window.addEventListener('local-orders-update', handler);
  
  // Poll to simulate "kitchen" updates or multiple tabs
  const interval = setInterval(loadOrders, 2000);

  return () => {
    window.removeEventListener('local-orders-update', handler);
    clearInterval(interval);
  };
};

export const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
  try {
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const updatedOrders = storedOrders.map((o: any) => 
      o.id === orderId ? { ...o, status } : o
    );
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    window.dispatchEvent(new Event('local-orders-update'));
  } catch (error) {
    console.error("Error updating order status:", error);
  }
};