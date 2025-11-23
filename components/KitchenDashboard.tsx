
import React, { useEffect, useState } from 'react';
import { subscribeToOrders, updateOrderStatus } from '../services/firebase';
import { Order, OrderStatus } from '../types';
import { ChefHat, Clock, CheckCircle, Bell, ArrowLeft, Wifi, RotateCcw } from 'lucide-react';

interface KitchenDashboardProps {
  onBack: () => void;
}

const KitchenDashboard: React.FC<KitchenDashboardProps> = ({ onBack }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Real-time subscription
    const unsubscribe = subscribeToOrders((newOrders) => {
      setOrders(newOrders);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleStatusUpdate = async (orderId: string, currentStatus: OrderStatus) => {
    let nextStatus: OrderStatus = 'pending';
    if (currentStatus === 'pending') nextStatus = 'cooking';
    else if (currentStatus === 'cooking') nextStatus = 'ready';
    else if (currentStatus === 'ready') nextStatus = 'completed';
    
    await updateOrderStatus(orderId, nextStatus);
  };

  const activeOrders = orders.filter(o => o.status !== 'completed');

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      case 'cooking': return 'bg-blue-100 border-blue-500 text-blue-800';
      case 'ready': return 'bg-green-100 border-green-500 text-green-800';
      default: return 'bg-gray-100 border-gray-500 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto pt-4 animate-in fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 bg-white p-4 rounded-xl border-2 border-black shadow-md gap-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full border border-transparent hover:border-black transition-all">
            <ArrowLeft />
          </button>
          <h2 className="font-doodle text-3xl font-bold flex items-center gap-2">
            <ChefHat size={32} /> Kitchen Display
          </h2>
        </div>
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full border border-green-500 text-green-800 font-bold shadow-sm">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </div>
              LIVE FEED
           </div>
           <div className="flex gap-4 text-sm font-bold font-sans hidden lg:flex">
            <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-yellow-400 border border-black"></span> Pending: {orders.filter(o => o.status === 'pending').length}
            </div>
            <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-400 border border-black"></span> Cooking: {orders.filter(o => o.status === 'cooking').length}
            </div>
             <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-gray-400 border border-black"></span> Completed: {orders.filter(o => o.status === 'completed').length}
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 font-doodle text-2xl animate-pulse">Fetching orders from cloud... ☁️</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeOrders.map((order) => (
            <div key={order.id} className={`bg-white rounded-xl border-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col animate-in slide-in-from-bottom-2 duration-300 ${order.status === 'ready' ? 'border-green-500' : 'border-black'}`}>
              
              {/* Header */}
              <div className={`p-4 border-b-2 border-black flex justify-between items-center ${getStatusColor(order.status)}`}>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider block opacity-70">Token #{order.tokenNumber}</span>
                  <div className="flex items-center gap-1 text-sm font-sans font-bold opacity-80">
                    <Clock size={14} />
                    {order.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div className="text-right">
                   <span className="text-xs font-bold uppercase block">{order.paymentMethod}</span>
                   <span className="font-sans font-bold text-lg">₹{order.total}</span>
                </div>
              </div>

              {/* Items */}
              <div className="p-4 flex-grow space-y-3 bg-paper">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start border-b border-dashed border-gray-400 pb-2 last:border-0">
                    <div className="flex gap-2">
                      <span className="font-bold bg-black text-white w-6 h-6 flex items-center justify-center rounded-md text-sm">
                        {item.quantity}
                      </span>
                      <span className="font-sans font-medium text-ink leading-tight">{item.name}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <button 
                onClick={() => handleStatusUpdate(order.id, order.status)}
                className={`p-4 font-bold text-lg border-t-2 border-black transition-colors flex items-center justify-center gap-2
                  ${order.status === 'pending' ? 'bg-yellow-300 hover:bg-yellow-400' : ''}
                  ${order.status === 'cooking' ? 'bg-blue-300 hover:bg-blue-400' : ''}
                  ${order.status === 'ready' ? 'bg-green-300 hover:bg-green-400' : ''}
                `}
              >
                {order.status === 'pending' && <><Bell size={20} /> Start Cooking</>}
                {order.status === 'cooking' && <><ChefHat size={20} /> Mark Ready</>}
                {order.status === 'ready' && <><CheckCircle size={20} /> Complete Order</>}
              </button>
            </div>
          ))}

          {activeOrders.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400 opacity-50">
              <ChefHat size={64} />
              <p className="font-doodle text-2xl mt-4">No active orders. Time for a chai break! ☕</p>
              <p className="font-sans text-sm mt-2">(Orders placed will appear here instantly)</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default KitchenDashboard;
