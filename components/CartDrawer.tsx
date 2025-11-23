import React from 'react';
import { CartItem } from '../types';
import { X, Trash2, ShoppingBag } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onCheckout: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, cart, onUpdateQuantity, onCheckout }) => {
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end isolate">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="relative w-full max-w-md bg-paper h-full shadow-2xl flex flex-col border-l-4 border-black animate-in slide-in-from-right duration-300">
        <div className="p-6 border-b-4 border-black bg-primary flex justify-between items-center">
          <h2 className="font-doodle text-3xl text-white flex items-center gap-2">
            <ShoppingBag /> Your Tray
          </h2>
          <button onClick={onClose} className="text-white hover:rotate-90 transition-transform">
            <X size={32} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-4">
              <ShoppingBag size={64} strokeWidth={1} />
              <p className="font-doodle text-2xl">Your tray is empty!</p>
              <p className="font-sans text-sm">Add some delicious food to get started.</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-4 bg-white p-3 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]">
                <img src={item.imageUrl} alt={item.name} className="w-20 h-20 rounded-lg object-cover border border-black" />
                <div className="flex-grow flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold font-sans text-ink line-clamp-1">{item.name}</h4>
                    <span className="font-bold text-primary">₹{item.price * item.quantity}</span>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1 border border-gray-300">
                      <button 
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="w-6 h-6 flex items-center justify-center hover:bg-white rounded text-lg leading-none font-bold"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="font-sans font-bold w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="w-6 h-6 flex items-center justify-center hover:bg-white rounded text-lg leading-none font-bold"
                         aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <button 
                      onClick={() => onUpdateQuantity(item.id, -item.quantity)} // Remove all
                      className="text-red-500 hover:text-red-700 p-1"
                       aria-label="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t-4 border-black bg-white">
          <div className="flex justify-between items-center mb-4 font-doodle text-2xl">
            <span>Total:</span>
            <span className="text-primary font-bold">₹{total}</span>
          </div>
          <button 
            onClick={onCheckout}
            disabled={cart.length === 0}
            className="w-full bg-accent hover:bg-cyan-300 disabled:bg-gray-300 disabled:cursor-not-allowed text-black font-bold text-xl py-3 px-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all font-doodle"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;