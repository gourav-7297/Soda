import React, { useState } from 'react';
import { DrinkVariant } from '../types/drink';
import { Star, CheckCircle, Quote, Sparkles } from 'lucide-react';

interface ReviewsSectionProps {
  currentVariant: DrinkVariant;
  isDarkMode: boolean;
}

const PRESS_LOGOS = [
  { name: 'VOGUE', quote: '“The chic, prebiotic soda taking over the wellness world.”' },
  { name: 'THE NEW YORK TIMES', quote: '“A fizzy drink with real digestive science behind every bubble.”' },
  { name: 'FORBES', quote: '“Disrupting the $40B soda industry with plant-powered fiber.”' },
  { name: 'BON APPÉTIT', quote: '“Unbelievably delicious nostalgia without the sugar crash.”' },
];

const REVIEWS = [
  {
    author: 'Elena R.',
    location: 'Austin, TX',
    flavor: 'Cherry Soda',
    rating: 5,
    title: 'Literally tastes like childhood nostalgia!',
    body: 'I was skeptical that a soda with 9g of fiber could actually taste good. The Cherry flavor tastes better than vintage fountain cola, but my stomach feels amazing after drinking it. Ordered a 24-pack immediately.'
  },
  {
    author: 'Marcus K.',
    location: 'San Francisco, CA',
    flavor: 'Andy Grape',
    rating: 5,
    title: 'Replaced my afternoon energy drinks forever',
    body: 'The grape flavor is deeply satisfying with that crisp bite. Zero sugar crash, genuine plant ingredients, and 35 calories is unbelievable. My fridge is now exclusively Olipop.'
  },
  {
    author: 'Dr. Sarah W.',
    location: 'Chicago, IL',
    flavor: 'Lemon Ginger',
    rating: 5,
    title: 'Gastroenterologist approved',
    body: 'As a digestive health clinician, getting patients to hit their 25-30g daily fiber target is difficult. Recommending a delicious prebiotic beverage with inulin and cassava has been a complete game changer.'
  },
  {
    author: 'Julian D.',
    location: 'Brooklyn, NY',
    flavor: 'Cherry Soda',
    rating: 5,
    title: 'Cinematic taste and gorgeous can design',
    body: 'The branding, the can in your hand, and the flavor balance are top tier. You get that authentic fizzy spark without any artificial aspartame aftertaste. 10/10.'
  }
];

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  currentVariant,
  isDarkMode
}) => {
  const [filterRating, setFilterRating] = useState<number>(0);

  return (
    <section
      id="reviews"
      className={`relative py-32 border-t transition-colors duration-500 overflow-hidden ${
        isDarkMode
          ? 'bg-[#0a0a0a] text-white border-zinc-900'
          : 'bg-[#f8f8f8] text-zinc-900 border-zinc-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-[0.25em] font-semibold mb-4 border border-zinc-800 bg-zinc-900/60">
              <Sparkles className="w-3.5 h-3.5" style={{ color: currentVariant.themeColor }} />
              <span>Social Proof & Press</span>
            </div>

            <h2 className="font-display text-4xl sm:text-5xl font-black uppercase tracking-tight">
              Loved By Sippers.
              <br />
              <span style={{ color: currentVariant.themeColor }}>
                Praised By Scientists.
              </span>
            </h2>

            <p className="text-zinc-400 text-base mt-4 leading-relaxed">
              Join over 1.2 million happy subscribers enjoying gut-friendly botanical soda every single day.
            </p>
          </div>

          {/* Overall Rating Pill */}
          <div className="p-6 rounded-3xl border border-zinc-800 bg-zinc-950/80 flex items-center gap-6 shadow-xl">
            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <span className="font-display text-3xl font-black text-white">4.9 / 5.0</span>
            </div>
            <div className="w-[1px] h-12 bg-zinc-800" />
            <div className="text-xs font-mono text-zinc-400">
              <span className="font-bold text-white block text-sm">45,000+ Reviews</span>
              <span>Verified Buyers Worldwide</span>
            </div>
          </div>
        </div>

        {/* Press Quotes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          {PRESS_LOGOS.map((press) => (
            <div
              key={press.name}
              className={`p-6 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                isDarkMode
                  ? 'bg-zinc-950/50 border-zinc-800/80 hover:border-zinc-700'
                  : 'bg-white border-zinc-200 shadow-sm'
              }`}
            >
              <Quote className="w-5 h-5 text-zinc-600 mb-3" />
              <p className="text-xs text-zinc-300 font-sans italic leading-relaxed mb-6">
                {press.quote}
              </p>
              <div className="font-display text-xs font-black tracking-[0.2em] text-zinc-400 uppercase pt-3 border-t border-zinc-800">
                {press.name}
              </div>
            </div>
          ))}
        </div>

        {/* Customer Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {REVIEWS.map((rev, i) => (
            <div
              key={i}
              className={`p-8 rounded-3xl border transition-all duration-300 hover:-translate-y-1 ${
                isDarkMode
                  ? 'bg-zinc-950/80 border-zinc-800 hover:border-zinc-700 shadow-lg'
                  : 'bg-white border-zinc-200 hover:border-zinc-300 shadow-md'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(rev.rating)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <div className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Verified Buyer</span>
                </div>
              </div>

              <h4 className="font-bold text-base text-white mb-2 uppercase tracking-wide">
                “{rev.title}”
              </h4>

              <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                {rev.body}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-zinc-800 text-xs font-mono">
                <div>
                  <span className="font-bold text-white block">{rev.author}</span>
                  <span className="text-zinc-500">{rev.location}</span>
                </div>
                <span
                  className="px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider"
                  style={{ backgroundColor: `${currentVariant.themeColor}20`, color: currentVariant.themeColor }}
                >
                  {rev.flavor}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

