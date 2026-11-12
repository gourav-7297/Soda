import React, { useRef, useEffect, useState, useCallback } from 'react';
import { DrinkVariant } from '../types/drink';
import { ChevronUp, ChevronDown, Loader2, Play, Pause } from 'lucide-react';
import confetti from 'canvas-confetti';

interface HeroSectionProps {
  currentVariant: DrinkVariant;
  variantIndex: number;
  totalVariants: number;
  onPrevVariant: () => void;
  onNextVariant: () => void;
  getFrame: (frameIndex: number) => HTMLImageElement | null;
  isSwitchingVariant: boolean;
  onAddToCart: () => void;
  isDarkMode: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentVariant,
  variantIndex,
  totalVariants,
  onPrevVariant,
  onNextVariant,
  getFrame,
  isSwitchingVariant,
  onAddToCart,
  isDarkMode
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Current interpolated frame for smooth rendering
  const currentFrameRef = useRef<number>(0);
  const targetFrameRef = useRef<number>(0);
  const animationFrameIdRef = useRef<number | null>(null);

  // 360 Auto-Play state
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const isAutoPlayingRef = useRef<boolean>(false);
  isAutoPlayingRef.current = isAutoPlaying;

  // Text fade-in / fade-out animation state
  const [textVisible, setTextVisible] = useState<boolean>(true);
  const [displayedVariant, setDisplayedVariant] = useState<DrinkVariant>(currentVariant);
  const [displayedIndex, setDisplayedIndex] = useState<number>(variantIndex);

  // Handle smooth text transition when variant changes
  useEffect(() => {
    setTextVisible(false);
    const timeout = setTimeout(() => {
      setDisplayedVariant(currentVariant);
      setDisplayedIndex(variantIndex);
      setTextVisible(true);
    }, 280);

    return () => clearTimeout(timeout);
  }, [currentVariant.id, variantIndex]);

  // Main Canvas render loop with smooth frame interpolation (LERP)
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (isAutoPlayingRef.current) {
      targetFrameRef.current = (targetFrameRef.current + 0.35) % currentVariant.frameCount;
    }

    // Smooth lerp towards target frame
    const diff = targetFrameRef.current - currentFrameRef.current;
    if (Math.abs(diff) > 0.01) {
      currentFrameRef.current += diff * 0.18;
    } else {
      currentFrameRef.current = targetFrameRef.current;
    }

    const frameImg = getFrame(currentFrameRef.current);
    const w = canvas.width;
    const h = canvas.height;

    if (frameImg && frameImg.complete && frameImg.naturalWidth > 0) {
      // Clear before drawing fresh frame to prevent blank flashes
      ctx.clearRect(0, 0, w, h);

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Cover fit calculation
      const imgRatio = frameImg.naturalWidth / frameImg.naturalHeight;
      const canvasRatio = w / h;
      let drawW: number;
      let drawH: number;
      let drawX: number;
      let drawY: number;

      if (canvasRatio > imgRatio) {
        drawW = w;
        drawH = w / imgRatio;
        drawX = 0;
        drawY = (h - drawH) / 2;
      } else {
        drawH = h;
        drawW = h * imgRatio;
        drawX = (w - drawW) / 2;
        drawY = 0;
      }

      ctx.drawImage(frameImg, drawX, drawY, drawW, drawH);

      // Cleanly dissolve the bottom-right watermark region into pure background (#080808)
      const starX = drawX + drawW * 0.918;
      const starY = drawY + drawH * 0.90;
      const starR = drawW * 0.145;
      const starCleanGrad = ctx.createRadialGradient(starX, starY, 0, starX, starY, starR);
      starCleanGrad.addColorStop(0, '#080808');
      starCleanGrad.addColorStop(0.7, '#080808');
      starCleanGrad.addColorStop(1, 'rgba(8, 8, 8, 0)');
      ctx.fillStyle = starCleanGrad;
      ctx.beginPath();
      ctx.arc(starX, starY, starR, 0, Math.PI * 2);
      ctx.fill();

      // Edge vignette to dissolve canvas perimeter seamlessly into page background (#080808)
      const edgeVignette = ctx.createRadialGradient(
        w / 2,
        h * 0.45,
        Math.min(w, h) * 0.32,
        w / 2,
        h * 0.45,
        Math.max(w, h) * 0.68
      );
      edgeVignette.addColorStop(0, 'rgba(8, 8, 8, 0)');
      edgeVignette.addColorStop(0.7, 'rgba(8, 8, 8, 0.4)');
      edgeVignette.addColorStop(1, 'rgba(8, 8, 8, 0.95)');
      ctx.fillStyle = edgeVignette;
      ctx.fillRect(0, 0, w, h);
    } else {
      ctx.clearRect(0, 0, w, h);
      // Background gradient fallback while first frame is ready
      const grad = ctx.createRadialGradient(w / 2, h / 2, 40, w / 2, h / 2, Math.max(w, h));
      grad.addColorStop(0, '#1c1c1c');
      grad.addColorStop(1, '#080808');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }

    animationFrameIdRef.current = requestAnimationFrame(renderCanvas);
  }, [getFrame, currentVariant.frameCount, displayedVariant.bucketName]);

  // Resize canvas according to device pixel ratio
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Track scroll position mapped to frame index
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const scrollTrackHeight = container.offsetHeight - window.innerHeight;

      if (scrollTrackHeight <= 0) {
        targetFrameRef.current = 0;
        return;
      }

      // If user is actively scrolling, disable auto-play so scroll controls the can
      if (Math.abs(rect.top) > 20 && isAutoPlayingRef.current) {
        setIsAutoPlaying(false);
      }

      const scrolledAmount = -rect.top;
      const rawProgress = Math.max(0, Math.min(1, scrolledAmount / scrollTrackHeight));
      const totalFrames = currentVariant.frameCount;
      
      if (!isAutoPlayingRef.current) {
        targetFrameRef.current = rawProgress * (totalFrames - 1);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentVariant.frameCount]);

  // Start animation loop
  useEffect(() => {
    animationFrameIdRef.current = requestAnimationFrame(renderCanvas);
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [renderCanvas]);

  const handleCtaClick = (e: React.MouseEvent) => {
    onAddToCart();
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 45,
      spread: 60,
      origin: { x, y },
      colors: [currentVariant.themeColor, '#ffffff', '#ffd700']
    });
  };

  const formattedIndex = String(displayedIndex + 1).padStart(2, '0');

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative w-full h-[320vh] bg-[#080808]"
    >
      {/* Sticky Fullscreen Viewport */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-between pointer-events-none">
        
        {/* Fullscreen Canvas Background with Parallax Scrubbing */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-300"
        />

        {/* Seamless Edge Blending Overlays */}
        <div
          className="absolute inset-0 z-[1] pointer-events-none transition-colors duration-700"
          style={{
            background: isDarkMode
              ? `linear-gradient(to bottom, #080808 0%, transparent 12%, transparent 72%, #080808 100%),
                 linear-gradient(to right, #080808 0%, transparent 14%, transparent 86%, #080808 100%)`
              : `linear-gradient(to bottom, #f5f5f5 0%, transparent 12%, transparent 72%, #f5f5f5 100%),
                 linear-gradient(to right, #f5f5f5 0%, transparent 14%, transparent 86%, #f5f5f5 100%)`
          }}
        />

        {/* Ambient Flavor Glow centered behind the Can */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full blur-[170px] opacity-25 pointer-events-none transition-all duration-700"
          style={{ backgroundColor: displayedVariant.themeColor }}
        />

        {/* ================= LEFT SIDE: OVERLAY TEXT BLOCK ================= */}
        <div className="relative z-10 pointer-events-auto max-w-xl pl-8 sm:pl-16 lg:pl-24 pr-4 py-12 flex flex-col justify-center">
          <div
            className={`transition-all duration-300 ease-out ${
              textVisible
                ? 'opacity-100 translate-y-0 filter-none'
                : 'opacity-0 translate-y-4 blur-[2px]'
            }`}
          >
            {/* Category / Flavor Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono tracking-[0.25em] uppercase font-bold mb-4 border transition-colors duration-300 backdrop-blur-md"
              style={{
                borderColor: `${displayedVariant.themeColor}55`,
                backgroundColor: isDarkMode ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)',
                color: displayedVariant.themeColor
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: displayedVariant.themeColor }} />
              {displayedVariant.badge}
            </div>

            {/* Drink Name (Large, Bold, Uppercase) */}
            <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight uppercase leading-[0.9] text-white drop-shadow-2xl">
              {displayedVariant.name}
            </h1>

            {/* Subtitle Line (Smaller, Light Font Weight) */}
            <h2 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-light tracking-[0.18em] uppercase text-zinc-300 mt-2 mb-6">
              {displayedVariant.subtitle}
            </h2>

            {/* Short Descriptive Paragraph */}
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-md font-sans font-normal mb-8 text-shadow backdrop-blur-[1px]">
              {displayedVariant.description}
            </p>

            {/* Micro Nutrition Facts Pill */}
            <div className="flex items-center gap-4 text-xs font-mono text-zinc-400 mb-8 pb-1 border-b border-white/10 max-w-xs">
              <div>
                <span className="text-white font-bold">{displayedVariant.calories}</span> CAL
              </div>
              <span className="text-zinc-600">•</span>
              <div>
                <span className="text-white font-bold">{displayedVariant.sugar}</span> SUGAR
              </div>
              <span className="text-zinc-600">•</span>
              <div>
                <span className="text-white font-bold">{displayedVariant.fiber}</span> PREBIOTICS
              </div>
            </div>

            {/* Two Full Rounded CTA Buttons Side by Side */}
            <div className="flex items-center gap-4">
              {/* Left CTA: Transparent Background & White Text */}
              <button
                onClick={handleCtaClick}
                className="px-8 py-3.5 rounded-full text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-white bg-transparent border-2 border-white/40 hover:border-white hover:bg-white/10 active:scale-95 transition-all duration-200 backdrop-blur-sm shadow-md"
              >
                ADD TO
              </button>

              {/* Right CTA: White Background & Black Text */}
              <button
                onClick={handleCtaClick}
                className="px-8 py-3.5 rounded-full text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-black bg-white hover:bg-zinc-200 active:scale-95 transition-all duration-200 shadow-xl flex items-center gap-2 group"
                style={{
                  boxShadow: `0 8px 24px -4px ${displayedVariant.themeGlow}`
                }}
              >
                <span>CART</span>
                <span
                  className="w-1.5 h-1.5 rounded-full transition-transform group-hover:scale-150"
                  style={{ backgroundColor: displayedVariant.themeColor }}
                />
              </button>
            </div>
          </div>
        </div>

        {/* ================= CENTER AREA: CLEAN & EMPTY ================= */}
        {/* Intentionally left visually clear so the animated 3D can is front and center */}
        <div className="hidden lg:block flex-1 pointer-events-none" />

        {/* ================= RIGHT SIDE: VARIANT NAVIGATION ================= */}
        <div className="relative z-10 pointer-events-auto pr-6 sm:pr-12 lg:pr-16 flex items-center gap-6">
          
          {/* Huge Number Representing Flavor Index (01, 02, 03...) */}
          <div className="flex flex-col items-end select-none">
            <span
              className={`font-display text-7xl sm:text-8xl lg:text-9xl font-black leading-none tracking-tighter transition-all duration-300 ${
                textVisible ? 'opacity-90 translate-x-0' : 'opacity-0 translate-x-4'
              }`}
              style={{
                color: isDarkMode ? '#ffffff' : '#080808',
                WebkitTextStroke: isDarkMode ? '1px rgba(255,255,255,0.4)' : '1px rgba(0,0,0,0.4)',
                textShadow: `0 0 35px ${displayedVariant.themeGlow}`
              }}
            >
              {formattedIndex}
            </span>
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-zinc-500 mt-1">
              / 0{totalVariants} FLAVORS
            </span>
          </div>

          {/* Slim Vertical Navigation Strip */}
          <div className="flex flex-col items-center justify-center bg-black/40 backdrop-blur-md border border-white/10 rounded-full py-4 px-2 shadow-2xl">
            
            {/* Small PREV label and arrow */}
            <button
              onClick={onPrevVariant}
              disabled={isSwitchingVariant}
              className="group flex flex-col items-center gap-1 text-[10px] font-mono tracking-widest text-zinc-400 hover:text-white transition-colors duration-200 p-2 cursor-pointer disabled:opacity-50"
              title="Previous Flavor"
              aria-label="Previous Flavor"
            >
              <ChevronUp className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
              <span className="text-[9px] uppercase font-bold">PREV</span>
            </button>

            {/* Thin Vertical Divider Line */}
            <div className="w-4 h-[1px] bg-white/20 my-2" />

            {/* Variant Switching Loading Spinner */}
            {isSwitchingVariant ? (
              <div className="my-1 text-white animate-spin">
                <Loader2 className="w-3.5 h-3.5" style={{ color: displayedVariant.themeColor }} />
              </div>
            ) : (
              <div
                className="w-1.5 h-1.5 rounded-full my-1 transition-colors duration-300"
                style={{ backgroundColor: displayedVariant.themeColor }}
              />
            )}

            {/* Thin Vertical Divider Line */}
            <div className="w-4 h-[1px] bg-white/20 my-2" />

            {/* Small NEXT label and arrow */}
            <button
              onClick={onNextVariant}
              disabled={isSwitchingVariant}
              className="group flex flex-col items-center gap-1 text-[10px] font-mono tracking-widest text-zinc-400 hover:text-white transition-colors duration-200 p-2 cursor-pointer disabled:opacity-50"
              title="Next Flavor"
              aria-label="Next Flavor"
            >
              <span className="text-[9px] uppercase font-bold">NEXT</span>
              <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
            </button>
          </div>
        </div>

        {/* ================= BOTTOM CENTER: SOCIAL ICONS & SCROLL PROMPT ================= */}
        <div className="absolute bottom-6 left-0 right-0 z-10 flex flex-col items-center justify-center pointer-events-auto">
          
          {/* 360 Spin Animation Toggle Button & Scroll Prompt */}
          <div className="flex flex-col sm:flex-row items-center gap-3 mb-3">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 hover:border-white text-white flex items-center gap-2 transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
              style={
                isAutoPlaying
                  ? { borderColor: displayedVariant.themeColor, boxShadow: `0 0 20px ${displayedVariant.themeGlow}` }
                  : {}
              }
            >
              {isAutoPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-amber-400" />
                  <span>Pause 360° Animation</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" style={{ color: displayedVariant.themeColor }} />
                  <span>Play 360° Animation</span>
                </>
              )}
            </button>

            <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-400">
              <span>Or Scroll To Scrub</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: displayedVariant.themeColor }} />
            </div>
          </div>

          {/* Minimal Monochrome Social Icons */}
          <div className="flex items-center gap-5 text-zinc-400">
            {/* X / Twitter */}
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter / X"
              className="hover:text-white transition-colors duration-200 hover:scale-110"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-white transition-colors duration-200 hover:scale-110"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>

            {/* Facebook */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-white transition-colors duration-200 hover:scale-110"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
              </svg>
            </a>

            {/* TikTok */}
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="hover:text-white transition-colors duration-200 hover:scale-110"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
              </svg>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};

