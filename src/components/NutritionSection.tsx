import React, { useState } from 'react';
import { DrinkVariant } from '../types/drink';
import { Sparkles, Check, X as XIcon, HelpCircle } from 'lucide-react';

interface NutritionSectionProps {
  currentVariant: DrinkVariant;
  isDarkMode: boolean;
}

export const NutritionSection: React.FC<NutritionSectionProps> = ({
  currentVariant,
  isDarkMode
}) => {
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  return (
    <section
      id="nutrition"
      className={`relative py-32 border-t transition-colors duration-500 ${
        isDarkMode
          ? 'bg-[#080808] text-white border-zinc-900'
          : 'bg-[#fafafa] text-zinc-900 border-zinc-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-[0.25em] font-semibold mb-4 border border-zinc-800 bg-zinc-900/60">
            <Sparkles className="w-3.5 h-3.5" style={{ color: currentVariant.themeColor }} />
            <span>Transparent Health Metrics</span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl font-black uppercase tracking-tight">
            Read The Label.
            <br />
            <span style={{ color: currentVariant.themeColor }}>
              Nothing To Hide.
            </span>
          </h2>

          <p className="text-zinc-400 text-base mt-4 leading-relaxed">
            Every can is engineered for complete transparency. Compare our clean nutritional panel to any standard grocery store soda.
          </p>
        </div>

        {/* 2-Column: Left Authentic Nutrition Label Card, Right Comparison vs Traditional Soda */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT: AUTHENTIC NUTRITION FACTS CARD */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md bg-white text-black p-6 sm:p-8 rounded-2xl shadow-2xl border-2 border-black font-sans select-none">
              
              <h3 className="font-display text-4xl font-black tracking-tight leading-none pb-1 border-b-8 border-black">
                Nutrition Facts
              </h3>

              <div className="text-xs font-semibold py-1.5 border-b border-black flex justify-between">
                <span>1 serving per container</span>
              </div>

              <div className="text-sm font-bold py-1.5 border-b-8 border-black flex justify-between items-baseline">
                <span>Serving size</span>
                <span>1 can (355 mL / 12 fl oz)</span>
              </div>

              <div className="py-2 border-b border-black">
                <span className="text-xs font-bold uppercase tracking-wider block">Amount Per Serving</span>
                <div className="flex justify-between items-baseline">
                  <span className="font-display text-4xl font-black">Calories</span>
                  <span className="font-display text-4xl font-black">{currentVariant.calories}</span>
                </div>
              </div>

              <div className="text-xs font-bold text-right py-1 border-b border-black">
                % Daily Value*
              </div>

              {/* Rows */}
              <div className="text-xs py-1.5 border-b border-zinc-300 flex justify-between">
                <div>
                  <span className="font-bold">Total Fat</span> 0g
                </div>
                <span className="font-bold">0%</span>
              </div>

              <div className="text-xs py-1.5 border-b border-zinc-300 flex justify-between">
                <div>
                  <span className="font-bold">Sodium</span> 25mg
                </div>
                <span className="font-bold">1%</span>
              </div>

              <div className="text-xs py-1.5 border-b border-zinc-300 flex justify-between">
                <div>
                  <span className="font-bold">Total Carbohydrate</span> 16g
                </div>
                <span className="font-bold">6%</span>
              </div>

              {/* HIGHLIGHTED FIBER ROW */}
              <div
                className="text-xs py-2 pl-4 pr-1 border-b-2 border-black flex justify-between font-bold"
                style={{ backgroundColor: `${currentVariant.themeColor}15` }}
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: currentVariant.themeColor }}
                  />
                  <span>Dietary Fiber {currentVariant.fiber}</span>
                </div>
                <span className="text-sm font-black">32%</span>
              </div>

              <div className="text-xs py-1.5 pl-4 border-b border-zinc-300 flex justify-between">
                <div>Total Sugars {currentVariant.sugar}</div>
                <span className="font-normal italic"></span>
              </div>

              <div className="text-xs py-1.5 pl-8 border-b border-zinc-300 flex justify-between text-zinc-700">
                <div>Includes {currentVariant.sugar} Added Sugars</div>
                <span className="font-bold">5%</span>
              </div>

              <div className="text-xs py-1.5 border-b-4 border-black flex justify-between font-bold">
                <div>Protein 0g</div>
                <span>0%</span>
              </div>

              {/* Micro Nutrients */}
              <div className="text-[11px] py-1 border-b border-zinc-300 flex justify-between text-zinc-700">
                <span>Vitamin C 0mcg 0%</span>
                <span>Calcium 30mg 2%</span>
              </div>
              <div className="text-[11px] py-1 border-b-2 border-black flex justify-between text-zinc-700">
                <span>Iron 0.4mg 2%</span>
                <span>Potassium 50mg 2%</span>
              </div>

              {/* Footnote */}
              <p className="text-[9px] leading-tight text-zinc-500 pt-2">
                *The % Daily Value (DV) tells you how much a nutrient in a serving of food contributes to a daily diet. 2,000 calories a day is used for general nutrition advice.
              </p>
            </div>
          </div>

          {/* RIGHT: COMPARISON SHOWDOWN */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span
                className="text-xs font-mono font-bold tracking-[0.25em] uppercase mb-2 inline-block"
                style={{ color: currentVariant.themeColor }}
              >
                The Modern Choice
              </span>
              <h3 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
                How We Compare To Traditional Soda
              </h3>
              <p className="text-zinc-400 text-sm sm:text-base mt-2">
                Traditional cola loads you up with high-fructose corn syrup and empty calories. Olipop delivers real plant fiber and genuine fruit refreshment.
              </p>
            </div>

            {/* Comparison Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Olipop Card */}
              <div
                className="p-6 rounded-3xl border-2 relative overflow-hidden transition-all duration-300"
                style={{
                  borderColor: currentVariant.themeColor,
                  backgroundColor: isDarkMode ? '#111111' : '#ffffff',
                  boxShadow: `0 12px 30px -10px ${currentVariant.themeGlow}`
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-display text-xl font-black text-white">
                    OLI<span style={{ color: currentVariant.themeColor }}>POP</span>
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold uppercase">
                    FUNCTIONAL
                  </span>
                </div>

                <div className="space-y-3.5 text-xs font-mono">
                  <div className="flex items-center justify-between py-1 border-b border-zinc-800">
                    <span className="text-zinc-400">Calories:</span>
                    <span className="font-bold text-white text-sm">35 CAL</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-zinc-800">
                    <span className="text-zinc-400">Sugar:</span>
                    <span className="font-bold text-emerald-400 text-sm">2–5g Natural</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-zinc-800">
                    <span className="text-zinc-400">Prebiotic Fiber:</span>
                    <span className="font-bold text-emerald-400 text-sm">9g Plant Fiber</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-zinc-800">
                    <span className="text-zinc-400">Botanicals:</span>
                    <span className="font-bold text-white text-sm">8 Real Plants</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-zinc-400">Sweeteners:</span>
                    <span className="font-bold text-white text-sm">Real Stevia Leaf</span>
                  </div>
                </div>
              </div>

              {/* Traditional Soda Card */}
              <div
                className={`p-6 rounded-3xl border transition-all duration-300 ${
                  isDarkMode
                    ? 'bg-zinc-950/60 border-zinc-800 text-zinc-400'
                    : 'bg-zinc-100 border-zinc-300 text-zinc-600'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-display text-xl font-bold uppercase tracking-wider text-zinc-400">
                    Traditional Soda
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-bold uppercase">
                    LEGACY
                  </span>
                </div>

                <div className="space-y-3.5 text-xs font-mono">
                  <div className="flex items-center justify-between py-1 border-b border-zinc-800/60">
                    <span>Calories:</span>
                    <span className="font-bold text-rose-400 text-sm">150 CAL</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-zinc-800/60">
                    <span>Sugar:</span>
                    <span className="font-bold text-rose-400 text-sm">39g (High Fructose)</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-zinc-800/60">
                    <span>Prebiotic Fiber:</span>
                    <span className="font-bold text-zinc-500 text-sm">0g</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-zinc-800/60">
                    <span>Botanicals:</span>
                    <span className="font-bold text-zinc-500 text-sm">None (Synthetic)</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span>Sweeteners:</span>
                    <span className="font-bold text-rose-400 text-sm">Corn Syrup / Aspartame</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Digestibility Guarantee */}
            <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800 flex items-center gap-3 text-xs text-zinc-400">
              <span className="text-emerald-400 font-bold text-base">✓</span>
              <span>
                Backed by double-blind clinical gut microbiome trials conducted with Purdue University and Baylor College of Medicine.
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

