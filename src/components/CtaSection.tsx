import React, { useState } from 'react';
import { DrinkVariant } from '../types/drink';
import { ShoppingBag, Truck, ShieldCheck, Sparkles, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CtaSectionProps {
  currentVariant: DrinkVariant;
  onAddToCart: () => void;
  isDarkMode: boolean;
}

export const CtaSection: React.FC<CtaSectionProps> = ({
  currentVariant,
  onAddToCart,
  isDarkMode
}) => {
  const [selectedPack, setSelectedPack] = useState<'12' | '24'>('12');
  const [isSubscribe, setIsSubscribe] = useState<boolean>(true);

  const handleCtaClick = (e: React.MouseEvent) => {
    onAddToCart();
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 55,
      spread: 70,
      origin: { x, y },
      colors: ['#A855F7', '#ffffff', '#E50914', '#EAB308']
    });
  };

  const basePrice = selectedPack === '12' ? 35.99 : 64.99;
  const finalPrice = isSubscribe ? (basePrice * 0.85).toFixed(2) : basePrice.toFixed(2);

  return (
    <section
      id="contact"
      className={`relative py-32 border-t transition-colors duration-500 overflow-hidden ${
        isDarkMode
          ? 'bg-[#060606] text-white border-zinc-900'
          : 'bg-[#ffffff] text-zinc-900 border-zinc-200'
      }`}
    >
      {/* Background ambient radial glow */}
      <div
        className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[180px] opacity-25 pointer-events-none"
        style={{ backgroundColor: '#9333EA' }}
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* ================= LEFT: SQUARE CTA PRODUCT IMAGE ================= */}
          {/* Rendered Andy Grape Soda can on monochrome purple studio gradient surrounded by glossy grapes */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative group w-full max-w-lg aspect-square rounded-3xl overflow-hidden shadow-2xl border-2 border-purple-500/30 transition-transform duration-500 hover:scale-[1.02]">
              
              {/* Product Image Tag loading the custom pop-art graphic */}
              <img
                src="/grape-soda-cta.jpg"
                alt="Andy Grape Soda Can centered on bold monochrome purple studio gradient surrounded by glossy grapes"
                className="w-full h-full object-cover select-none"
                loading="lazy"
              />

              {/* Floating Pop-art Badge */}
              <div className="absolute top-6 left-6 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-mono font-bold tracking-widest uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                <span>ANDY GRAPE SODA</span>
              </div>

              {/* Nutrition Highlight Floating Pill */}
              <div className="absolute bottom-6 right-6 px-4 py-2 rounded-2xl bg-black/70 backdrop-blur-md border border-white/20 text-white text-xs font-mono">
                <span className="text-purple-300 font-bold">35 CAL</span> • <span>4g SUGAR</span> • <span>9g FIBER</span>
              </div>
            </div>
          </div>

          {/* ================= RIGHT: HEADLINE, DETAILS & CTA BUTTONS ================= */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-[0.25em] font-semibold mb-4 border border-purple-800 bg-purple-950/40 text-purple-300">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Limited Drop • Fresh Batch</span>
              </div>

              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-[1.05]">
                Taste The Future
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-300 to-white">
                  Of Cold Soda.
                </span>
              </h2>

              <p className="text-zinc-300 text-base sm:text-lg mt-4 leading-relaxed font-sans">
                Say goodbye to sugar crashes and empty chemicals. Upgrade your fridge with crisp, gut-loving Andy Grape, Cherry, and Lemon Ginger delivered cold straight to your door.
              </p>
            </div>

            {/* Pack Size Selector */}
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 block">
                Select Pack Size:
              </span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedPack('12')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    selectedPack === '12'
                      ? 'bg-zinc-900 border-purple-500 ring-2 ring-purple-500/30'
                      : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-white">12-Pack Case</span>
                    {selectedPack === '12' && <Check className="w-4 h-4 text-purple-400" />}
                  </div>
                  <span className="text-xs font-mono text-zinc-400">$3.00 / can</span>
                </button>

                <button
                  onClick={() => setSelectedPack('24')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    selectedPack === '24'
                      ? 'bg-zinc-900 border-purple-500 ring-2 ring-purple-500/30'
                      : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">24-Pack Party</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">
                        BEST VALUE
                      </span>
                    </div>
                    {selectedPack === '24' && <Check className="w-4 h-4 text-purple-400" />}
                  </div>
                  <span className="text-xs font-mono text-zinc-400">$2.70 / can</span>
                </button>
              </div>
            </div>

            {/* Subscribe & Save Toggle */}
            <div
              onClick={() => setIsSubscribe(!isSubscribe)}
              className="p-4 rounded-2xl border border-purple-900/60 bg-purple-950/20 flex items-center justify-between cursor-pointer transition-colors hover:border-purple-700"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={isSubscribe}
                  onChange={() => {}}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 bg-zinc-900 border-zinc-700 cursor-pointer"
                />
                <div>
                  <span className="font-bold text-sm text-white block">
                    Subscribe & Save 15% (Most Popular)
                  </span>
                  <span className="text-xs text-zinc-400">
                    Delivered every 30 days. Swap flavors or cancel anytime.
                  </span>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-purple-300">
                SAVE 15%
              </span>
            </div>

            {/* Price & CTA Buttons */}
            <div className="space-y-4 pt-2">
              <div className="flex items-baseline gap-3">
                <span className="font-display text-4xl font-black text-white">
                  ${finalPrice}
                </span>
                {isSubscribe && (
                  <span className="font-mono text-sm text-zinc-500 line-through">
                    ${basePrice.toFixed(2)}
                  </span>
                )}
                <span className="text-xs font-mono text-emerald-400 font-semibold">
                  Free 2-Day Refrigerated Shipping
                </span>
              </div>

              {/* Dual CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <button
                  onClick={handleCtaClick}
                  className="w-full sm:w-auto flex-1 px-8 py-4 rounded-full text-sm font-bold tracking-[0.2em] uppercase text-black bg-white hover:bg-zinc-200 active:scale-95 transition-all duration-200 shadow-2xl flex items-center justify-center gap-2 group"
                  style={{
                    boxShadow: '0 8px 30px -4px rgba(168, 85, 247, 0.4)'
                  }}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>ADD TO CART</span>
                  <span className="w-2 h-2 rounded-full bg-purple-600 group-hover:scale-125 transition-transform" />
                </button>

                <button
                  onClick={handleCtaClick}
                  className="w-full sm:w-auto px-8 py-4 rounded-full text-sm font-bold tracking-[0.2em] uppercase text-white bg-transparent border-2 border-white/40 hover:border-white hover:bg-white/10 active:scale-95 transition-all duration-200 backdrop-blur-sm"
                >
                  BUILD VARIETY PACK
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-zinc-800 grid grid-cols-3 gap-4 text-center text-xs font-mono text-zinc-400">
              <div className="flex flex-col items-center gap-1.5">
                <Truck className="w-4 h-4 text-purple-400" />
                <span>Cold-Chain Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>100% Love Guarantee</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Microbiome Tested</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

