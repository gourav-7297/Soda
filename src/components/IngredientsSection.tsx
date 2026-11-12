import React, { useState } from 'react';
import { DrinkVariant } from '../types/drink';
import { Activity, Droplet, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';

interface IngredientsSectionProps {
  currentVariant: DrinkVariant;
  isDarkMode: boolean;
}

const INGREDIENTS = [
  {
    name: 'Cassava Root Fiber',
    scientific: 'Manihot esculenta',
    category: 'Prebiotic Resistant Starch',
    description: 'A traditional prebiotic tuber that bypasses upper digestion to nourish healthy Bifidobacteria in your lower digestive tract.',
    icon: '🌱'
  },
  {
    name: 'Chicory Root Inulin',
    scientific: 'Cichorium intybus',
    category: 'Soluble Plant Fiber',
    description: 'Naturally derived plant fiber that stimulates gut motility, promotes satiety, and aids smooth digestive regulation.',
    icon: '🌾'
  },
  {
    name: 'Jerusalem Artichoke',
    scientific: 'Helianthus tuberosus',
    category: 'Microbiome Nutrient',
    description: 'A native sunflower tuber powerhouse loaded with inulin, iron, and potassium to support microbial diversity.',
    icon: '🌻'
  },
  {
    name: 'Nopal Cactus',
    scientific: 'Opuntia ficus-indica',
    category: 'Antioxidant Botanical',
    description: 'Prized in traditional herbal medicine for high levels of betalains, soluble fiber, and essential electrolytes.',
    icon: '🌵'
  },
  {
    name: 'Marshmallow Root',
    scientific: 'Althaea officinalis',
    category: 'Mucilaginous Demulcent',
    description: 'Forms a gentle, soothing mucosal protective coating across the stomach lining and intestinal wall.',
    icon: '🌿'
  },
  {
    name: 'Calendula Flower',
    scientific: 'Calendula officinalis',
    category: 'Flavonoid Botanical',
    description: 'Bright golden marigold petals historically celebrated for digestive balance and cellular antioxidant support.',
    icon: '🌼'
  },
  {
    name: 'Kudzu Root',
    scientific: 'Pueraria montana',
    category: 'Ancient Adaptogen',
    description: 'An East Asian herbal root rich in puerarin and isoflavones to help promote digestive harmony and resilience.',
    icon: '🍃'
  },
  {
    name: 'Real Fruit Juices',
    scientific: 'Tart Cherry & Meyer Lemon',
    category: 'Natural Essence',
    description: 'Fresh-pressed extracts giving authentic sweet and tart fruit notes without artificial dyes, flavorings, or preservatives.',
    icon: '🍒'
  }
];

export const IngredientsSection: React.FC<IngredientsSectionProps> = ({
  currentVariant,
  isDarkMode
}) => {
  const [selectedIngredient, setSelectedIngredient] = useState<number>(0);

  return (
    <section
      id="ingredients"
      className={`relative py-32 border-t transition-colors duration-500 ${
        isDarkMode
          ? 'bg-[#0b0b0b] text-white border-zinc-900'
          : 'bg-[#f4f4f4] text-zinc-900 border-zinc-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-[0.25em] font-semibold mb-4 border border-zinc-800 bg-zinc-900/60">
              <Sparkles className="w-3.5 h-3.5" style={{ color: currentVariant.themeColor }} />
              <span>Plant-Powered Formula</span>
            </div>

            <h2 className="font-display text-4xl sm:text-5xl font-black uppercase tracking-tight">
              Powered By The
              <br />
              <span style={{ color: currentVariant.themeColor }}>
                OLISMART® Matrix
              </span>
            </h2>

            <p className="text-zinc-400 text-base mt-4 leading-relaxed">
              Eight deeply restorative botanicals and microbiome-feeding plant fibers engineered by gut health pioneers to support your digestive ecosystem.
            </p>
          </div>

          <div className="flex items-center gap-6 font-mono text-xs text-zinc-400 border border-zinc-800 rounded-2xl p-4 bg-zinc-950/60">
            <div>
              <span className="text-white font-bold block text-lg">8</span>
              <span>Botanicals</span>
            </div>
            <div className="w-[1px] h-8 bg-zinc-800" />
            <div>
              <span className="text-white font-bold block text-lg">9g</span>
              <span>Prebiotic Fiber</span>
            </div>
            <div className="w-[1px] h-8 bg-zinc-800" />
            <div>
              <span className="text-white font-bold block text-lg">0g</span>
              <span>Artificial Dyes</span>
            </div>
          </div>
        </div>

        {/* 2-Column Interactive Botanical Explorer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Ingredients List Selector */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {INGREDIENTS.map((item, idx) => {
              const isSelected = selectedIngredient === idx;
              return (
                <button
                  key={item.name}
                  onClick={() => setSelectedIngredient(idx)}
                  className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-zinc-800/90 border-white ring-1 ring-white/20'
                      : 'bg-zinc-950/40 border-zinc-800/80 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <h4 className="font-bold text-sm text-white uppercase tracking-wide">
                        {item.name}
                      </h4>
                      <p className="text-[11px] font-mono text-zinc-400">
                        {item.category}
                      </p>
                    </div>
                  </div>

                  <ChevronRight
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isSelected ? 'text-white translate-x-1' : 'text-zinc-600'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Right: Detailed Active Ingredient Card */}
          <div className="lg:col-span-5">
            <div
              className={`p-8 rounded-3xl border relative overflow-hidden sticky top-28 ${
                isDarkMode
                  ? 'bg-zinc-950 border-zinc-800 shadow-2xl'
                  : 'bg-white border-zinc-200 shadow-xl'
              }`}
            >
              <div
                className="absolute top-0 right-0 w-48 h-48 rounded-full blur-[80px] opacity-20 pointer-events-none"
                style={{ backgroundColor: currentVariant.themeColor }}
              />

              <div className="text-4xl mb-4">
                {INGREDIENTS[selectedIngredient].icon}
              </div>

              <span
                className="text-xs font-mono font-bold tracking-[0.25em] uppercase"
                style={{ color: currentVariant.themeColor }}
              >
                {INGREDIENTS[selectedIngredient].category}
              </span>

              <h3 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white mt-1 mb-1">
                {INGREDIENTS[selectedIngredient].name}
              </h3>

              <p className="text-xs font-mono italic text-zinc-400 mb-6">
                Botanical binomial: {INGREDIENTS[selectedIngredient].scientific}
              </p>

              <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 mb-6 text-sm text-zinc-300 leading-relaxed">
                {INGREDIENTS[selectedIngredient].description}
              </div>

              <div className="space-y-2.5 text-xs font-mono text-zinc-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Feeds beneficial anaerobic gut microbes</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Supports short-chain fatty acid (SCFA) production</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Formulated with zero chemical artificial additives</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

