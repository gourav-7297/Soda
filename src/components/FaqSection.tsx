import React, { useState } from 'react';
import { DrinkVariant } from '../types/drink';
import { Plus, Minus, HelpCircle, Sparkles } from 'lucide-react';

interface FaqSectionProps {
  currentVariant: DrinkVariant;
  isDarkMode: boolean;
}

const FAQS = [
  {
    question: 'Does Olipop need to be refrigerated?',
    answer: 'Yes! Because Olipop is made with real fruit juices and living botanical extracts without harsh chemical preservatives, we recommend keeping your cans chilled in the refrigerator for the best taste and optimal botanical integrity.'
  },
  {
    question: 'How much prebiotic fiber is inside each can?',
    answer: 'Every 12 fl oz can provides 9 grams of dietary prebiotic fiber, which equals 32% of your recommended daily fiber intake. The fiber comes from cassava root, chicory root inulin, and Jerusalem artichoke.'
  },
  {
    question: 'What sweeteners do you use?',
    answer: 'We only use authentic whole-food sweeteners: fresh-pressed fruit juices, cassava root fiber, sweet blackberry leaf, and a delicate touch of organic stevia leaf extract. We never use high-fructose corn syrup, aspartame, sucralose, or sugar alcohols like erythritol.'
  },
  {
    question: 'What makes Olipop different from other sodas?',
    answer: 'Traditional sodas pack 39+ grams of corn syrup with zero nutrition. Olipop was formulated with top digestive health scientists to deliver delicious nostalgia along with our proprietary OLISMART® botanical matrix, feeding the microbiome in your gut.'
  },
  {
    question: 'Can children and pregnant women drink Olipop?',
    answer: 'Yes! Our ingredients are clean, plant-based, and non-GMO verified. Many parents use Olipop as a delicious, healthy alternative to sugary soft drinks. If you have specific dietary concerns during pregnancy, we recommend showing the ingredients to your doctor.'
  },
  {
    question: 'How does subscription and shipping work?',
    answer: 'You can subscribe to your favorite flavors or build a custom 12-pack variety bundle. Subscribers save 15% on every shipment, receive free door-to-door delivery, and can skip, swap flavors, or cancel anytime with one click.'
  }
];

export const FaqSection: React.FC<FaqSectionProps> = ({
  currentVariant,
  isDarkMode
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section
      id="faq"
      className={`relative py-32 border-t transition-colors duration-500 ${
        isDarkMode
          ? 'bg-[#080808] text-white border-zinc-900'
          : 'bg-[#fafafa] text-zinc-900 border-zinc-200'
      }`}
    >
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-[0.25em] font-semibold mb-4 border border-zinc-800 bg-zinc-900/60">
            <Sparkles className="w-3.5 h-3.5" style={{ color: currentVariant.themeColor }} />
            <span>Frequently Asked Questions</span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl font-black uppercase tracking-tight">
            Got Questions?
            <br />
            <span style={{ color: currentVariant.themeColor }}>
              We’ve Got The Answers.
            </span>
          </h2>

          <p className="text-zinc-400 text-base mt-4 leading-relaxed">
            Everything you need to know about our ingredients, gut health benefits, and shipping.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? isDarkMode
                      ? 'bg-zinc-900/90 border-zinc-700 shadow-xl'
                      : 'bg-white border-zinc-300 shadow-md'
                    : isDarkMode
                    ? 'bg-zinc-950/40 border-zinc-800/80 hover:border-zinc-700'
                    : 'bg-white/60 border-zinc-200 hover:border-zinc-300'
                }`}
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="font-display text-base sm:text-lg font-bold uppercase tracking-wide text-white">
                    {faq.question}
                  </span>

                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                      isOpen
                        ? 'bg-white text-black rotate-180 shadow'
                        : 'bg-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                    style={isOpen ? { backgroundColor: currentVariant.themeColor, color: '#000000' } : {}}
                  >
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-zinc-300 leading-relaxed border-t border-zinc-800/50 animate-fade-in font-sans">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

