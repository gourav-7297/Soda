import { DrinkVariant } from '../types/drink';

export const INITIAL_VARIANTS: DrinkVariant[] = [
  {
    id: 'cherry',
    name: 'Cherry',
    subtitle: 'Soda',
    description: 'A modern take on a classic soda with a perfect blend of sweet and tart, full of nostalgic flavor.',
    themeColor: '#E50914',
    themeGlow: 'rgba(229, 9, 20, 0.45)',
    mode: 'dark',
    frameCount: 94,
    bucketName: 'cherry',
    posterUrl: '/sequences/cherry/frame_00.webp',
    badge: 'SIGNATURE CLASSIC',
    calories: 35,
    sugar: '4g',
    fiber: '9g'
  },
  {
    id: 'grape',
    name: 'Grape',
    subtitle: 'Soda',
    description: 'A modern functional soda brand inspired by classic flavors but made with better ingredients.',
    themeColor: '#A855F7',
    themeGlow: 'rgba(168, 85, 247, 0.45)',
    mode: 'dark',
    frameCount: 94,
    bucketName: 'grape',
    posterUrl: '/sequences/grape/frame_00.webp',
    badge: 'CUSTOMER FAVORITE',
    calories: 35,
    sugar: '4g',
    fiber: '9g'
  },
  {
    id: 'lemon',
    name: 'Lemon',
    subtitle: 'Ginger Soda',
    description: 'Bright and refreshing citrus soda with natural lemon spark and crisp bubbles.',
    themeColor: '#EAB308',
    themeGlow: 'rgba(234, 179, 8, 0.45)',
    mode: 'dark',
    frameCount: 94,
    bucketName: 'lemon',
    posterUrl: '/sequences/lemon/frame_00.webp',
    badge: 'REFRESHING CITRUS',
    calories: 35,
    sugar: '3g',
    fiber: '9g'
  }
];

export function getVariantFrameUrl(variant: DrinkVariant, frameIndex: number): string {
  const clampedIndex = Math.max(0, Math.min(variant.frameCount - 1, frameIndex));
  
  if (variant.customSequenceUrlPattern) {
    const pad2 = String(clampedIndex).padStart(2, '0');
    const pad4 = String(clampedIndex + 1).padStart(4, '0');
    return variant.customSequenceUrlPattern
      .replace('{index}', String(clampedIndex))
      .replace('{pad2}', pad2)
      .replace('{pad4}', pad4);
  }

  const pad = String(clampedIndex).padStart(2, '0');
  const dirName = (variant.bucketName || variant.id).toLowerCase();
  return `/sequences/${dirName}/frame_${pad}.webp`;
}

