'use client';

import React, { useState, useMemo } from 'react';
import { Product, CategoryType } from '@/lib/types';
import { ProductCard } from '@/components/ProductCard';
import { Sparkles, Search, Filter, DollarSign, RotateCcw, ArrowUpDown, Tag, Check } from 'lucide-react';

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
  // Estado para selección múltiple de categorías
  const [selectedCategories, setSelectedCategories] = useState<CategoryType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado para rango de precio manual (estrictamente 0 a 500 S/)
  const [minPrice, setMinPrice] = useState<string>('0');
  const [maxPrice, setMaxPrice] = useState<string>('500');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'name-asc'>('default');



  // Conteo de productos por categoría
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Alternar selección de una categoría (Selección Múltiple)
  const handleToggleCategory = (catId: CategoryType) => {
    setSelectedCategories((prev) => {
      if (prev.includes(catId)) {
        return prev.filter((id) => id !== catId);
      } else {
        return [...prev, catId];
      }
    });
  };

  // Seleccionar / Deseleccionar Todas
  const handleToggleAllCategories = () => {
    if (selectedCategories.length === CATEGORY_TABS.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(CATEGORY_TABS.map((c) => c.id));
    }
  };

  // Manejadores con Validación Estricta: Sin negativos ni mayores a 500
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

  // Valores seguros delimitados estrictamente entre 0 y 500
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

  // Cálculo de productos filtrados y ordenados
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // 1. Filtro por Selección Múltiple de Categorías
        const activeCategories = selectedCategories.length > 0
          ? selectedCategories
          : (selectedCategory && selectedCategory !== 'todas' ? [selectedCategory] : []);

        const matchesCategory =
          activeCategories.length === 0 || activeCategories.includes(p.category);
        
        // 2. Filtro por Nombre / Búsqueda
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              p.description.toLowerCase().includes(searchTerm.toLowerCase());

        // 3. Filtro por Rango Manual de Precio Estricto (0 a 500 S/)
        let matchesPrice = true;
        const price = p.price;

        if (price < displayMin) {
          matchesPrice = false;
        }
        if (price > displayMax) {
          matchesPrice = false;
        }

        return matchesCategory && matchesSearch && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [products, selectedCategories, selectedCategory, searchTerm, displayMin, displayMax, sortBy]);

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
    searchTerm !== '' ||
    minPrice !== '0' ||
    maxPrice !== '500' ||
    sortBy !== 'default';

  return (
    <section id="catalogo" className="py-3 bg-[#F8F5EF] text-[#213B3E] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Encabezado del Catálogo pegado a la barra superior */}
        <div className="text-center space-y-2 max-w-2xl mx-auto mb-6">
          <div className="inline-flex items-center space-x-2 bg-white border border-[#C4D8D9] px-4 py-1 rounded-full text-xs font-bold text-[#437579] shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#D89B53]" />
            <span>Colecciones Exclusivas Hechas a Mano</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#213B3E]">
            Catálogo de Prendas & Tejidos a Crochet
          </h2>

          <p className="text-[#597477] text-xs sm:text-sm leading-relaxed font-normal">
            Descubre nuestras blusas caladas, vestidos de ensueño, vinchas y mantelería elaborados con hilos de algodón peruano, Silvia, Tren, Fino Cable, Quesito, Pavino en Cono y Nylon.
          </p>
        </div>

        {/* Layout en Grid: Sidebar Lateral Independiente (Izquierda) + Productos (Derecha) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Sidebar Lateral de Filtros */}
          <aside className="lg:col-span-4 xl:col-span-3 bg-white p-5 rounded-3xl border border-[#C4D8D9] shadow-lg space-y-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-6.5rem)] lg:overflow-y-auto shrink-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#E2ECEC] shrink-0">
              <h3 className="font-bold text-sm text-[#213B3E] flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#437579]" />
                <span>Filtros del Catálogo</span>
              </h3>
              {isFiltered && (
                <button
                  onClick={handleResetFilters}
                  className="text-[11px] text-rose-600 hover:underline font-bold flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Limpiar</span>
                </button>
              )}
            </div>

            {/* 1. Buscador con Floating Label estilo Facebook */}
            <div className="relative">
              <input
                type="text"
                id="searchProduct"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder=" "
                className="peer w-full bg-[#F8F5EF] border border-[#C4D8D9] rounded-2xl px-4 pt-5 pb-2 text-xs font-semibold text-[#213B3E] focus:outline-none focus:border-[#437579] focus:bg-white transition-all shadow-sm"
              />
              <label
                htmlFor="searchProduct"
                className="absolute left-4 top-2 text-[10px] font-bold text-[#437579] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs peer-placeholder-shown:font-normal peer-placeholder-shown:text-[#597477] peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:font-bold peer-focus:text-[#437579] pointer-events-none"
              >
                Buscar por nombre...
              </label>
            </div>

            {/* 2. Marcos de Selección Múltiple (Checkboxes) para Categorías */}
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#597477] flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#437579]" />
                  <span>Categorías de Tejidos</span>
                </span>
                <button
                  onClick={handleToggleAllCategories}
                  className="text-[10px] font-bold text-[#437579] hover:underline"
                >
                  {selectedCategories.length === CATEGORY_TABS.length ? 'Desmarcar' : 'Marcar todas'}
                </button>
              </div>

              <div className="space-y-1.5">
                {CATEGORY_TABS.map((tab) => {
                  const isChecked = selectedCategories.includes(tab.id);
                  const count = categoryCounts[tab.id] || 0;
                  return (
                    <label
                      key={tab.id}
                      onClick={() => handleToggleCategory(tab.id)}
                      className={`w-full flex items-center justify-between p-2 px-3 rounded-2xl cursor-pointer transition-all border ${
                        isChecked
                          ? 'bg-[#437579]/10 border-[#437579] text-[#437579] font-bold shadow-sm'
                          : 'bg-[#F8F5EF] border-[#C4D8D9]/70 text-[#213B3E] hover:bg-[#E2ECEC]'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        {/* Casilla de Marco / Checkbox */}
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

                      {/* Contador de Productos */}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ml-2 ${
                          isChecked
                            ? 'bg-[#437579] text-white shadow-sm'
                            : 'bg-[#E2ECEC] text-[#437579]'
                        }`}
                      >
                        {count}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 3. Filtro de Rango Manual de Precio Estricto (0 a 500 S/) */}
            <div className="space-y-3 pt-3 border-t border-[#E2ECEC]">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#213B3E] flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Rango Manual de Precio</span>
                </label>
                <span className="text-[10px] font-extrabold text-[#437579] bg-[#E2ECEC] px-2 py-0.5 rounded-full">
                  S/ {displayMin} - S/ {displayMax}
                </span>
              </div>

              {/* Slider Interactivo de Precio Máximo */}
              <div className="space-y-1">
                <input
                  type="range"
                  min="0"
                  max="500"
                  step="5"
                  value={displayMax}
                  onChange={(e) => handleMaxPriceChange(e.target.value)}
                  className="w-full h-2 bg-[#E2ECEC] rounded-lg appearance-none cursor-pointer accent-[#437579]"
                />
                <div className="flex justify-between text-[9px] font-bold text-[#597477]">
                  <span>S/ 0</span>
                  <span>S/ 250</span>
                  <span>S/ 500</span>
                </div>
              </div>

              {/* Entradas Manuales de Mínimo y Máximo Validadas (Sin Negativos / Max 500) */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="relative">
                  <input
                    type="number"
                    id="minPriceInput"
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
                    htmlFor="minPriceInput"
                    className="absolute left-3 top-1.5 text-[9px] font-bold text-[#437579] transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-xs peer-placeholder-shown:font-normal peer-placeholder-shown:text-[#597477] peer-focus:top-1.5 peer-focus:text-[9px] peer-focus:font-bold peer-focus:text-[#437579] pointer-events-none"
                  >
                    Mínimo (S/)
                  </label>
                </div>

                <div className="relative">
                  <input
                    type="number"
                    id="maxPriceInput"
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
                    htmlFor="maxPriceInput"
                    className="absolute left-3 top-1.5 text-[9px] font-bold text-[#437579] transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-xs peer-placeholder-shown:font-normal peer-placeholder-shown:text-[#597477] peer-focus:top-1.5 peer-focus:text-[9px] peer-focus:font-bold peer-focus:text-[#437579] pointer-events-none"
                  >
                    Máximo (S/)
                  </label>
                </div>
              </div>
            </div>

            {/* 4. Ordenar Por */}
            <div className="space-y-1.5 pt-2 border-t border-[#E2ECEC]">
              <label className="block text-xs font-bold text-[#213B3E] flex items-center gap-1.5">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#437579]" />
                <span>Ordenar Por</span>
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'default' | 'price-asc' | 'price-desc' | 'name-asc')}
                className="w-full bg-[#F8F5EF] border border-[#C4D8D9] rounded-2xl px-3.5 py-2.5 text-xs font-bold text-[#213B3E] focus:outline-none focus:border-[#437579] shadow-sm"
              >
                <option value="default">Recomendados</option>
                <option value="price-asc">Precio: Menor a Mayor</option>
                <option value="price-desc">Precio: Mayor a Menor</option>
                <option value="name-asc">Nombre (A-Z)</option>
              </select>
            </div>

          </aside>

          {/* Área Principal de Productos (Derecha) */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-5">
            
            <div className="flex items-center justify-between bg-white px-6 py-3.5 rounded-2xl border border-[#C4D8D9] shadow-sm text-xs">
              <span className="text-[#597477] font-semibold">
                Mostrando <strong className="text-[#437579] font-bold">{filteredProducts.length}</strong> prendas disponibles
              </span>

              {isFiltered && (
                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center space-x-1 text-xs text-rose-600 font-bold hover:underline"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restablecer Filtros</span>
                </button>
              )}
            </div>

            {/* Grilla de Productos */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-[#C4D8D9] p-8 max-w-md mx-auto space-y-3 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-[#E2ECEC] text-[#437579] flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#213B3E]">
                  No se encontraron prendas en este rango de precio
                </h3>
                <p className="text-xs text-[#597477]">
                  Ajusta el precio Mínimo y Máximo en el panel lateral (S/ 0 - S/ 500).
                </p>
                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center space-x-1.5 mt-2 text-xs font-bold bg-[#437579] text-[#213B3E] hover:bg-[#335C60] hover:text-white px-4 py-2 rounded-xl shadow-md transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restablecer Filtros</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOpenModal={onOpenModal}
                    onAddToCart={onAddToCart}
                  />
                ))}
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
