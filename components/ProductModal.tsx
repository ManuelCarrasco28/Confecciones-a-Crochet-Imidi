'use client';

import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Check } from 'lucide-react';
import { Product } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { getStoredAttributes, StoreAttributes } from '@/lib/attributes';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (
    product: Product,
    selectedSize?: string,
    selectedColor?: string,
    customNotes?: string,
    selectedYarn?: string
  ) => void;
}

export function ProductModal({ product, onClose, onAddToCart }: ProductModalProps) {
  const [storeAttrs, setStoreAttrs] = useState<StoreAttributes>(getStoredAttributes);

  useEffect(() => {
    const handleUpdate = () => setStoreAttrs(getStoredAttributes());
    window.addEventListener('imidi_attributes_updated', handleUpdate);
    return () => window.removeEventListener('imidi_attributes_updated', handleUpdate);
  }, []);

  const [prevProductId, setPrevProductId] = useState<string | null>(null);

  const [selectedYarn, setSelectedYarn] = useState<string>(storeAttrs.yarns[0] || 'Algodón');
  const [selectedColor, setSelectedColor] = useState<string>(
    product?.colors && product.colors.length > 0 ? product.colors[0] : (storeAttrs.colors[0] || 'Rosa Pastel')
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    product?.sizes && product.sizes.length > 0 ? product.sizes[0] : (storeAttrs.sizes[0] || 'M')
  );
  const [customNotes, setCustomNotes] = useState<string>('');
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);

  // Patrón recomendado por React para reiniciar estado derivado al cambiar de prop
  if (product && product.id !== prevProductId) {
    setPrevProductId(product.id);
    setSelectedYarn(storeAttrs.yarns[0] || 'Algodón');
    setSelectedColor(product.colors && product.colors.length > 0 ? product.colors[0] : (storeAttrs.colors[0] || 'Rosa Pastel'));
    setSelectedSize(product.sizes && product.sizes.length > 0 ? product.sizes[0] : (storeAttrs.sizes[0] || 'M'));
    setCustomNotes('');
    setAddedSuccess(false);
  }

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, selectedSize, selectedColor, customNotes, selectedYarn);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl border border-[#C4D8D9] overflow-hidden flex flex-col max-h-[92vh] relative">
        
        {/* Botón de Cierre con animación */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 bg-white/80 hover:bg-rose-50 text-[#213B3E] hover:text-rose-600 p-2 rounded-full border border-[#C4D8D9] shadow-md transition-all hover:scale-105"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Modal Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-start">
            
            {/* Contenedor Imagen del Producto */}
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#F2F7F7] border border-[#C4D8D9] shadow-inner group">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-[#437579] text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full shadow-md">
                Prenda Artesanal
              </div>
            </div>

            {/* Detalles & Configuraciones de Confección */}
            <div className="space-y-3.5 sm:space-y-4 flex flex-col justify-between">
              
              <div>
                <span className="text-[10px] sm:text-xs font-extrabold text-[#D97B84] tracking-wider uppercase block mb-1">
                  Categoría: {product.category}
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#213B3E]">
                  {product.name}
                </h2>
                <div className="text-xl sm:text-2xl font-bold text-[#437579] mt-1">
                  {formatCurrency(product.price)}
                </div>
              </div>

              {/* Selector de Tipo de Hilo */}
              <div className="space-y-1.5">
                <label className="block text-[11px] sm:text-xs font-bold text-[#213B3E]">
                  Tipo de Hilo Preferido:
                </label>
                <div className="grid grid-cols-2 gap-1.5 text-[11px] sm:text-xs">
                  {storeAttrs.yarns.map((yarn) => (
                    <button
                      key={yarn}
                      type="button"
                      onClick={() => setSelectedYarn(yarn)}
                      className={`px-2 sm:px-2.5 py-1.5 sm:py-1.5 rounded-lg sm:rounded-xl border font-bold text-left transition-all ${
                        selectedYarn === yarn
                          ? 'border-[#437579] bg-[#E2ECEC] text-[#437579]'
                          : 'border-[#C4D8D9] bg-white text-[#597477] hover:border-[#437579]'
                      }`}
                    >
                      🧵 {yarn}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selector de Color */}
              <div className="space-y-1.5">
                <label className="block text-[11px] sm:text-xs font-bold text-[#213B3E]">
                  Color de Hilo:
                </label>
                <select
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-full bg-[#F8F5EF] border border-[#C4D8D9] rounded-xl px-3 py-2.5 text-xs font-semibold text-[#213B3E] focus:outline-none focus:border-[#437579]"
                >
                  {storeAttrs.colors.map((col) => (
                    <option key={col} value={col}>
                      🎨 {col}
                    </option>
                  ))}
                </select>
              </div>

              {/* Selector de Talla */}
              <div className="space-y-1.5">
                <label className="block text-[11px] sm:text-xs font-bold text-[#213B3E]">
                  Talla o Dimensión:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {storeAttrs.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                        selectedSize === size
                          ? 'border-[#437579] bg-[#437579] text-white shadow-sm'
                          : 'border-[#C4D8D9] bg-white text-[#597477] hover:border-[#437579]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notas de Ajustes Personalizados */}
              <div className="space-y-1">
                <label className="block text-[11px] sm:text-xs font-bold text-[#213B3E]">
                  Indicaciones o Medidas (Opcional):
                </label>
                <input
                  type="text"
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder="Ej. Largo 55cm, escote más cerrado..."
                  className="w-full bg-[#F8F5EF] border border-[#C4D8D9] rounded-xl px-3 py-2.5 text-xs text-[#213B3E] focus:outline-none focus:border-[#437579]"
                />
              </div>

            </div>

            {/* Acciones de Añadir */}
            <div className="pt-3 sm:pt-4 border-t border-[#E2ECEC] space-y-2 shrink-0">
              <button
                onClick={handleAdd}
                disabled={!product.inStock || addedSuccess}
                className={`w-full inline-flex items-center justify-center space-x-2 font-bold py-3.5 px-4 rounded-xl sm:rounded-2xl shadow-md transition-all text-xs uppercase tracking-wider ${
                  addedSuccess
                    ? 'bg-emerald-600 text-white'
                    : product.inStock
                    ? 'bg-[#437579] hover:bg-[#335C60] text-white'
                    : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                }`}
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>¡Encargo Añadido!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Solicitar Confección a Pedido</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
