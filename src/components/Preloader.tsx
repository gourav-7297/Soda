import React from 'react';
import { DrinkVariant } from '../types/drink';

interface PreloaderProps {
  progress: number;
  isReady: boolean;
  variant: DrinkVariant;
}

export const Preloader: React.FC<PreloaderProps> = ({ progress, isReady, variant }) => {
  if (isReady && progress >= 100) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#080808] transition-opacity duration-700 ${
        isReady ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background ambient radial glow */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full blur-[140px] opacity-25 pointer-events-none transition-colors duration-500"
        style={{ backgroundColor: variant.themeColor }}
      />

      <div className="relative z-10 flex flex-col items-center max-w-md w-full px-8 text-center">
        {/* Brand Logo */}
        <div className="flex items-center gap-2 mb-3">
          <span className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            OLI<span style={{ color: variant.themeColor }}>POP</span>
          </span>
          <span
            className="w-2.5 h-2.5 rounded-full animate-ping"
            style={{ backgroundColor: variant.themeColor }}
          />
        </div>

        <p className="text-xs tracking-[0.3em] uppercase text-zinc-400 font-medium mb-10">
          A New Kind of Functional Soda
        </p>

        {/* Loading Bar Container */}
        <div className="w-full bg-zinc-900/90 rounded-full h-2 p-0.5 border border-zinc-800 shadow-inner mb-4 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-200 ease-out shadow-lg"
            style={{
              width: `${Math.min(100, Math.max(0, progress))}%`,
              backgroundColor: variant.themeColor,
              boxShadow: `0 0 16px ${variant.themeColor}`
            }}
          />
        </div>

        {/* Percentage Indicator */}
        <div className="flex items-center justify-between w-full text-xs font-mono text-zinc-400">
          <span className="tracking-widest uppercase">
            {variant.name} {variant.subtitle}
          </span>
          <span className="font-bold text-white tracking-wider">
            Loading {progress}%
          </span>
        </div>

        <div className="mt-8 flex items-center gap-2 text-[11px] text-zinc-500 font-mono">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Synchronizing cinematic WebP sequence ({variant.frameCount} frames)</span>
        </div>
      </div>
    </div>
  );
};

