import React from 'react';
import { Home, ChefHat } from 'lucide-react';

interface OrderSuccessProps {
  orderId: string;
  onHome: () => void;
  onViewKitchen: () => void;
}

const OrderSuccess: React.FC<OrderSuccessProps> = ({ orderId, onHome, onViewKitchen }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg p-8 rounded-3xl border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden transform rotate-1 flex flex-col items-center text-center">
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 right-0 h-4 bg-primary/20 flex space-x-2 overflow-hidden">
            {[...Array(20)].map((_, i) => (
                <div key={i} className="w-4 h-4 rounded-full bg-primary/40 -mt-2"></div>
            ))}
        </div>

        <div className="mt-4 mb-6 relative">
             <div className="text-7xl animate-bounce">🎫</div>
             <div className="absolute -bottom-2 -right-4 text-4xl animate-pulse delay-75">✨</div>
        </div>
          
        <h2 className="font-doodle text-4xl font-bold mb-2">Order Booked!</h2>
        
        <div className="bg-paper px-8 py-4 rounded-xl border-2 border-black border-dashed my-4 transform -rotate-2 shadow-sm relative">
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white border-r-2 border-black rounded-full"></div>
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white border-l-2 border-black rounded-full"></div>
            <p className="font-sans font-bold text-gray-500 text-xs uppercase tracking-widest">Token Number</p>
            <p className="font-doodle text-6xl font-bold text-primary">#{orderId}</p>
        </div>

        <div className="space-y-4 py-6 font-doodle text-2xl leading-relaxed text-ink">
          <p>
            Your order has been sent to the Kitchen! 👨‍🍳
          </p>
          <p className="text-lg font-sans text-gray-600">
            It is now securely stored in the <span className="font-bold text-primary">Cloud Database</span>.
          </p>
        </div>

        <div className="w-full space-y-3 mt-2">
          {/* Back to Menu Button */}
          <button 
            onClick={onHome}
            className="w-full bg-accent hover:bg-cyan-300 text-black font-bold text-xl py-3 px-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all font-doodle flex items-center justify-center gap-2"
          >
            <Home size={24} />
            Back to Menu
          </button>

          {/* Kitchen View Button */}
          <button 
            onClick={onViewKitchen}
            className="w-full bg-white hover:bg-gray-50 text-ink font-bold text-lg py-3 px-6 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all font-doodle flex items-center justify-center gap-2"
          >
            <ChefHat size={24} />
            See Order in Kitchen (Demo)
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
