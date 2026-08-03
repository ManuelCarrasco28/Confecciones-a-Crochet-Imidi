'use client';

import React, { useState } from 'react';
import { X, ShoppingBag, Check, Sparkles } from 'lucide-react';
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
  // Regla de Hooks de React: Declarar Hooks SIEMPRE en la parte superior antes de retornos condicionales
  const [selectedYarn, setSelectedYarn] = useState<string>(
    product?.yarnTypes && product.yarnTypes.length > 0 ? product.yarnTypes[0] : YARN_OPTIONS[0]
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    product?.colors && product.colors.length > 0 ? product.colors[0] : 'Turquesa Imidi (Original)'
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    product?.sizes && product.sizes.length > 0 ? product.sizes[0] : 'M'
  );
  const [customNotes, setCustomNotes] = useState<string>('');
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, selectedSize, selectedColor, customNotes, selectedYarn);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white border border-[#C4D8D9] rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-[#213B3E]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-white text-[#213B3E] transition-colors shadow-md border border-[#C4D8D9]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Imagen del Producto */}
          <div className="relative aspect-square md:aspect-auto bg-[#F8F5EF] overflow-hidden">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            
            {/* Aviso de Modelo Confeccionado a Pedido */}
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#C4D8D9] shadow-md flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#D89B53]" />
              <span className="text-[10px] font-extrabold text-[#437579] uppercase tracking-wider">
                Tejido a Pedido
              </span>
            </div>

            {!product.inStock && (
              <div className="absolute inset-0 bg-stone-900/50 backdrop-blur-[2px] flex items-center justify-center">
                <span className="bg-rose-600 text-white font-bold text-xs uppercase px-4 py-2 rounded-full shadow-lg">
                  No Disponible Temporalmente
                </span>
              </div>
            )}
          </div>

          {/* Información y Opciones de Confección */}
          <div className="p-6 sm:p-8 space-y-5 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
            
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-bold text-[#437579] uppercase tracking-wider bg-[#E2ECEC] px-2.5 py-1 rounded-full border border-[#437579]/20">
                  {product.category}
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#213B3E] mt-2 leading-tight">
                  {product.name}
                </h2>
                <div className="text-2xl font-bold text-[#437579] mt-1">
                  {formatCurrency(product.price)}
                </div>
              </div>

              {/* Banner Informativo del Modelo a Pedido */}
              <div className="bg-[#F8F5EF] border border-[#C4D8D9] p-3 rounded-2xl text-[11px] text-[#3E5C60] space-y-1">
                <p className="font-bold text-[#437579] flex items-center gap-1">
                  <span>🧶 Modelo para Confección a Mano</span>
                </p>
                <p className="text-[10px] text-[#597477]">
                  Este producto es un diseño de muestra. Al realizar tu pedido, nuestras artesanas comenzarán el tejido a mano en la talla, hilo y color elegidos.
                </p>
              </div>

              <p className="text-xs text-[#597477] leading-relaxed">
                {product.description}
              </p>

              {/* Selector de Tipo de Hilo */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#213B3E]">
                  Tipo de Hilo Preferido:
                </label>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  {YARN_OPTIONS.map((yarn) => (
                    <button
                      key={yarn}
                      type="button"
                      onClick={() => setSelectedYarn(yarn)}
                      className={`px-2.5 py-1.5 rounded-xl border font-bold text-left transition-all ${
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
                <label className="block text-xs font-bold text-[#213B3E]">
                  Color de Hilo:
                </label>
                <select
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-full bg-[#F8F5EF] border border-[#C4D8D9] rounded-xl px-3 py-2 text-xs font-semibold text-[#213B3E] focus:outline-none focus:border-[#437579]"
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
                  <label className="block text-xs font-bold text-[#213B3E]">
                    Talla o Dimensión:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-1 rounded-xl border text-xs font-bold transition-all ${
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
                <label className="block text-xs font-bold text-[#213B3E]">
                  Indicaciones o Medidas (Opcional):
                </label>
                <input
                  type="text"
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder="Ej. Largo 55cm, escote más cerrado..."
                  className="w-full bg-[#F8F5EF] border border-[#C4D8D9] rounded-xl px-3 py-2 text-xs text-[#213B3E] focus:outline-none focus:border-[#437579]"
                />
              </div>

            </div>

            {/* Acciones de Añadir */}
            <div className="pt-4 border-t border-[#E2ECEC] space-y-2">
              <button
                onClick={handleAdd}
                disabled={!product.inStock || addedSuccess}
                className={`w-full inline-flex items-center justify-center space-x-2 font-bold py-3 px-4 rounded-2xl shadow-md transition-all text-xs uppercase tracking-wider ${
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
