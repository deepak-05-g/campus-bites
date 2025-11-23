import React, { useState } from 'react';
import { CartItem } from '../types';
import { ArrowLeft, CheckCircle } from 'lucide-react';

interface CheckoutPageProps {
  cart: CartItem[];
  onBack: () => void;
  onPlaceOrder: (userDetails: UserDetails) => void;
}

export interface UserDetails {
  paymentMethod: string;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ cart, onBack, onPlaceOrder }) => {
  const [paymentMethod, setPaymentMethod] = useState('upi');

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPlaceOrder({ paymentMethod });
  };

  return (
     <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pt-4">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-8">
            <button 
              onClick={onBack}
              className="bg-white p-2 rounded-full border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all active:translate-y-0 active:shadow-none"
              aria-label="Go back to menu"
            >
                <ArrowLeft size={24} />
            </button>
            <h2 className="font-doodle text-4xl font-bold">Checkout</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Order Summary */}
            <div className="bg-white p-6 rounded-2xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="font-doodle text-2xl font-bold mb-4 border-b-2 border-dashed border-gray-300 pb-2">Order Summary</h3>
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {cart.map((item) => (
                        <div key={item.id} className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gray-200 rounded border border-black flex items-center justify-center font-bold text-sm">
                                    {item.quantity}x
                                </div>
                                <span className="font-sans font-medium text-ink">{item.name}</span>
                            </div>
                            <span className="font-bold text-ink">₹{item.price * item.quantity}</span>
                        </div>
                    ))}
                </div>
                <div className="mt-6 pt-4 border-t-2 border-black flex justify-between items-center">
                    <span className="font-doodle text-2xl">Total to Pay</span>
                    <span className="font-sans text-3xl font-bold text-primary">₹{total}</span>
                </div>
            </div>

            {/* Right Column: Payment Method */}
            <div className="bg-white p-6 rounded-2xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] h-fit">
                <h3 className="font-doodle text-2xl font-bold mb-6">Choose Payment</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    <div className="grid grid-cols-1 gap-4">
                        <button
                            type="button"
                            onClick={() => setPaymentMethod('upi')}
                            className={`p-6 rounded-xl border-2 flex items-center gap-4 transition-all relative overflow-hidden group ${paymentMethod === 'upi' ? 'bg-secondary border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] scale-[1.02]' : 'bg-white border-gray-300 hover:border-black hover:bg-gray-50'}`}
                        >
                            <div className="text-4xl group-hover:scale-110 transition-transform">📱</div>
                            <div className="flex flex-col items-start">
                                <span className="font-doodle text-2xl font-bold">UPI / QR Code</span>
                                <span className="text-xs font-sans text-gray-600">GPay, Paytm, PhonePe</span>
                            </div>
                            {paymentMethod === 'upi' && <div className="absolute top-2 right-2 text-black"><CheckCircle size={20} fill="white" /></div>}
                        </button>

                        <button
                            type="button"
                            onClick={() => setPaymentMethod('cash')}
                            className={`p-6 rounded-xl border-2 flex items-center gap-4 transition-all relative overflow-hidden group ${paymentMethod === 'cash' ? 'bg-secondary border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] scale-[1.02]' : 'bg-white border-gray-300 hover:border-black hover:bg-gray-50'}`}
                        >
                            <div className="text-4xl group-hover:scale-110 transition-transform">💵</div>
                            <div className="flex flex-col items-start">
                                <span className="font-doodle text-2xl font-bold">Cash on Counter</span>
                                <span className="text-xs font-sans text-gray-600">Pay when you collect</span>
                            </div>
                            {paymentMethod === 'cash' && <div className="absolute top-2 right-2 text-black"><CheckCircle size={20} fill="white" /></div>}
                        </button>
                    </div>

                    <button 
                        type="submit"
                        className="w-full mt-6 bg-primary text-white font-bold text-xl py-4 px-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all font-doodle flex items-center justify-center gap-2 hover:bg-red-500"
                    >
                        <span className="text-2xl">😋</span>
                        Confirm Order
                    </button>
                </form>
            </div>
        </div>
     </div>
  );
};

export default CheckoutPage;