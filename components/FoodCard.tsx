import React from 'react';
import { MenuItem } from '../types';
import { Plus } from 'lucide-react';

interface FoodCardProps {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
}

const FoodCard: React.FC<FoodCardProps> = ({ item, onAdd }) => {
  return (
    <div className="relative bg-white rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black overflow-hidden transform transition hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col h-full">
      <div className="relative h-48 w-full overflow-hidden border-b-2 border-black">
        <img 
          src={item.imageUrl} 
          alt={item.name} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute top-2 right-2 flex gap-2">
             {item.isVeg ? (
            <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full border border-green-600">
              VEG
            </span>
          ) : (
            <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded-full border border-red-600">
              NON-VEG
            </span>
          )}
          {item.isSpicy && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full border border-black animate-pulse">
              SPICY 🌶️
            </span>
          )}
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-doodle text-2xl font-bold text-ink leading-none">{item.name}</h3>
          <span className="font-sans font-bold text-lg text-primary">₹{item.price}</span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 font-sans line-clamp-2 flex-grow">{item.description}</p>
        
        <button 
          onClick={() => onAdd(item)}
          className="w-full mt-auto bg-secondary hover:bg-yellow-300 text-black font-bold py-2 px-4 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Add to Tray
        </button>
      </div>
    </div>
  );
};

export default FoodCard;
