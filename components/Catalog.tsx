'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Product, CategoryType } from '@/lib/types';
import { ProductCard } from '@/components/ProductCard';
import { Search, Filter, DollarSign, RotateCcw, ArrowUpDown, Tag, Check, X, SlidersHorizontal, AlertTriangle } from 'lucide-react';
import { gsap } from '@/lib/gsap';

interface CatalogProps {
  products: Product[];
  selectedCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
  onOpenModal: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

const CATEGORY_TABS: { id: CategoryType; label: string }[] = [
  { id: 'blusas', label: 'Blusas' },
  { id: 'vestidos', label: 'Vestidos' },
  { id: 'tapetes', label: 'Tapetes' },
  { id: 'diadema', label: 'Diademas' },
  { id: 'gorros', label: 'Gorros' },
];

export function Catalog({
  products,
  selectedCategory,
  onSelectCategory,
  onOpenModal,
  onAddToCart,
}: CatalogProps) {
  const [selectedCategories, setSelectedCategories] = useState<CategoryType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [minPrice, setMinPrice] = useState<string>('0');
  const [maxPrice, setMaxPrice] = useState<string>('500');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'name-asc'>('default');

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const gridRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const isFirstMount = useRef(true);

  // Bloquear scroll de la página al abrir el drawer móvil de filtros
  useEffect(() => {
    if (!mobileFiltersOpen) return;

    const previousOverflow = document.body.style.overflow;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileFiltersOpen(false);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [mobileFiltersOpen]);

  // Conteo de productos por categoría
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  const handleToggleCategory = (catId: CategoryType) => {
    const activeCategories = selectedCategories.length > 0
      ? selectedCategories
      : selectedCategory !== 'todas'
        ? [selectedCategory]
        : [];
    const updated = activeCategories.includes(catId)
      ? activeCategories.filter((id) => id !== catId)
      : [...activeCategories, catId];

    setSelectedCategories(updated);
    onSelectCategory(updated.length === 1 ? updated[0] : 'todas');
  };

  const handleToggleAllCategories = () => {
    if (selectedCategories.length === CATEGORY_TABS.length) {
      setSelectedCategories([]);
      onSelectCategory('todas');
    } else {
      setSelectedCategories(CATEGORY_TABS.map((c) => c.id));
      onSelectCategory('todas');
    }
  };

  const handleMinPriceChange = (val: string) => {
    if (val === '') {
      setMinPrice('');
      return;
    }
    let num = parseFloat(val);
    if (isNaN(num)) return;
    if (num < 0) num = 0;
    if (num > 500) num = 500;
    setMinPrice(num.toString());
  };

  const handleMaxPriceChange = (val: string) => {
    if (val === '') {
      setMaxPrice('');
      return;
    }
    let num = parseFloat(val);
    if (isNaN(num)) return;
    if (num < 0) num = 0;
    if (num > 500) num = 500;
    setMaxPrice(num.toString());
  };

  const displayMin = useMemo(() => {
    const parsed = parseFloat(minPrice);
    if (isNaN(parsed) || parsed < 0) return 0;
    return Math.min(500, parsed);
  }, [minPrice]);

  const displayMax = useMemo(() => {
    const parsed = parseFloat(maxPrice);
    if (isNaN(parsed) || parsed < 0) return 0;
    return Math.min(500, parsed);
  }, [maxPrice]);

  const priceRangeInvalid = displayMin > displayMax;

  // Filtrar productos por Categorías, Búsqueda (Nombre, Descripción Y Color) y Rango de Precio
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // 1. Filtro por Selección Múltiple de Categorías
        const activeCategories = selectedCategories.length > 0
          ? selectedCategories
          : (selectedCategory && selectedCategory !== 'todas' ? [selectedCategory] : []);

        const matchesCategory =
          activeCategories.length === 0 || activeCategories.includes(p.category);
        
        // 2. Búsqueda por Nombre, Descripción Y Color
        const term = searchTerm.trim().toLowerCase();
        const matchesSearch = !term || 
          p.name.toLowerCase().includes(term) || 
          p.description.toLowerCase().includes(term) ||
          (p.colors && p.colors.some((c) => c.toLowerCase().includes(term)));

        // 3. Filtro por Rango Manual de Precio
        let matchesPrice = true;
        const price = p.price;

        if (!priceRangeInvalid) {
          if (price < displayMin || price > displayMax) {
            matchesPrice = false;
          }
        }

        return matchesCategory && matchesSearch && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [products, selectedCategories, selectedCategory, searchTerm, displayMin, displayMax, priceRangeInvalid, sortBy]);

  // Animar tarjetas respetando prefers-reduced-motion
  useEffect(() => {
    if (!gridRef.current) return;
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cards = gridRef.current.querySelectorAll('.catalog-card-item');

    if (cards.length > 0) {
      gsap.killTweensOf(cards);
      if (prefersReducedMotion) {
        gsap.set(cards, { opacity: 1, y: 0 });
      } else {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.25, stagger: 0.03, ease: 'power2.out', clearProps: 'all' }
        );
      }
    }

    return () => {
      gsap.killTweensOf(cards);
    };
  }, [filteredProducts]);

  // Animar el contador de resultados
  useEffect(() => {
    const counter = counterRef.current;
    if (!counter) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    gsap.killTweensOf(counter);
    if (!prefersReducedMotion) {
      gsap.fromTo(
        counter,
        { scale: 1.25, color: '#D97B84' },
        { scale: 1, color: '#437579', duration: 0.25, ease: 'back.out(2)' }
      );
    }
    return () => {
      gsap.killTweensOf(counter);
    };
  }, [filteredProducts.length]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setMinPrice('0');
    setMaxPrice('500');
    setSortBy('default');
    setSelectedCategories([]);
    onSelectCategory('todas');
  };

  const isFiltered =
    selectedCategories.length > 0 ||
    (selectedCategory !== 'todas' && selectedCategory !== '') ||
    searchTerm.trim() !== '' ||
    minPrice !== '0' ||
    maxPrice !== '500' ||
    sortBy !== 'default';

  const filterContent = (isMobile = false) => {
    const searchId = isMobile ? 'searchProduct_mobile' : 'searchProduct';
    const minId = isMobile ? 'minPriceInput_mobile' : 'minPriceInput';
    const maxId = isMobile ? 'maxPriceInput_mobile' : 'maxPriceInput';

    return (
      <>
        <div className="flex items-center justify-between pb-3 border-b border-[#E2ECEC] shrink-0">
          <h2 className="font-bold text-sm text-[#213B3E] flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#437579]" />
            <span>Filtros del Catálogo</span>
          </h2>
          <div className="flex items-center gap-2">
            {isFiltered && (
              <button
                onClick={handleResetFilters}
                className="text-[11px] text-rose-600 hover:underline font-bold flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-rose-500 rounded-md"
                aria-label="Restablecer todos los filtros"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Limpiar</span>
              </button>
            )}
            {isMobile && (
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-1.5 rounded-full hover:bg-[#E2ECEC] text-[#213B3E] focus:outline-none focus:ring-2 focus:ring-[#437579]"
                aria-label="Cerrar panel de filtros"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* 1. Buscador */}
        <div className="relative">
          <input
            type="text"
            id={searchId}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder=" "
            aria-label="Buscar por nombre, descripción o color"
            className="peer w-full bg-[#F8F5EF] border border-[#C4D8D9] rounded-2xl px-4 pt-5 pb-2 text-xs font-semibold text-[#213B3E] focus:outline-none focus:border-[#437579] focus:bg-white transition-all shadow-sm"
          />
          <label
            htmlFor={searchId}
            className="absolute left-4 top-2 text-[10px] font-bold text-[#437579] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs peer-placeholder-shown:font-normal peer-placeholder-shown:text-[#597477] peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:font-bold peer-focus:text-[#437579] pointer-events-none"
          >
            Buscar por nombre, color o prenda...
          </label>
        </div>

        {/* 2. Marco de Selección Múltiple (Checkboxes) accesibles */}
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#597477] flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-[#437579]" />
              <span>Categorías de Tejidos</span>
            </span>
            <button
              onClick={handleToggleAllCategories}
              className="text-[10px] font-bold text-[#437579] hover:underline focus:outline-none"
              aria-label={selectedCategories.length === CATEGORY_TABS.length ? 'Desmarcar todas las categorías' : 'Marcar todas las categorías'}
            >
              {selectedCategories.length === CATEGORY_TABS.length ? 'Desmarcar' : 'Marcar todas'}
            </button>
          </div>

          <div className="space-y-1.5" role="group" aria-label="Filtro de categorías">
            {CATEGORY_TABS.map((tab) => {
              const isChecked = selectedCategories.includes(tab.id) || selectedCategory === tab.id;
              const count = categoryCounts[tab.id] || 0;
              return (
                <button
                  type="button"
                  key={tab.id}
                  onClick={() => handleToggleCategory(tab.id)}
                  role="checkbox"
                  aria-checked={isChecked}
                  aria-label={`Filtrar categoría ${tab.label}`}
                  className={`w-full flex items-center justify-between p-2.5 px-3 rounded-2xl cursor-pointer transition-all border text-left focus:outline-none focus:ring-2 focus:ring-[#437579] ${
                    isChecked
                      ? 'bg-[#437579]/10 border-[#437579] text-[#437579] font-bold shadow-sm'
                      : 'bg-[#F8F5EF] border-[#C4D8D9]/70 text-[#213B3E] hover:bg-[#E2ECEC]'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                        isChecked
                          ? 'bg-[#437579] border-[#437579] text-white'
                          : 'border-[#437579]/40 bg-white'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="text-xs font-bold truncate">{tab.label}</span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ml-2 ${
                      isChecked
                        ? 'bg-[#437579] text-white shadow-sm'
                        : 'bg-[#E2ECEC] text-[#437579]'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Filtro de Rango Manual de Precio */}
        <div className="space-y-3 pt-3 border-t border-[#E2ECEC]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#213B3E] flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              <span>Rango Manual de Precio</span>
            </span>
            <span className="text-[10px] font-extrabold text-[#437579] bg-[#E2ECEC] px-2 py-0.5 rounded-full">
              S/ {displayMin} - S/ {displayMax}
            </span>
          </div>

          {priceRangeInvalid && (
            <div className="p-2.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-bold flex items-center gap-1.5" role="alert">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>El precio mínimo no puede ser mayor al precio máximo.</span>
            </div>
          )}

          <div className="space-y-1">
            <label htmlFor={isMobile ? 'priceSlider_mobile' : 'priceSlider'} className="sr-only">Rango máximo de precio</label>
            <input
              type="range"
              id={isMobile ? 'priceSlider_mobile' : 'priceSlider'}
              min="0"
              max="500"
              step="5"
              value={displayMax}
              onChange={(e) => handleMaxPriceChange(e.target.value)}
              aria-label="Seleccionar precio máximo"
              className="w-full h-2 bg-[#E2ECEC] rounded-lg appearance-none cursor-pointer accent-[#437579]"
            />
            <div className="flex justify-between text-[9px] font-bold text-[#597477]">
              <span>S/ 0</span>
              <span>S/ 250</span>
              <span>S/ 500</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="relative">
              <input
                type="number"
                id={minId}
                min="0"
                max="500"
                value={minPrice}
                onChange={(e) => handleMinPriceChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                    e.preventDefault();
                  }
                }}
                placeholder=" "
                className="peer w-full bg-[#F8F5EF] border border-[#C4D8D9] rounded-2xl px-3 pt-5 pb-1.5 text-xs font-bold text-[#213B3E] focus:outline-none focus:border-[#437579] focus:bg-white shadow-sm"
              />
              <label
                htmlFor={minId}
                className="absolute left-3 top-1.5 text-[9px] font-bold text-[#437579] transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-xs peer-placeholder-shown:font-normal peer-placeholder-shown:text-[#597477] peer-focus:top-1.5 peer-focus:text-[9px] peer-focus:font-bold peer-focus:text-[#437579] pointer-events-none"
              >
                Mínimo (S/)
              </label>
            </div>

            <div className="relative">
              <input
                type="number"
                id={maxId}
                min="0"
                max="500"
                value={maxPrice}
                onChange={(e) => handleMaxPriceChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                    e.preventDefault();
                  }
                }}
                placeholder=" "
                className="peer w-full bg-[#F8F5EF] border border-[#C4D8D9] rounded-2xl px-3 pt-5 pb-1.5 text-xs font-bold text-[#213B3E] focus:outline-none focus:border-[#437579] focus:bg-white shadow-sm"
              />
              <label
                htmlFor={maxId}
                className="absolute left-3 top-1.5 text-[9px] font-bold text-[#437579] transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-xs peer-placeholder-shown:font-normal peer-placeholder-shown:text-[#597477] peer-focus:top-1.5 peer-focus:text-[9px] peer-focus:font-bold peer-focus:text-[#437579] pointer-events-none"
              >
                Máximo (S/)
              </label>
            </div>
          </div>
        </div>

        {/* 4. Ordenar Por */}
        <div className="space-y-1.5 pt-2 border-t border-[#E2ECEC]">
          <label htmlFor={isMobile ? 'sortBy_mobile' : 'sortBy'} className="block text-xs font-bold text-[#213B3E] flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#437579]" />
            <span>Ordenar Por</span>
          </label>
          <select
            id={isMobile ? 'sortBy_mobile' : 'sortBy'}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'default' | 'price-asc' | 'price-desc' | 'name-asc')}
            aria-label="Ordenar catálogo por"
            className="w-full bg-[#F8F5EF] border border-[#C4D8D9] rounded-2xl px-3.5 py-2.5 text-xs font-bold text-[#213B3E] focus:outline-none focus:border-[#437579] shadow-sm"
          >
            <option value="default">Recomendados</option>
            <option value="price-asc">Precio: Menor a Mayor</option>
            <option value="price-desc">Precio: Mayor a Menor</option>
            <option value="name-asc">Nombre (A-Z)</option>
          </select>
        </div>

        {isMobile && (
          <button
            onClick={() => setMobileFiltersOpen(false)}
            className="w-full bg-[#437579] hover:bg-[#335C60] text-white font-bold py-3 rounded-2xl text-xs uppercase tracking-wider shadow-md mt-2"
          >
            Ver {filteredProducts.length} Resultados
          </button>
        )}
      </>
    );
  };

  return (
    <section id="catalogo" className="py-3 bg-[#F8F5EF] text-[#213B3E] relative">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Encabezado Principal del Catálogo (H1 Estructurado para SEO) */}
        <div className="text-center space-y-1.5 sm:space-y-2 max-w-2xl mx-auto mb-3 sm:mb-6">
          <div className="inline-flex items-center space-x-2 bg-white border border-[#C4D8D9] px-3 sm:px-4 py-1 rounded-full text-[10px] sm:text-xs font-bold text-[#437579] shadow-sm">
            <Tag className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#437579]" />
            <span>Colecciones Exclusivas Hechas a Mano</span>
          </div>

          <h1 className="font-serif text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#213B3E]">
            Catálogo de Prendas & Tejidos
          </h1>

          <p className="text-[#597477] text-[11px] sm:text-xs lg:text-sm leading-relaxed font-normal hidden sm:block">
            Descubre nuestras blusas caladas, vestidos de ensueño, vinchas y mantelería elaborados con hilos de algodón peruano.
          </p>
        </div>

        {/* Buscador Directo Visible en Móvil */}
        <div className="relative mb-3 lg:hidden max-w-md mx-auto">
          <label htmlFor="mobileDirectSearch" className="sr-only">Buscar prendas</label>
          <input
            type="text"
            id="mobileDirectSearch"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 Buscar prenda por nombre, color o tipo..."
            aria-label="Buscar prendas directamente"
            className="w-full bg-white border border-[#C4D8D9] rounded-2xl pl-4 pr-10 py-2.5 text-xs font-semibold text-[#213B3E] focus:outline-none focus:border-[#437579] shadow-sm transition-all"
          />
          {searchTerm ? (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#597477] hover:text-[#213B3E]"
              aria-label="Limpiar búsqueda"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
        </div>

        {/* Barra de Categorías Móvil */}
        <div className="lg:hidden mb-3">
          <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Categorías de prendas móvil">
            <button
              onClick={() => handleResetFilters()}
              role="tab"
              aria-selected={selectedCategories.length === 0 && selectedCategory === 'todas'}
              className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all border ${
                selectedCategories.length === 0 && selectedCategory === 'todas'
                  ? 'bg-[#437579] text-white border-[#437579] shadow-sm'
                  : 'bg-white text-[#213B3E] border-[#C4D8D9]'
              }`}
            >
              Todas ({products.length})
            </button>
            {CATEGORY_TABS.map((tab) => {
              const isChecked = selectedCategories.includes(tab.id) || selectedCategory === tab.id;
              const count = categoryCounts[tab.id] || 0;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isChecked}
                  onClick={() => handleToggleCategory(tab.id)}
                  className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all border ${
                    isChecked
                      ? 'bg-[#437579] text-white border-[#437579] shadow-sm'
                      : 'bg-white text-[#213B3E] border-[#C4D8D9]'
                  }`}
                >
                  {tab.label} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Layout en Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6 items-start">
          
          {/* Botón de filtros móvil */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              aria-label="Abrir panel de filtros de precio y búsqueda"
              className="w-full flex items-center justify-center space-x-2 bg-white border border-[#C4D8D9] text-[#213B3E] font-bold text-xs py-2.5 rounded-2xl shadow-sm"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#437579]" />
              <span>Filtro por Rango de Precio & Búsqueda</span>
              {isFiltered && (
                <span className="bg-[#D97B84] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Activos
                </span>
              )}
            </button>
          </div>

          {/* Sidebar Lateral de Filtros — Desktop */}
          <aside className="hidden lg:block lg:col-span-4 xl:col-span-3 bg-white p-5 rounded-3xl border border-[#C4D8D9] shadow-lg space-y-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-6.5rem)] lg:overflow-y-auto shrink-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {filterContent(false)}
          </aside>

          {/* Sidebar Lateral de Filtros — Mobile Overlay WAI-ARIA Modal */}
          {mobileFiltersOpen && (
            <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Panel de Filtros del Catálogo">
              <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={() => setMobileFiltersOpen(false)} />
              <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl border-t border-[#C4D8D9] shadow-2xl p-4 space-y-3 max-h-[85vh] overflow-y-auto safe-bottom animate-in slide-in-from-bottom duration-300">
                {filterContent(true)}
              </div>
            </div>
          )}

          {/* Área Principal de Productos */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-3 sm:space-y-5">
            
            <div className="flex items-center justify-between bg-white px-3.5 sm:px-6 py-2 sm:py-3.5 rounded-2xl border border-[#C4D8D9] shadow-sm text-xs">
              <span className="text-[#597477] font-semibold text-[11px] sm:text-xs">
                <strong ref={counterRef} className="text-[#437579] font-bold inline-block">{filteredProducts.length}</strong> prendas encontradas
              </span>

              {isFiltered && (
                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center space-x-1 text-xs text-rose-600 font-bold hover:underline focus:outline-none"
                  aria-label="Restablecer filtros de búsqueda"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restablecer</span>
                </button>
              )}
            </div>

            {/* Grilla de Productos */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 sm:py-16 bg-white rounded-3xl border border-[#C4D8D9] p-6 sm:p-8 max-w-md mx-auto space-y-3 shadow-sm animate-in fade-in zoom-in-95 duration-200">
                <div className="w-12 h-12 rounded-full bg-[#E2ECEC] text-[#437579] flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#213B3E]">
                  No se encontraron prendas en este rango
                </h3>
                <p className="text-[11px] sm:text-xs text-[#597477]">
                  Prueba ajustando los filtros o borrando el texto del buscador.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center space-x-1.5 mt-2 text-xs font-bold bg-[#437579] text-white hover:bg-[#335C60] px-4 py-2 rounded-xl shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-[#437579]"
                  aria-label="Restablecer filtros del catálogo"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restablecer Filtros</span>
                </button>
              </div>
            ) : (
              <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="catalog-card-item">
                    <ProductCard
                      product={product}
                      onOpenModal={onOpenModal}
                      onAddToCart={onAddToCart}
                    />
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
