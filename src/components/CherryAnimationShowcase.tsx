import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Play, Pause, RotateCw, Sparkles, ShoppingBag } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CherryAnimationShowcaseProps {
  onAddToCart: () => void;
  isDarkMode: boolean;
}

export const CherryAnimationShowcase: React.FC<CherryAnimationShowcaseProps> = ({
  onAddToCart,
  isDarkMode
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentFrameIndex, setCurrentFrameIndex] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [loadedCount, setLoadedCount] = useState<number>(0);

  // 94 high-definition frames from the video sequence (frame_00.webp to frame_93.webp)
  const totalFrames = 94;
  const framesRef = useRef<(HTMLImageElement | null)[]>(new Array(totalFrames).fill(null));
  const currentFrameRef = useRef<number>(0);
  const isPlayingRef = useRef<boolean>(true);
  const speedRef = useRef<number>(1);
  const animIdRef = useRef<number | null>(null);

  isPlayingRef.current = isPlaying;
  speedRef.current = playbackSpeed;

  // Preload Cherry frames from the new high-definition local sequence
  useEffect(() => {
    let isCancelled = false;
    let loaded = 0;

    for (let i = 0; i < totalFrames; i++) {
      const pad = String(i).padStart(2, '0');
      const url = `/sequences/cherry/frame_${pad}.webp`;

      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        if (!isCancelled) {
          framesRef.current[i] = img;
          loaded++;
          setLoadedCount(loaded);
        }
      };

      img.src = url;
    }

    return () => {
      isCancelled = true;
    };
  }, [totalFrames]);

  // Main Render Loop for Cherry Animation
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        if (isPlayingRef.current) {
          currentFrameRef.current = (currentFrameRef.current + 0.4 * speedRef.current) % totalFrames;
          setCurrentFrameIndex(Math.floor(currentFrameRef.current));
        }

        const activeIdx = Math.floor(currentFrameRef.current);
        const list = framesRef.current;
        // Find closest loaded Cherry frame
        let img = list[activeIdx];
        if (!img) {
          for (let offset = 1; offset < totalFrames; offset++) {
            if (activeIdx - offset >= 0 && list[activeIdx - offset]) {
              img = list[activeIdx - offset];
              break;
            }
            if (activeIdx + offset < totalFrames && list[activeIdx + offset]) {
              img = list[activeIdx + offset];
              break;
            }
          }
        }

        const w = canvas.width;
        const h = canvas.height;

        if (img && img.complete && img.naturalWidth > 0) {
          ctx.clearRect(0, 0, w, h);
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          const imgRatio = img.naturalWidth / img.naturalHeight;
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

          ctx.drawImage(img, drawX, drawY, drawW, drawH);

          // Completely eliminate Google Gemini 4-pointed sparkle watermark from bottom-right corner
          const starX = drawX + drawW * 0.918;
          const starY = drawY + drawH * 0.90;
          const starR = drawW * 0.145;
          const starCleanGrad = ctx.createRadialGradient(starX, starY, 0, starX, starY, starR);
          starCleanGrad.addColorStop(0, '#0a0204');
          starCleanGrad.addColorStop(0.7, '#0a0204');
          starCleanGrad.addColorStop(1, 'rgba(10, 2, 4, 0)');
          ctx.fillStyle = starCleanGrad;
          ctx.beginPath();
          ctx.arc(starX, starY, starR, 0, Math.PI * 2);
          ctx.fill();

          // Edge vignette
          const edgeVignette = ctx.createRadialGradient(
            w / 2,
            h * 0.45,
            Math.min(w, h) * 0.32,
            w / 2,
            h * 0.45,
            Math.max(w, h) * 0.68
          );
          edgeVignette.addColorStop(0, 'rgba(10, 2, 4, 0)');
          edgeVignette.addColorStop(0.7, 'rgba(10, 2, 4, 0.4)');
          edgeVignette.addColorStop(1, 'rgba(10, 2, 4, 0.95)');
          ctx.fillStyle = edgeVignette;
          ctx.fillRect(0, 0, w, h);
        } else {
          ctx.clearRect(0, 0, w, h);
          // Subtle warm cherry gradient while first frame streams
          const grad = ctx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, w / 2);
          grad.addColorStop(0, '#2d090f');
          grad.addColorStop(1, '#0c0204');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, w, h);
        }
      }
    }

    animIdRef.current = requestAnimationFrame(renderCanvas);
  }, [totalFrames]);

  useEffect(() => {
    animIdRef.current = requestAnimationFrame(renderCanvas);
    return () => {
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
    };
  }, [renderCanvas]);

  const handleScrub = (val: number) => {
    setIsPlaying(false);
    currentFrameRef.current = val;
    setCurrentFrameIndex(val);
  };

  const handleCta = (e: React.MouseEvent) => {
    onAddToCart();
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { x, y },
      colors: ['#E50914', '#ffffff', '#FF2E63']
    });
  };

  const currentFrameNumber = String(currentFrameIndex).padStart(2, '0');

  return (
    <div
      className={`rounded-3xl border p-6 sm:p-10 relative overflow-hidden transition-all duration-300 ${isDarkMode
          ? 'bg-gradient-to-br from-[#180407] via-zinc-950 to-[#0e0204] border-rose-900/40 shadow-2xl'
          : 'bg-gradient-to-br from-rose-50/60 via-white to-zinc-50 border-rose-200 shadow-xl'
        }`}
    >
      {/* Background ambient red glow */}
      <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full blur-[140px] bg-rose-600/25 pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full blur-[140px] bg-red-600/20 pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

        {/* LEFT: 3D ANIMATED CANVAS PLAYER (AUTHENTIC CHERRY SODA CAN) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="relative w-full max-w-lg aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden border border-rose-900/50 bg-[#0a0204] shadow-2xl flex items-center justify-center group">

            <canvas
              ref={canvasRef}
              width={800}
              height={450}
              className="w-full h-full object-cover"
            />

            {/* Live Sequence Badge */}
            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-rose-500/40 text-xs font-mono text-rose-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>CHERRY COLA 3D ANIMATION</span>
            </div>

            {/* Frame readout badge */}
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[11px] font-mono text-zinc-300">
              frame_{currentFrameNumber}.webp
            </div>

            {/* Hover overlay hint */}
            <div className="absolute bottom-4 left-4 text-[10px] font-mono text-zinc-400 bg-black/60 px-2.5 py-1 rounded-lg backdrop-blur-sm">
              {isPlaying ? '● Live 360° Animation Active' : '❚❚ Paused — Scrub to Rotate'}
            </div>
          </div>

          {/* Interactive Scrub Bar & Controls */}
          <div className="w-full max-w-lg mt-4 p-4 rounded-2xl bg-black/50 border border-zinc-800 backdrop-blur-md space-y-3">
            {/* Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono text-zinc-400">
                <span>Frame {currentFrameNumber} of {totalFrames}</span>
                <span className="text-rose-400 font-bold">
                  {Math.round(((currentFrameIndex + 1) / totalFrames) * 100)}% Rotated
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={totalFrames - 1}
                value={currentFrameIndex}
                onChange={(e) => handleScrub(parseInt(e.target.value))}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
            </div>

            {/* Playback Controls Row */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Play 360°</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleScrub(0)}
                  className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition-colors"
                  title="Reset to frame 01"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Speed Buttons */}
              <div className="flex items-center gap-1 text-[11px] font-mono">
                <span className="text-zinc-500 mr-1">Speed:</span>
                {[0.5, 1, 1.5, 2].map((s) => (
                  <button
                    key={s}
                    onClick={() => setPlaybackSpeed(s)}
                    className={`px-2 py-0.5 rounded-md font-bold transition-all ${playbackSpeed === s
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/50'
                        : 'text-zinc-400 hover:text-white'
                      }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: CHERRY SODA DETAILS & STORY */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-[0.25em] font-bold mb-3 border border-rose-800/60 bg-rose-950/40 text-rose-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Verified Cherry Sequence</span>
            </div>

            <h3 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-white leading-tight">
              Olipop Cherry Soda
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-red-600">
                Cinematic Motion.
              </span>
            </h3>

            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed mt-3">
              Rendered from the high-definition WebP sequence starting at <code className="text-xs text-rose-300 font-mono bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-900/50">/sequences/cherry/frame_00.webp</code>. Watch the Cherry Cola can rotate 360 degrees showing its aluminum can finish, cold condensation droplets, and dynamic fruit splash.
            </p>

            <div className="mt-3 p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 font-mono text-xs text-zinc-400 flex items-center gap-2">
              <span className="text-zinc-500">Path:</span>
              <span className="text-zinc-200 truncate">
                /sequences/cherry/frame_00.webp
              </span>
            </div>
          </div>

          {/* Quick Specs */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 text-center font-mono">
            <div>
              <span className="text-white font-bold block text-base">35</span>
              <span className="text-[10px] text-zinc-500 uppercase">CALORIES</span>
            </div>
            <div>
              <span className="text-rose-400 font-bold block text-base">4g</span>
              <span className="text-[10px] text-zinc-500 uppercase">SUGAR</span>
            </div>
            <div>
              <span className="text-emerald-400 font-bold block text-base">9g</span>
              <span className="text-[10px] text-zinc-500 uppercase">FIBER</span>
            </div>
          </div>

          {/* Direct CTA */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={handleCta}
              className="w-full sm:w-auto flex-1 px-6 py-3.5 rounded-full text-xs font-bold tracking-[0.2em] uppercase text-white bg-rose-600 hover:bg-rose-500 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-900/40"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>ADD CHERRY 12-PACK</span>
            </button>

            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-full text-xs font-bold tracking-[0.2em] uppercase text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-500 transition-all text-center"
            >
              VIEW IN HERO
            </a>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{loadedCount}/{totalFrames} Cherry frames loaded ({totalFrames} frames)</span>

          </div>
        </div>

      </div>
    </div>
  );
};
