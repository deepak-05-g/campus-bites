import React, { useState } from 'react';
import DoodleBackground from './components/DoodleBackground';
import FoodCard from './components/FoodCard';
import CartDrawer from './components/CartDrawer';
import ChatAssistant from './components/ChatAssistant';
import CheckoutPage, { UserDetails } from './components/CheckoutPage';
import OrderSuccess from './components/OrderSuccess';
import KitchenDashboard from './components/KitchenDashboard';
import { MENU_ITEMS } from './constants';
import { MenuItem, CartItem, Category } from './types';
import { ShoppingBag, Menu as MenuIcon, ChefHat } from 'lucide-react';
import { placeOrderInDB } from './services/firebase';

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [currentView, setCurrentView] = useState<'menu' | 'checkout' | 'success' | 'kitchen'>('menu');
  const [lastOrderId, setLastOrderId] = useState<string>('');
  const [isOrderSubmitting, setIsOrderSubmitting] = useState(false);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter((item): item is CartItem => item !== null);
    });
  };

  const handleCheckoutStart = () => {
    setIsCartOpen(false);
    setCurrentView('checkout');
  };

  const handlePlaceOrder = async (details: UserDetails) => {
    setIsOrderSubmitting(true);
    const newOrderId = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Save to Firebase
    const success = await placeOrderInDB(cart, total, details.paymentMethod, newOrderId);

    if (success) {
      setLastOrderId(newOrderId);
      setCart([]);
      setCurrentView('success');
    } else {
      alert("Failed to place order. Please check your connection and try again.");
    }
    
    setIsOrderSubmitting(false);
  };

  const categories = ['All', ...Object.values(Category)];

  const filteredItems = selectedCategory === 'All' 
    ? MENU_ITEMS 
    : MENU_ITEMS.filter(item => item.category === selectedCategory);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen relative font-sans text-ink selection:bg-yellow-200">
      <DoodleBackground />
      
      {/* Navbar */}
      <nav className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b-4 border-black shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button onClick={() => setCurrentView('menu')} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="bg-secondary p-1.5 rounded-lg border-2 border-black transform -rotate-3 flex items-center justify-center shadow-sm">
                <span className="text-2xl leading-none">🎓🍔</span>
              </div>
              <h1 className="font-doodle text-2xl md:text-3xl font-bold tracking-wide mt-1">Campus Bites</h1>
            </button>
            
            <div className="flex items-center gap-4">
              {currentView === 'menu' && (
                <>
                  <button 
                    onClick={() => setCurrentView('kitchen')}
                    className="hidden md:flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl font-doodle border-2 border-transparent hover:border-gray-600 hover:bg-gray-800 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]"
                  >
                    <ChefHat size={18} />
                    <span>Kitchen View</span>
                  </button>
                   {/* Mobile Icon Only */}
                   <button 
                    onClick={() => setCurrentView('kitchen')}
                    className="md:hidden p-2 bg-black text-white rounded-xl"
                  >
                    <ChefHat size={20} />
                  </button>

                  <button 
                    onClick={() => setIsCartOpen(true)}
                    className="relative p-2 hover:bg-gray-100 rounded-xl border-2 border-transparent hover:border-black transition-all"
                  >
                    <ShoppingBag size={24} />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                        {cartCount}
                      </span>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {currentView === 'menu' && (
          <>
            {/* Hero Section */}
            <div className="mb-8 text-center space-y-3">
              <h2 className="text-4xl md:text-6xl font-doodle font-bold text-ink leading-tight transform -rotate-1">
                Hungry? <span className="text-primary underline decoration-wavy decoration-secondary underline-offset-8">Grab a bite!</span>
              </h2>
              <p className="text-lg md:text-xl text-gray-600 font-sans max-w-2xl mx-auto">
                Fresh, hot, and spicy South Indian delicacies and more. Book your meal and skip the queue!
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-2 rounded-full font-bold text-lg border-2 border-black transition-all transform hover:-translate-y-1 ${
                    selectedCategory === cat 
                      ? 'bg-accent shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' 
                      : 'bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Food Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-24">
              {filteredItems.map(item => (
                <FoodCard key={item.id} item={item} onAdd={addToCart} />
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-20">
                <p className="font-doodle text-3xl text-gray-400">Nothing here yet! Try another category.</p>
              </div>
            )}
          </>
        )}

        {currentView === 'checkout' && (
          <CheckoutPage 
            cart={cart} 
            onBack={() => setCurrentView('menu')} 
            onPlaceOrder={handlePlaceOrder}
          />
        )}

        {currentView === 'success' && (
          <OrderSuccess 
            orderId={lastOrderId}
            onHome={() => setCurrentView('menu')}
            onViewKitchen={() => setCurrentView('kitchen')}
          />
        )}

        {currentView === 'kitchen' && (
          <KitchenDashboard onBack={() => setCurrentView('menu')} />
        )}

      </main>

      {/* Loading Overlay for submission */}
      {isOrderSubmitting && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center">
             <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
             <p className="font-doodle text-xl">Sending to Kitchen...</p>
          </div>
        </div>
      )}

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart} 
        onUpdateQuantity={updateQuantity}
        onCheckout={handleCheckoutStart}
      />

      <ChatAssistant />

    </div>
  );
};

export default App;


