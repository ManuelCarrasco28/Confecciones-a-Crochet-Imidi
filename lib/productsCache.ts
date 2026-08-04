import { Product } from './types';
import { INITIAL_PRODUCTS } from './mockData';

const CACHE_KEY = 'imidi_cached_products_v2';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 Horas

interface CachedEnvelope {
  version: number;
  timestamp: number;
  data: Product[];
}

export function isValidProduct(p: unknown): p is Product {
  if (!p || typeof p !== 'object') return false;
  const item = p as Record<string, unknown>;
  return (
    typeof item.id === 'string' &&
    item.id.trim().length > 0 &&
    typeof item.name === 'string' &&
    item.name.trim().length > 0 &&
    typeof item.price === 'number' &&
    !isNaN(item.price) &&
    item.price >= 0 &&
    typeof item.imageUrl === 'string' &&
    item.imageUrl.trim().length > 0
  );
}

export function getCachedProducts(): Product[] {
  if (typeof window === 'undefined') return INITIAL_PRODUCTS;
  try {
    const saved = localStorage.getItem(CACHE_KEY);
    if (saved) {
      const envelope: CachedEnvelope = JSON.parse(saved);
      const isExpired = Date.now() - envelope.timestamp > CACHE_TTL_MS;
      
      if (!isExpired && Array.isArray(envelope.data)) {
        const validProducts = envelope.data.filter(isValidProduct);
        if (validProducts.length > 0 || envelope.data.length === 0) {
          return validProducts;
        }
      }
    }
  } catch {
    // Fallback a INITIAL_PRODUCTS si ocurre un error de lectura
  }
  return INITIAL_PRODUCTS;
}

export function setCachedProducts(products: Product[]): void {
  if (typeof window === 'undefined') return;
  try {
    const validProducts = Array.isArray(products) ? products.filter(isValidProduct) : [];
    const envelope: CachedEnvelope = {
      version: 2,
      timestamp: Date.now(),
      data: validProducts,
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(envelope));
    window.dispatchEvent(new Event('imidi_products_updated'));
  } catch {
    // Ignorar errores de almacenamiento local
  }
}

export function clearProductsCache(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(CACHE_KEY);
    window.dispatchEvent(new Event('imidi_products_updated'));
  } catch {
    // Ignorar
  }
}
