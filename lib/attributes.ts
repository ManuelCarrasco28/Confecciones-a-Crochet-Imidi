import { YARN_OPTIONS as DEFAULT_YARNS, COLOR_OPTIONS as DEFAULT_COLORS, SIZE_OPTIONS as DEFAULT_SIZES } from './types';

const STORAGE_KEY = 'imidi_attributes';

export interface StoreAttributes {
  yarns: string[];
  colors: string[];
  sizes: string[];
}

export const DEFAULT_ATTRIBUTES: StoreAttributes = {
  yarns: DEFAULT_YARNS,
  colors: DEFAULT_COLORS,
  sizes: DEFAULT_SIZES,
};

export function getStoredAttributes(): StoreAttributes {
  if (typeof window === 'undefined') return DEFAULT_ATTRIBUTES;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return DEFAULT_ATTRIBUTES;
    const parsed = JSON.parse(saved);
    return {
      yarns: Array.isArray(parsed.yarns) && parsed.yarns.length > 0 ? parsed.yarns : DEFAULT_YARNS,
      colors: Array.isArray(parsed.colors) && parsed.colors.length > 0 ? parsed.colors : DEFAULT_COLORS,
      sizes: Array.isArray(parsed.sizes) && parsed.sizes.length > 0 ? parsed.sizes : DEFAULT_SIZES,
    };
  } catch (e) {
    console.error('Error reading attributes from localStorage', e);
    return DEFAULT_ATTRIBUTES;
  }
}

export function saveStoredAttributes(attrs: StoreAttributes): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(attrs));
    window.dispatchEvent(new Event('imidi_attributes_updated'));
  } catch (e) {
    console.error('Error saving attributes to localStorage', e);
  }
}
