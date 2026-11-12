import React from 'react';
import { DrinkVariant } from '../types/drink';
import { X, ShoppingBag, Plus, Minus, ArrowRight, Truck } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentVariant: DrinkVariant;
  cartCount: number;
  onUpdateCartCount: (count: number) => void;
  isDarkMode: boolean;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  currentVariant,
  cartCount,
  onUpdateCartCount,
  isDarkMode
}) => {
  if (!isOpen) return null;

  const itemPrice = 3.25;
  const subtotal = cartCount * itemPrice;
  const freeShippingThreshold = 40;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className={`w-full max-w-md h-full flex flex-col border-l shadow-2xl transition-all duration-300 ${
          isDarkMode
            ? 'bg-[#111111] text-white border-zinc-800'
            : 'bg-white text-zinc-900 border-zinc-200'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" style={{ color: currentVariant.themeColor }} />
            <h3 className="font-display text-lg font-bold uppercase tracking-wider">
              Your Cold Cart ({cartCount})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div className="p-4 bg-zinc-950/60 border-b border-zinc-800/80">
          <div className="flex items-center gap-2 text-xs font-mono mb-2">
            <Truck className="w-4 h-4 text-emerald-400" />
            {subtotal >= freeShippingThreshold ? (
              <span className="text-emerald-400 font-bold">You unlocked Free Refrigerated Shipping!</span>
            ) : (
              <span>Add ${(freeShippingThreshold - subtotal).toFixed(2)} more for Free Shipping</span>
            )}
          </div>
          <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cartCount > 0 ? (
            <div className="flex items-center justify-between p-4 rounded-2xl border border-zinc-800 bg-zinc-900/60">
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-display font-black text-sm text-black"
                  style={{ backgroundColor: currentVariant.themeColor }}
                >
                  CAN
                </div>
                <div>
                  <h4 className="font-bold text-sm uppercase text-white">
                    {currentVariant.name} {currentVariant.subtitle}
                  </h4>
                  <p className="text-xs font-mono text-zinc-400">
                    12 fl oz • 35 Cal • ${itemPrice.toFixed(2)} each
                  </p>
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="flex items-center gap-2 border border-zinc-700 rounded-full px-2 py-1 bg-zinc-950">
                <button
                  onClick={() => onUpdateCartCount(Math.max(0, cartCount - 1))}
                  className="p-1 text-zinc-400 hover:text-white"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="font-mono text-xs font-bold px-1 text-white">
                  {cartCount}
                </span>
                <button
                  onClick={() => onUpdateCartCount(cartCount + 1)}
                  className="p-1 text-zinc-400 hover:text-white"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-zinc-500 font-mono text-xs">
              <p>Your cart is empty.</p>
              <p className="mt-2 text-zinc-400">Add an ice cold Olipop can to get started!</p>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {cartCount > 0 && (
          <div className="p-6 border-t border-zinc-800 bg-zinc-950 space-y-4">
            <div className="flex items-center justify-between text-sm font-mono">
              <span className="text-zinc-400">Subtotal:</span>
              <span className="font-bold text-lg text-white font-display">
                ${subtotal.toFixed(2)}
              </span>
            </div>

            <button
              onClick={() => alert('Proceeding to Checkout! (Demo Store)')}
              className="w-full py-4 rounded-full text-sm font-bold tracking-[0.2em] uppercase text-black bg-white hover:bg-zinc-200 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl"
            >
              <span>CHECKOUT NOW</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[11px] font-mono text-center text-zinc-500">
              Tax calculated at checkout. Cold insulated packing included.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

