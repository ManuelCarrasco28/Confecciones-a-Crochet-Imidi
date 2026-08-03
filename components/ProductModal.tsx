'use client';

import React, { useState } from 'react';
import { X, ShoppingBag, Check, Heart } from 'lucide-react';
import { Product, YARN_OPTIONS } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

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
  const [prevProductId, setPrevProductId] = useState<string | null>(null);
  const availableYarns = product?.yarnTypes && product.yarnTypes.length > 0 ? product.yarnTypes : YARN_OPTIONS;

  const [selectedYarn, setSelectedYarn] = useState<string>(availableYarns[0]);
  const [selectedColor, setSelectedColor] = useState<string>(
    product?.colors && product.colors.length > 0 ? product.colors[0] : 'Turquesa Imidi (Original)'
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    product?.sizes && product.sizes.length > 0 ? product.sizes[0] : 'M'
  );
  const [customNotes, setCustomNotes] = useState<string>('');
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);

  // Patrón recomendado por React para reiniciar estado derivado al cambiar de prop
  if (product && product.id !== prevProductId) {
    setPrevProductId(product.id);
    const yarns = product.yarnTypes && product.yarnTypes.length > 0 ? product.yarnTypes : YARN_OPTIONS;
    setSelectedYarn(yarns[0]);
    setSelectedColor(product.colors && product.colors.length > 0 ? product.colors[0] : 'Turquesa Imidi (Original)');
    setSelectedSize(product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'M');
    setCustomNotes('');
    setAddedSuccess(false);
  }

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, selectedSize, selectedColor, customNotes.trim(), selectedYarn);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white border-t sm:border border-[#C4D8D9] rounded-t-3xl sm:rounded-3xl w-full sm:max-w-2xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200 text-[#213B3E] max-h-[95dvh] sm:max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-white text-[#213B3E] transition-colors shadow-md border border-[#C4D8D9]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col sm:grid sm:grid-cols-2 overflow-y-auto flex-1">
          
          {/* Imagen del Producto */}
          <div className="relative h-[35vh] sm:h-auto sm:aspect-auto bg-[#F8F5EF] overflow-hidden shrink-0">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            
            {/* Aviso de Modelo Confeccionado a Pedido */}
            <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-white/95 backdrop-blur-md px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-[#C4D8D9] shadow-md flex items-center gap-1 sm:gap-1.5">
              <Heart className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#D97B84] fill-[#D97B84]" />
              <span className="text-[9px] sm:text-[10px] font-extrabold text-[#437579] uppercase tracking-wider">
                Tejido a Pedido
              </span>
            </div>

            {!product.inStock && (
              <div className="absolute inset-0 bg-stone-900/50 backdrop-blur-[2px] flex items-center justify-center">
                <span className="bg-rose-600 text-white font-bold text-xs uppercase px-4 py-2 rounded-full shadow-lg">
                  Bajo Encargo / Agotado
                </span>
              </div>
            )}
          </div>

          {/* Información y Opciones de Confección */}
          <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-5 flex flex-col justify-between overflow-y-auto">
            
            <div className="space-y-3 sm:space-y-4">
              <div>
                <span className="text-[10px] sm:text-[11px] font-bold text-[#437579] uppercase tracking-wider bg-[#E2ECEC] px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-[#437579]/20">
                  {product.category}
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#213B3E] mt-2 leading-tight">
                  {product.name}
                </h2>
                <div className="text-xl sm:text-2xl font-bold text-[#437579] mt-1">
                  {formatCurrency(product.price)}
                </div>
              </div>

              {/* Banner Informativo del Modelo a Pedido */}
              <div className="bg-[#F8F5EF] border border-[#C4D8D9] p-2.5 sm:p-3 rounded-xl sm:rounded-2xl text-[10px] sm:text-[11px] text-[#3E5C60] space-y-1">
                <p className="font-bold text-[#437579] flex items-center gap-1">
                  <span>🧶 Modelo para Confección a Mano</span>
                </p>
                <p className="text-[9px] sm:text-[10px] text-[#597477]">
                  Este producto es un diseño de muestra. Al realizar tu pedido, nuestras artesanas comenzarán el tejido a mano en la talla, hilo y color elegidos.
                </p>
              </div>

              <p className="text-[11px] sm:text-xs text-[#597477] leading-relaxed">
                {product.description}
              </p>

              {/* Selector de Tipo de Hilo */}
              <div className="space-y-1.5">
                <label className="block text-[11px] sm:text-xs font-bold text-[#213B3E]">
                  Tipo de Hilo Preferido:
                </label>
                <div className="grid grid-cols-2 gap-1.5 text-[11px] sm:text-xs">
                  {availableYarns.map((yarn) => (
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
                  {product.colors.map((col) => (
                    <option key={col} value={col}>
                      🎨 {col}
                    </option>
                  ))}
                </select>
              </div>

              {/* Selector de Talla */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-1.5">
                  <label className="block text-[11px] sm:text-xs font-bold text-[#213B3E]">
                    Talla o Dimensión:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {product.sizes.map((size) => (
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
              )}

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
