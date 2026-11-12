import React, { useState, useEffect } from 'react';
import { DrinkVariant } from '../types/drink';
import { Moon, Sun, Sliders, ShoppingBag, Menu, X } from 'lucide-react';

interface NavbarProps {
  currentVariant: DrinkVariant;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenCustomizer: () => void;
  cartCount: number;
  onOpenCart?: () => void;
}

const NAV_LINKS = [
  { label: 'Product', href: '#product' },
  { label: 'Ingredients', href: '#ingredients' },
  { label: 'Nutrition', href: '#nutrition' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentVariant,
  isDarkMode,
  onToggleTheme,
  onOpenCustomizer,
  cartCount,
  onOpenCart
}) => {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      const sections = ['hero', 'product', 'ingredients', 'nutrition', 'reviews', 'faq', 'contact'];
      const scrollPos = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el) {
          const top = el.offsetTop;
          if (scrollPos >= top) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? isDarkMode
            ? 'bg-[#080808]/85 backdrop-blur-md border-b border-white/10 shadow-2xl py-3.5'
            : 'bg-white/85 backdrop-blur-md border-b border-black/10 shadow-lg py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2 group cursor-pointer"
        >
          <span className="font-display text-2xl sm:text-3xl font-black tracking-tight tracking-wider uppercase transition-transform group-hover:scale-105 duration-200">
            OLI<span style={{ color: currentVariant.themeColor }}>POP</span>
          </span>
          <span
            className="w-2 h-2 rounded-full hidden sm:inline-block transition-transform duration-300 group-hover:scale-150"
            style={{ backgroundColor: currentVariant.themeColor }}
          />
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-[0.2em] font-semibold">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.href.replace('#', '');
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(link.href);
                }}
                className={`relative py-1 transition-colors duration-200 ${
                  isActive
                    ? isDarkMode
                      ? 'text-white font-bold'
                      : 'text-black font-bold'
                    : isDarkMode
                    ? 'text-zinc-400 hover:text-white'
                    : 'text-zinc-600 hover:text-black'
                }`}
              >
                {link.label}
                {isActive && (
                  <span
                    className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full transition-all duration-300"
                    style={{ backgroundColor: currentVariant.themeColor }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Right Action Icons: Customize, Dark/Light Mode, Cart */}
        <div className="flex items-center gap-3">
          {/* Customizer Button */}
          <button
            onClick={onOpenCustomizer}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 border ${
              isDarkMode
                ? 'bg-zinc-900/90 text-zinc-300 border-zinc-700/80 hover:border-zinc-500 hover:text-white'
                : 'bg-zinc-100 text-zinc-700 border-zinc-300 hover:border-zinc-400 hover:text-black'
            }`}
            title="Customize Drinks, Flavor Text, Colors & Sequences"
          >
            <Sliders className="w-3.5 h-3.5" style={{ color: currentVariant.themeColor }} />
            <span className="hidden sm:inline">Customize</span>
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={onToggleTheme}
            className={`p-2 rounded-full transition-all duration-200 border ${
              isDarkMode
                ? 'bg-zinc-900/90 text-zinc-300 border-zinc-700/80 hover:text-white hover:border-zinc-500'
                : 'bg-zinc-100 text-zinc-800 border-zinc-300 hover:text-black hover:border-zinc-400'
            }`}
            aria-label="Toggle theme mode"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-800" />}
          </button>

          {/* Cart Icon & Badge */}
          <button
            onClick={onOpenCart}
            className={`relative p-2 rounded-full transition-all duration-200 border ${
              isDarkMode
                ? 'bg-zinc-900/90 text-zinc-300 border-zinc-700/80 hover:text-white'
                : 'bg-zinc-100 text-zinc-800 border-zinc-300 hover:text-black'
            }`}
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span
                className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold text-white flex items-center justify-center animate-bounce shadow-md"
                style={{ backgroundColor: currentVariant.themeColor }}
              >
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-zinc-400 hover:text-white"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden px-6 py-6 border-b transition-all ${
            isDarkMode ? 'bg-[#080808] border-zinc-800' : 'bg-white border-zinc-200'
          }`}
        >
          <div className="flex flex-col gap-4 text-sm uppercase tracking-widest font-semibold">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(link.href);
                }}
                className={`py-2 ${
                  activeSection === link.href.replace('#', '')
                    ? 'font-bold'
                    : isDarkMode
                    ? 'text-zinc-400'
                    : 'text-zinc-600'
                }`}
                style={
                  activeSection === link.href.replace('#', '')
                    ? { color: currentVariant.themeColor }
                    : {}
                }
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

