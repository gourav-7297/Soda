import React, { useState, useEffect } from 'react';
import { DrinkVariant } from './types/drink';
import { INITIAL_VARIANTS } from './data/variants';
import { useFrameSequence } from './hooks/useFrameSequence';
import { Preloader } from './components/Preloader';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CustomizerModal } from './components/CustomizerModal';
import { ProductSection } from './components/ProductSection';
import { IngredientsSection } from './components/IngredientsSection';
import { NutritionSection } from './components/NutritionSection';
import { ReviewsSection } from './components/ReviewsSection';
import { FaqSection } from './components/FaqSection';
import { CtaSection } from './components/CtaSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';

export function App() {
  const [variants, setVariants] = useState<DrinkVariant[]>(INITIAL_VARIANTS);

  const [currentVariantIndex, setCurrentVariantIndex] = useState<number>(0);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [cartCount, setCartCount] = useState<number>(1);

  // Clean stale storage if any existed
  useEffect(() => {
    localStorage.removeItem('olipop_custom_variants');
    localStorage.removeItem('olipop_custom_variants_v2');
  }, []);

  const currentVariant = variants[currentVariantIndex] || variants[0];

  // Sequence preloader and frame manager
  const { loadProgress, isInitialLoaded, isSwitchingVariant, getFrame } =
    useFrameSequence(currentVariant);

  // Apply dark mode class and dynamic CSS variables for theme accent & glow
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    root.style.setProperty('--theme-accent', currentVariant.themeColor);
    root.style.setProperty('--theme-glow', currentVariant.themeGlow);
  }, [isDarkMode, currentVariant.themeColor, currentVariant.themeGlow]);

  // Variant Navigation handlers
  const handlePrevVariant = () => {
    setCurrentVariantIndex((prev) => (prev > 0 ? prev - 1 : variants.length - 1));
  };

  const handleNextVariant = () => {
    setCurrentVariantIndex((prev) => (prev < variants.length - 1 ? prev + 1 : 0));
  };

  // Customizer Handlers
  const handleUpdateVariant = (index: number, updated: Partial<DrinkVariant>) => {
    setVariants((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...updated };
      return copy;
    });
  };

  const handleAddVariant = (newVariant: DrinkVariant) => {
    setVariants((prev) => [...prev, newVariant]);
  };

  const handleDeleteVariant = (index: number) => {
    if (variants.length <= 1) return;
    setVariants((prev) => prev.filter((_, i) => i !== index));
    if (currentVariantIndex >= index && currentVariantIndex > 0) {
      setCurrentVariantIndex(currentVariantIndex - 1);
    }
  };

  const handleResetDefaults = () => {
    setVariants(INITIAL_VARIANTS);
    setCurrentVariantIndex(0);
    localStorage.removeItem('olipop_custom_variants');
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#080808] text-white' : 'bg-white text-zinc-900'}`}>
      
      {/* Full-Screen Preloader Overlay */}
      <Preloader
        progress={loadProgress}
        isReady={isInitialLoaded}
        variant={currentVariant}
      />

      {/* Sticky Top Navbar */}
      <Navbar
        currentVariant={currentVariant}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        onOpenCustomizer={() => setIsCustomizerOpen(true)}
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Fullscreen Parallax WebP Hero Section */}
      <HeroSection
        currentVariant={currentVariant}
        variantIndex={currentVariantIndex}
        totalVariants={variants.length}
        onPrevVariant={handlePrevVariant}
        onNextVariant={handleNextVariant}
        getFrame={getFrame}
        isSwitchingVariant={isSwitchingVariant}
        onAddToCart={() => setCartCount((c) => c + 1)}
        isDarkMode={isDarkMode}
      />

      {/* Product / About The Drink Section */}
      <ProductSection
        currentVariant={currentVariant}
        allVariants={variants}
        onSelectVariant={setCurrentVariantIndex}
        onAddToCart={() => setCartCount((c) => c + 1)}
        isDarkMode={isDarkMode}
      />

      {/* Ingredients & Benefits Section */}
      <IngredientsSection
        currentVariant={currentVariant}
        isDarkMode={isDarkMode}
      />

      {/* Authentic Nutrition Facts Label Section */}
      <NutritionSection
        currentVariant={currentVariant}
        isDarkMode={isDarkMode}
      />

      {/* Reviews & Social Proof Section */}
      <ReviewsSection
        currentVariant={currentVariant}
        isDarkMode={isDarkMode}
      />

      {/* FAQ Accordion Section */}
      <FaqSection
        currentVariant={currentVariant}
        isDarkMode={isDarkMode}
      />

      {/* Final Call To Action (featuring square pop-art Andy Grape Soda image) */}
      <CtaSection
        currentVariant={currentVariant}
        onAddToCart={() => setCartCount((c) => c + 1)}
        isDarkMode={isDarkMode}
      />

      {/* Minimal Footer */}
      <Footer currentVariant={currentVariant} />

      {/* Live Customizer Drawer / Modal */}
      <CustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        variants={variants}
        currentVariantIndex={currentVariantIndex}
        onSelectVariant={setCurrentVariantIndex}
        onUpdateVariant={handleUpdateVariant}
        onAddVariant={handleAddVariant}
        onDeleteVariant={handleDeleteVariant}
        onResetDefaults={handleResetDefaults}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
      />

      {/* Slide-out Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        currentVariant={currentVariant}
        cartCount={cartCount}
        onUpdateCartCount={setCartCount}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}

export default App;

