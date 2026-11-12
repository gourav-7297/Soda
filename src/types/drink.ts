export interface DrinkVariant {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  themeColor: string; // e.g. '#E50914' or '#9333EA'
  themeGlow: string;  // e.g. 'rgba(229, 9, 20, 0.4)'
  mode?: 'dark' | 'light';
  frameCount: number;
  bucketName: string;
  posterUrl: string;
  badge: string;
  calories: number;
  sugar: string;
  fiber: string;
  customSequenceUrlPattern?: string; // Optional custom pattern: e.g. 'https://.../frame_{index}.webp'
}

export interface SiteConfig {
  companyName: string;
  companyDescription: string;
  currentVariantIndex: number;
  globalMode: 'dark' | 'light';
  cartCount: number;
}

