import { SizeTypeMode } from './types';
import { createClient } from './supabase/client';

export interface CategoryDefinition {
  id: string;
  slug: string;
  name: string;
  description: string;
  sizeType: SizeTypeMode;
}

export const DEFAULT_CATEGORIES: CategoryDefinition[] = [
  {
    id: 'blusas',
    slug: 'blusas',
    name: 'Blusas',
    description: 'Blusas y tops confeccionados a mano en hilo peruano.',
    sizeType: 'vestir',
  },
  {
    id: 'vestidos',
    slug: 'vestidos',
    name: 'Vestidos',
    description: 'Vestidos artesanales para ocasiones especiales.',
    sizeType: 'vestir',
  },
  {
    id: 'tapetes',
    slug: 'tapetes',
    name: 'Tapetes',
    description: 'Tapetes y carpetas de decoración para el hogar.',
    sizeType: 'dimensiones',
  },
  {
    id: 'diadema',
    slug: 'diadema',
    name: 'Diademas',
    description: 'Accesorios para el cabello en hilo suave.',
    sizeType: 'unica',
  },
  {
    id: 'gorros',
    slug: 'gorros',
    name: 'Gorros',
    description: 'Gorros tejidos a mano en hilos abrigadores.',
    sizeType: 'unica',
  },
];

export function getStoredCategories(): CategoryDefinition[] {
  if (typeof window === 'undefined') return DEFAULT_CATEGORIES;
  try {
    const saved = localStorage.getItem('imidi_categories_config');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  } catch {
    return DEFAULT_CATEGORIES;
  }
}

export function saveStoredCategories(categories: CategoryDefinition[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('imidi_categories_config', JSON.stringify(categories));
    window.dispatchEvent(new Event('imidi_categories_updated'));
  } catch {
    // Ignorar
  }
}

export async function fetchStoreCategories(): Promise<CategoryDefinition[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('id, slug, name, description, size_type')
    .order('name');

  if (error) throw error;
  const categories = (data || []).map((category) => ({
    id: category.id,
    slug: category.slug,
    name: category.name,
    description: category.description || '',
    sizeType: category.size_type as SizeTypeMode,
  }));
  const resolved = categories.length > 0 ? categories : DEFAULT_CATEGORIES;
  saveStoredCategories(resolved);
  return resolved;
}

export async function saveStoreCategories(categories: CategoryDefinition[]): Promise<void> {
  const supabase = createClient();
  const rows = categories.map((category) => ({
    id: category.id,
    slug: category.slug,
    name: category.name,
    description: category.description,
    size_type: category.sizeType,
  }));
  const { error: upsertError } = await supabase.from('categories').upsert(rows);
  if (upsertError) throw upsertError;

  const ids = rows.map((row) => row.id);
  const { error: deleteError } = await supabase.from('categories').delete().not('id', 'in', `(${ids.join(',')})`);
  if (deleteError) throw deleteError;
  saveStoredCategories(categories);
}

export function getCategorySizeType(categorySlug: string): SizeTypeMode {
  const categories = getStoredCategories();
  const slugClean = categorySlug.toLowerCase().trim();
  const found = categories.find((c) => c.slug.toLowerCase() === slugClean || c.name.toLowerCase() === slugClean);
  if (found) return found.sizeType;

  // Fallbacks por defecto si es una categoría recién agregada
  if (slugClean.includes('diadema') || slugClean.includes('gorro') || slugClean.includes('vincha') || slugClean.includes('accesorio')) {
    return 'unica';
  }
  if (slugClean.includes('tapete') || slugClean.includes('cojin') || slugClean.includes('manta') || slugClean.includes('alfombra') || slugClean.includes('hogar')) {
    return 'dimensiones';
  }
  return 'vestir';
}
