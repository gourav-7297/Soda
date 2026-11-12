import React from 'react';
import { DrinkVariant } from '../types/drink';
import { Sparkles, ShieldCheck, HeartPulse, Leaf } from 'lucide-react';
import { CherryAnimationShowcase } from './CherryAnimationShowcase';

interface ProductSectionProps {
  currentVariant: DrinkVariant;
  allVariants: DrinkVariant[];
  onSelectVariant: (index: number) => void;
  onAddToCart: () => void;
  isDarkMode: boolean;
}

export const ProductSection: React.FC<ProductSectionProps> = ({
  currentVariant,
  allVariants,
  onSelectVariant,
  onAddToCart,
  isDarkMode
}) => {
  return (
    <section
      id="product"
      className={`relative py-32 border-t transition-colors duration-500 overflow-hidden ${
        isDarkMode
          ? 'bg-[#080808] text-white border-zinc-900'
          : 'bg-[#fafafa] text-zinc-900 border-zinc-200'
      }`}
    >
      {/* Background Subtle Grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-[0.25em] font-semibold mb-4 border border-zinc-800 bg-zinc-900/50">
            <Sparkles className="w-3.5 h-3.5" style={{ color: currentVariant.themeColor }} />
            <span>A New Kind of Soda</span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[1.05]">
            Nostalgic Flavor.
            <br />
            <span
              className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-500"
              style={{
                textShadow: `0 0 40px ${currentVariant.themeGlow}`
              }}
            >
              Modern Functional Science.
            </span>
          </h2>

          <p className="text-zinc-400 text-base sm:text-lg mt-6 leading-relaxed">
            We spent years collaborating with world-renowned gut-health researchers to formulate a functional soda that tastes just like the iconic classics you grew up loving — made with wholesome botanicals and prebiotics instead of artificial sweeteners or syrup.
          </p>
        </div>

        {/* 3 Core Value Props Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          <div
            className={`p-8 rounded-3xl border transition-all duration-300 hover:-translate-y-1 ${
              isDarkMode
                ? 'bg-zinc-950/80 border-zinc-800/80 hover:border-zinc-600'
                : 'bg-white border-zinc-200 hover:border-zinc-400 shadow-sm'
            }`}
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6"
              style={{ backgroundColor: `${currentVariant.themeColor}20`, color: currentVariant.themeColor }}
            >
              <HeartPulse className="w-6 h-6" />
            </div>
            <h3 className="font-display text-lg font-bold uppercase tracking-wide mb-2 text-white">
              9g Prebiotic Fiber
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Every can supplies nearly a third of your recommended daily fiber to feed healthy gut microbiome bacteria and support digestive wellness.
            </p>
          </div>

          <div
            className={`p-8 rounded-3xl border transition-all duration-300 hover:-translate-y-1 ${
              isDarkMode
                ? 'bg-zinc-950/80 border-zinc-800/80 hover:border-zinc-600'
                : 'bg-white border-zinc-200 hover:border-zinc-400 shadow-sm'
            }`}
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6"
              style={{ backgroundColor: `${currentVariant.themeColor}20`, color: currentVariant.themeColor }}
            >
              <Leaf className="w-6 h-6" />
            </div>
            <h3 className="font-display text-lg font-bold uppercase tracking-wide mb-2 text-white">
              2–5g Natural Sugar
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Crafted with authentic fruit juices, cassava root, and real stevia leaf. Absolutely no high-fructose corn syrup or artificial chemical sweeteners.
            </p>
          </div>

          <div
            className={`p-8 rounded-3xl border transition-all duration-300 hover:-translate-y-1 ${
              isDarkMode
                ? 'bg-zinc-950/80 border-zinc-800/80 hover:border-zinc-600'
                : 'bg-white border-zinc-200 hover:border-zinc-400 shadow-sm'
            }`}
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6"
              style={{ backgroundColor: `${currentVariant.themeColor}20`, color: currentVariant.themeColor }}
            >
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-display text-lg font-bold uppercase tracking-wide mb-2 text-white">
              Non-GMO & Plant-Based
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Non-GMO Project Verified, certified gluten-free, 100% vegan, and paleo-friendly. Pure refreshing botanical goodness in every single sip.
            </p>
          </div>
        </div>

        {/* Current Active Flavor Tasting Profile */}
        <div
          className={`p-8 sm:p-12 rounded-3xl border relative overflow-hidden ${
            isDarkMode
              ? 'bg-gradient-to-br from-zinc-950 via-zinc-900 to-[#121212] border-zinc-800'
              : 'bg-gradient-to-br from-white via-zinc-50 to-zinc-100 border-zinc-200 shadow-xl'
          }`}
        >
          {/* Accent glow corner */}
          <div
            className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-[120px] opacity-25 pointer-events-none transition-colors duration-500"
            style={{ backgroundColor: currentVariant.themeColor }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7">
              <span
                className="text-xs font-mono font-bold tracking-[0.25em] uppercase mb-2 inline-block"
                style={{ color: currentVariant.themeColor }}
              >
                Flavor Profile Showcase
              </span>
              <h3 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white mb-4">
                {currentVariant.name} {currentVariant.subtitle}
              </h3>
              <p className="text-zinc-300 text-base leading-relaxed mb-8">
                {currentVariant.description} Experience crisp carbonation, genuine fruit essence, and a smooth finish that satisfies the sweet craving without an artificial crash.
              </p>

              {/* Tasting sensory bars */}
              <div className="space-y-4 max-w-md">
                <div>
                  <div className="flex justify-between text-xs font-mono uppercase text-zinc-400 mb-1">
                    <span>Sweetness Balance</span>
                    <span className="text-white font-bold">85%</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: '85%', backgroundColor: currentVariant.themeColor }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono uppercase text-zinc-400 mb-1">
                    <span>Tart / Tang Spark</span>
                    <span className="text-white font-bold">78%</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: '78%', backgroundColor: currentVariant.themeColor }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono uppercase text-zinc-400 mb-1">
                    <span>Crisp Carbonation</span>
                    <span className="text-white font-bold">92%</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: '92%', backgroundColor: currentVariant.themeColor }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Flavor Switcher Pills */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                Explore The Lineup:
              </span>
              {allVariants.map((v, i) => (
                <button
                  key={v.id}
                  onClick={() => onSelectVariant(i)}
                  className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all duration-200 ${
                    v.id === currentVariant.id
                      ? 'bg-zinc-800/90 border-white ring-1 ring-white/20'
                      : 'bg-zinc-950/40 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-3.5 h-3.5 rounded-full"
                      style={{ backgroundColor: v.themeColor }}
                    />
                    <div>
                      <div className="font-bold text-sm uppercase text-white">
                        {v.name} {v.subtitle}
                      </div>
                      <div className="text-[11px] text-zinc-400">
                        {v.calories} Cal • {v.sugar} Sugar • {v.fiber} Fiber
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold tracking-wider text-zinc-400">
                    0{i + 1}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dedicated Cherry 3D Motion Sequence Showcase */}
        <div className="mt-16">
          <CherryAnimationShowcase
            onAddToCart={onAddToCart}
            isDarkMode={isDarkMode}
          />
        </div>

      </div>
    </section>
  );
};

