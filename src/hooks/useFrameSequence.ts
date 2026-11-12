import { useState, useEffect, useRef, useCallback } from 'react';
import { DrinkVariant } from '../types/drink';
import { getVariantFrameUrl } from '../data/variants';

interface UseFrameSequenceResult {
  frames: (HTMLImageElement | null)[];
  loadProgress: number; // 0 to 100
  isInitialLoaded: boolean;
  isSwitchingVariant: boolean;
  getFrame: (index: number) => HTMLImageElement | null;
}

// Global cross-variant cache so frames persist across switching
const globalFrameCache = new Map<string, HTMLImageElement>();

export function useFrameSequence(currentVariant: DrinkVariant): UseFrameSequenceResult {
  const [loadProgress, setLoadProgress] = useState<number>(0);
  const [isInitialLoaded, setIsInitialLoaded] = useState<boolean>(false);
  const [isSwitchingVariant, setIsSwitchingVariant] = useState<boolean>(false);
  const [frames, setFrames] = useState<(HTMLImageElement | null)[]>([]);

  // Keep a ref of current frames array for instant access without re-renders
  const framesRef = useRef<(HTMLImageElement | null)[]>([]);

  // Preload a sequence for a given variant
  useEffect(() => {
    let isCancelled = false;
    const totalFrames = currentVariant.frameCount;
    const newFrames: (HTMLImageElement | null)[] = new Array(totalFrames).fill(null);
    framesRef.current = newFrames;
    setFrames([...newFrames]);

    // Check how many are already cached
    let loadedCount = 0;
    const urls: string[] = [];
    for (let i = 0; i < totalFrames; i++) {
      const url = getVariantFrameUrl(currentVariant, i);
      urls.push(url);
      if (globalFrameCache.has(url)) {
        newFrames[i] = globalFrameCache.get(url)!;
        loadedCount++;
      }
    }

    if (loadedCount === totalFrames) {
      setLoadProgress(100);
      setIsInitialLoaded(true);
      setIsSwitchingVariant(false);
      return;
    }

    setIsSwitchingVariant(true);

    // Concurrency pool for downloading frames
    const concurrency = 12;
    let nextIndex = 0;

    const loadNext = (): Promise<void> => {
      if (isCancelled || nextIndex >= totalFrames) {
        return Promise.resolve();
      }

      const currentIndex = nextIndex++;
      const url = urls[currentIndex];

      if (globalFrameCache.has(url)) {
        newFrames[currentIndex] = globalFrameCache.get(url)!;
        loadedCount++;
        if (!isCancelled) {
          setLoadProgress(Math.round((loadedCount / totalFrames) * 100));
        }
        return loadNext();
      }

      return new Promise<void>((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = () => {
          if (!isCancelled) {
            globalFrameCache.set(url, img);
            newFrames[currentIndex] = img;
            loadedCount++;
            setLoadProgress(Math.round((loadedCount / totalFrames) * 100));
            // Trigger quick state update on key milestones
            if (currentIndex === 0 || loadedCount % 10 === 0 || loadedCount === totalFrames) {
              setFrames([...newFrames]);
            }
          }
          resolve();
        };

        img.onerror = () => {
          // If a frame fails to load, fallback to first frame or null
          if (!isCancelled) {
            loadedCount++;
            setLoadProgress(Math.round((loadedCount / totalFrames) * 100));
          }
          resolve();
        };

        img.src = url;
      }).then(() => loadNext());
    };

    const workers = [];
    for (let i = 0; i < Math.min(concurrency, totalFrames); i++) {
      workers.push(loadNext());
    }

    Promise.all(workers).then(() => {
      if (!isCancelled) {
        setFrames([...newFrames]);
        setLoadProgress(100);
        setIsInitialLoaded(true);
        setIsSwitchingVariant(false);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [currentVariant.id, currentVariant.customSequenceUrlPattern, currentVariant.frameCount]);

  // Return the closest available loaded frame to prevent visual blanking
  const getFrame = useCallback((targetIndex: number): HTMLImageElement | null => {
    const list = framesRef.current;
    if (!list || list.length === 0) return null;

    const clamped = Math.max(0, Math.min(list.length - 1, Math.round(targetIndex)));
    if (list[clamped]) return list[clamped];

    // Search outwards for nearest loaded frame
    for (let offset = 1; offset < list.length; offset++) {
      if (clamped - offset >= 0 && list[clamped - offset]) {
        return list[clamped - offset];
      }
      if (clamped + offset < list.length && list[clamped + offset]) {
        return list[clamped + offset];
      }
    }

    return null;
  }, []);

  return {
    frames,
    loadProgress,
    isInitialLoaded,
    isSwitchingVariant,
    getFrame
  };
}

