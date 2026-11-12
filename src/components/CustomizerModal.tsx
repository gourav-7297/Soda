import React, { useState } from 'react';
import { DrinkVariant } from '../types/drink';
import { X, Plus, Trash2, RotateCcw, Check, Palette, Sparkles, SlidersHorizontal, Image as ImageIcon } from 'lucide-react';
import { INITIAL_VARIANTS } from '../data/variants';

interface CustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  variants: DrinkVariant[];
  currentVariantIndex: number;
  onSelectVariant: (index: number) => void;
  onUpdateVariant: (index: number, updated: Partial<DrinkVariant>) => void;
  onAddVariant: (newVariant: DrinkVariant) => void;
  onDeleteVariant: (index: number) => void;
  onResetDefaults: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

const PRESET_COLORS = [
  { name: 'Cherry Red', hex: '#E50914' },
  { name: 'Andy Purple', hex: '#A855F7' },
  { name: 'Lemon Citrus', hex: '#EAB308' },
  { name: 'Vintage Cola', hex: '#D97706' },
  { name: 'Electric Cyan', hex: '#06B6D4' },
  { name: 'Neon Lime', hex: '#22C55E' },
  { name: 'Berry Punch', hex: '#EC4899' },
  { name: 'Monochrome White', hex: '#FFFFFF' }
];

export const CustomizerModal: React.FC<CustomizerModalProps> = ({
  isOpen,
  onClose,
  variants,
  currentVariantIndex,
  onSelectVariant,
  onUpdateVariant,
  onAddVariant,
  onDeleteVariant,
  onResetDefaults,
  isDarkMode,
  onToggleTheme
}) => {
  const [activeTab, setActiveTab] = useState<'current' | 'all' | 'theme'>('current');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const current = variants[currentVariantIndex] || variants[0];

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleCreateNewFlavor = () => {
    const newId = `flavor-${Date.now()}`;
    const newVariant: DrinkVariant = {
      id: newId,
      name: 'NEW FLAVOR',
      subtitle: 'CRAFT SODA',
      description: 'A crisp, botanical refresher made with natural fruit essence and sparkling prebiotics.',
      themeColor: '#06B6D4',
      themeGlow: 'rgba(6, 182, 212, 0.45)',
      mode: 'dark',
      frameCount: 94,
      bucketName: 'cherry', // default to working bucket or custom URL
      posterUrl: 'https://placehold.co/1920x1080/frame_0001/FFFFFF/webp',
      badge: 'LIMITED EDITION',
      calories: 35,
      sugar: '3g',
      fiber: '9g'
    };
    onAddVariant(newVariant);
    onSelectVariant(variants.length);
    triggerToast('Added new custom drink variant!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md animate-fade-in">
      <div
        className={`relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden transition-all duration-300 ${
          isDarkMode
            ? 'bg-[#111111] text-white border-zinc-800'
            : 'bg-white text-zinc-900 border-zinc-200'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800/80">
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-xl"
              style={{ backgroundColor: `${current.themeColor}22`, color: current.themeColor }}
            >
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold tracking-tight">
                Brand & Drink Customizer
              </h2>
              <p className="text-xs text-zinc-400">
                Live edit drink names, descriptions, colors, mode & WebP sequences
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800/50 transition-colors"
            aria-label="Close customizer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-800/80 px-6 bg-zinc-950/40">
          <button
            onClick={() => setActiveTab('current')}
            className={`py-3 px-4 text-xs font-mono uppercase tracking-wider font-bold transition-all border-b-2 ${
              activeTab === 'current'
                ? 'border-white text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
            style={activeTab === 'current' ? { borderColor: current.themeColor, color: current.themeColor } : {}}
          >
            Active Drink ({current.name})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`py-3 px-4 text-xs font-mono uppercase tracking-wider font-bold transition-all border-b-2 ${
              activeTab === 'all'
                ? 'border-white text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            All Variants ({variants.length})
          </button>
          <button
            onClick={() => setActiveTab('theme')}
            className={`py-3 px-4 text-xs font-mono uppercase tracking-wider font-bold transition-all border-b-2 ${
              activeTab === 'theme'
                ? 'border-white text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Theme & Appearance
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: CURRENT DRINK EDITOR */}
          {activeTab === 'current' && (
            <div className="space-y-5">
              {/* Drink Selector Pill Row */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                  Select Drink To Edit
                </label>
                <div className="flex flex-wrap gap-2">
                  {variants.map((v, i) => (
                    <button
                      key={v.id}
                      onClick={() => onSelectVariant(i)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase transition-all flex items-center gap-2 border ${
                        i === currentVariantIndex
                          ? 'border-white text-white bg-white/10 shadow-md'
                          : 'border-zinc-700/60 text-zinc-400 hover:border-zinc-500'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: v.themeColor }} />
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Drink Name & Subtitle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                    Drink Name (e.g. Coca Cola, Cherry)
                  </label>
                  <input
                    type="text"
                    value={current.name}
                    onChange={(e) => onUpdateVariant(currentVariantIndex, { name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-sm focus:outline-none focus:border-zinc-400 font-bold uppercase tracking-wider"
                    placeholder="CHERRY"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                    Subtitle Line (e.g. Soda, Cola)
                  </label>
                  <input
                    type="text"
                    value={current.subtitle}
                    onChange={(e) => onUpdateVariant(currentVariantIndex, { subtitle: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-sm focus:outline-none focus:border-zinc-400 uppercase tracking-wider"
                    placeholder="SODA"
                  />
                </div>
              </div>

              {/* Description (1-3 sentences) */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                  Drink Description (1–3 sentences)
                </label>
                <textarea
                  rows={3}
                  value={current.description}
                  onChange={(e) => onUpdateVariant(currentVariantIndex, { description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-sm focus:outline-none focus:border-zinc-400 leading-relaxed resize-none"
                  placeholder="A modern take on a classic soda with a perfect blend of sweet and tart..."
                />
              </div>

              {/* Theme Color (Brand Accent) */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2 flex items-center justify-between">
                  <span>Theme Color (Brand Accent)</span>
                  <span className="font-mono text-zinc-500">{current.themeColor}</span>
                </label>
                
                {/* Preset Swatches */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c.name}
                      onClick={() =>
                        onUpdateVariant(currentVariantIndex, {
                          themeColor: c.hex,
                          themeGlow: `${c.hex}66`
                        })
                      }
                      className={`w-7 h-7 rounded-full transition-transform hover:scale-110 flex items-center justify-center border ${
                        current.themeColor.toLowerCase() === c.hex.toLowerCase()
                          ? 'border-white ring-2 ring-white/50 scale-110'
                          : 'border-white/20'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    >
                      {current.themeColor.toLowerCase() === c.hex.toLowerCase() && (
                        <Check className="w-3.5 h-3.5 text-black drop-shadow" />
                      )}
                    </button>
                  ))}
                  
                  {/* Custom Color Input */}
                  <div className="flex items-center gap-2 ml-2">
                    <input
                      type="color"
                      value={current.themeColor}
                      onChange={(e) =>
                        onUpdateVariant(currentVariantIndex, {
                          themeColor: e.target.value,
                          themeGlow: `${e.target.value}66`
                        })
                      }
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-none"
                      title="Custom Color Picker"
                    />
                    <span className="text-xs font-mono text-zinc-400">Custom</span>
                  </div>
                </div>
              </div>

              {/* WebP Frame Sequence Configuration */}
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-300 font-bold">
                  <ImageIcon className="w-4 h-4 text-zinc-400" />
                  <span>WebP Parallax Sequence Configuration</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
                      Bucket / Sequence Base
                    </label>
                    <select
                      value={current.bucketName}
                      onChange={(e) => onUpdateVariant(currentVariantIndex, { bucketName: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-white"
                    >
                      <option value="cherry">Cherry Bucket (hvbjnuwdbwwgetjdglpc/cherry)</option>
                      <option value="Grapes">Grape Bucket (hvbjnuwdbwwgetjdglpc/Grapes)</option>
                      <option value="lemon">Lemon Bucket (hvbjnuwdbwwgetjdglpc/lemon)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
                      Frame Count
                    </label>
                    <input
                      type="number"
                      min={10}
                      max={240}
                      value={current.frameCount}
                      onChange={(e) => onUpdateVariant(currentVariantIndex, { frameCount: parseInt(e.target.value) || 94 })}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
                    Custom WebP URL Pattern (Optional override with &#123;index&#125; or &#123;pad4&#125;)
                  </label>
                  <input
                    type="text"
                    value={current.customSequenceUrlPattern || ''}
                    onChange={(e) => onUpdateVariant(currentVariantIndex, { customSequenceUrlPattern: e.target.value || undefined })}
                    placeholder="e.g. https://placehold.co/1920x1080/frame_{pad4}/FFFFFF/webp"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-xs text-zinc-300 font-mono"
                  />
                  <p className="text-[10px] text-zinc-500 mt-1">
                    Leave blank to use the pre-configured high-definition Supabase 3D WebP sequence.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ALL VARIANTS LIST */}
          {activeTab === 'all' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-zinc-400">
                  {variants.length} Registered Drink Flavors
                </span>
                <button
                  onClick={handleCreateNewFlavor}
                  className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white text-black hover:bg-zinc-200 transition-colors flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Variant</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {variants.map((v, idx) => (
                  <div
                    key={v.id}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                      idx === currentVariantIndex
                        ? 'bg-zinc-900/90 border-zinc-600 ring-1 ring-white/20'
                        : 'bg-zinc-950/40 border-zinc-800/80 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center font-display font-black text-sm text-black"
                        style={{ backgroundColor: v.themeColor }}
                      >
                        0{idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm uppercase tracking-wide text-white">
                            {v.name}
                          </span>
                          <span className="text-xs font-light text-zinc-400 uppercase">
                            {v.subtitle}
                          </span>
                          {idx === currentVariantIndex && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-500 truncate max-w-sm">
                          {v.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          onSelectVariant(idx);
                          setActiveTab('current');
                        }}
                        className="px-3 py-1 rounded-full text-xs font-mono font-semibold text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 transition-colors"
                      >
                        Edit
                      </button>

                      {variants.length > 1 && (
                        <button
                          onClick={() => onDeleteVariant(idx)}
                          className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                          title="Delete variant"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: THEME & APPEARANCE */}
          {activeTab === 'theme' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-2">
                  Display Mode
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      if (!isDarkMode) onToggleTheme();
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      isDarkMode
                        ? 'bg-zinc-900 border-white ring-2 ring-white/20'
                        : 'bg-zinc-950 border-zinc-800 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-white">Dark Mode</span>
                      {isDarkMode && <Check className="w-4 h-4 text-emerald-400" />}
                    </div>
                    <p className="text-xs text-zinc-400">
                      Black & charcoal backgrounds with bright typography and high-contrast glow.
                    </p>
                  </button>

                  <button
                    onClick={() => {
                      if (isDarkMode) onToggleTheme();
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      !isDarkMode
                        ? 'bg-zinc-100 text-black border-black ring-2 ring-black/20'
                        : 'bg-zinc-950 border-zinc-800 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm">Light Mode</span>
                      {!isDarkMode && <Check className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <p className="text-xs text-zinc-500">
                      Off-white clean studio backdrop with crisp dark typography.
                    </p>
                  </button>
                </div>
              </div>

              {/* Reset Defaults */}
              <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                    Reset Factory Defaults
                  </h4>
                  <p className="text-xs text-zinc-500">
                    Restores original Olipop Cherry, Grape & Lemon configurations.
                  </p>
                </div>

                <button
                  onClick={() => {
                    onResetDefaults();
                    triggerToast('Reset to original Olipop flavors!');
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider font-semibold text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 flex items-center gap-2 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-800 flex items-center justify-between bg-zinc-950/60">
          <div className="text-xs text-zinc-500">
            {toastMessage ? (
              <span className="text-emerald-400 font-mono font-bold animate-pulse">
                ✓ {toastMessage}
              </span>
            ) : (
              <span>All changes take effect immediately in real-time.</span>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest bg-white text-black hover:bg-zinc-200 transition-colors shadow-lg"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

