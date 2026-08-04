'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { X, Check, MessageCircle, ZoomIn, AlertCircle } from 'lucide-react';
import { Product } from '@/lib/types';
import { formatCurrency, generateWhatsAppConfiguredProductLink } from '@/lib/utils';
import { fetchStoreAttributes, getStoredAttributes, StoreAttributes } from '@/lib/attributes';
import { getCategorySizeType } from '@/lib/categories';
import { gsap } from '@/lib/gsap';

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

type ActiveProductModalProps = Omit<ProductModalProps, 'product'> & { product: Product };

export function ProductModal(props: ProductModalProps) {
  if (!props.product) return null;

  return <ProductModalContent key={props.product.id} {...props} product={props.product} />;
}

function ProductModalContent({ product, onClose, onAddToCart }: ActiveProductModalProps) {
  const [storeAttrs, setStoreAttrs] = useState<StoreAttributes>(getStoredAttributes);
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleUpdate = () => setStoreAttrs(getStoredAttributes());
    fetchStoreAttributes().then(setStoreAttrs).catch(() => {
      // Mantener atributos locales como respaldo si no hay conexión.
    });
    window.addEventListener('imidi_attributes_updated', handleUpdate);
    return () => window.removeEventListener('imidi_attributes_updated', handleUpdate);
  }, []);

  // Combinar opciones específicas del producto con los atributos globales de la tienda (para permitir personalización completa)
  const availableYarns = useMemo(() => {
    const set = new Set([...(product.yarnTypes || []), ...storeAttrs.yarns]);
    const list = Array.from(set).filter(Boolean);
    return list.length > 0 ? list : ['Algodón', 'Silvia', 'Tren', 'Fino Cable', 'Pavino en Cono'];
  }, [product.yarnTypes, storeAttrs.yarns]);

  const availableColors = useMemo(() => {
    const set = new Set([...(product.colors || []), ...storeAttrs.colors]);
    const list = Array.from(set).filter(Boolean);
    return list.length > 0 ? list : ['Rosa Pastel / Empolvado', 'Turquesa Imidi (Original)', 'Blanco Puro / Marfil', 'Azul Marino', 'Negro Azabache', 'Verde Menta', 'Lila / Morado', 'Amarillo Mostaza', 'Rojo Pasión', 'Beige / Arena'];
  }, [product.colors, storeAttrs.colors]);

  const sizeType = getCategorySizeType(product.category);

  const availableSizes = useMemo(() => {
    if (sizeType === 'unica') return ['Talla Única'];
    if (sizeType === 'dimensiones') {
      const set = new Set([...(product.sizes || []), '30x30 cm', '40x40 cm', '50x50 cm', 'A Medida']);
      return Array.from(set).filter(Boolean);
    }
    const set = new Set([...(product.sizes || []), ...storeAttrs.sizes]);
    const list = Array.from(set).filter(Boolean);
    return list.length > 0 ? list : ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'A Medida'];
  }, [product.sizes, sizeType, storeAttrs.sizes]);

  const [imageZoomed, setImageZoomed] = useState(false);
  const [selectedYarn, setSelectedYarn] = useState(() => availableYarns[0] || 'Algodón');
  const [selectedColor, setSelectedColor] = useState(() => availableColors[0] || 'Rosa Pastel');
  const [selectedSize, setSelectedSize] = useState(() => availableSizes[0] || 'M');
  const [customNotes, setCustomNotes] = useState('');
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Cierre animado envuelto en useCallback
  const handleAnimatedClose = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (!modalRef.current) {
      onClose();
      return;
    }
    gsap.to(modalRef.current, {
      scale: 0.94,
      opacity: 0,
      y: 10,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: onClose,
    });
  }, [onClose]);

  // Bloquear scroll del body y gestionar foco
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    document.body.style.overflow = 'hidden';
    if (modalRef.current) modalRef.current.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      previousFocus?.focus();
    };
  }, []);

  // Animación de entrada GSAP
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return;

    const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
    if (backdropRef.current) {
      timeline.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2 });
    }
    if (modalRef.current) {
      timeline.fromTo(modalRef.current, { scale: 0.94, opacity: 0, y: 15 }, { scale: 1, opacity: 1, y: 0, duration: 0.35 }, '-=0.1');
    }

    return () => {
      timeline.kill();
    };
  }, []);

  // Cerrar con Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (imageZoomed) setImageZoomed(false);
        else handleAnimatedClose();
        return;
      }

      if (e.key === 'Tab' && modalRef.current && !imageZoomed) {
        const focusable = Array.from(
          modalRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), select:not([disabled]), textarea:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleAnimatedClose, imageZoomed]);

  const handleAdd = () => {
    if (product.inStock === false) return;
    onAddToCart(product, selectedSize, selectedColor, customNotes, selectedYarn);
    setAddedSuccess(true);
    timeoutRef.current = setTimeout(() => {
      setAddedSuccess(false);
      handleAnimatedClose();
    }, 1200);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      handleAnimatedClose();
    }
  };

  return (
    <>
      {/* Modal Principal con WAI-ARIA Role Dialog */}
      <div
        ref={backdropRef}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm"
        onClick={handleBackdropClick}
      >
        <div
          ref={modalRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="bg-white w-full max-w-5xl rounded-2xl sm:rounded-3xl shadow-2xl border border-[#C4D8D9]/50 overflow-hidden flex flex-col max-h-[94dvh] relative focus:outline-none"
        >

          {/* Botón de Cierre */}
          <button
            type="button"
            onClick={handleAnimatedClose}
            className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-20 bg-black/40 hover:bg-rose-600 text-white p-1.5 sm:p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110 hover:rotate-90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Cerrar modal de producto"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Body del Modal */}
          <div ref={contentRef} className="overflow-y-auto flex-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-0">

              {/* Imagen del Producto */}
              <div className="relative bg-gradient-to-b from-[#E8F0F0] to-[#F2F7F7] w-full aspect-[4/5] md:aspect-auto md:h-full min-h-[300px] md:min-h-0">
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>

                {/* Badge Disponibilidad */}
                <div className={`absolute top-3 left-3 text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1 ${
                  product.inStock !== false ? 'bg-gradient-to-r from-[#437579] to-[#5A9CA0]' : 'bg-stone-600'
                }`}>
                  {product.inStock !== false ? '✨ Hecho a Mano / A Pedido' : '⚠️ Producto Agotado'}
                </div>

                {/* Botón Ampliar Imagen */}
                <button
                  type="button"
                  onClick={() => setImageZoomed(true)}
                  className="absolute bottom-3 right-3 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full shadow-lg transition-all hover:scale-110 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white"
                  title="Ver imagen en pantalla completa"
                  aria-label="Ampliar imagen"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>

              {/* Panel Derecho: Detalles */}
              <div className="p-4 sm:p-5 md:p-4 space-y-3 md:space-y-2.5 flex flex-col">

                <div>
                  <span className="text-[10px] sm:text-[11px] font-extrabold text-[#D97B84] tracking-widest uppercase">
                    {product.category}
                  </span>
                  <h2 id="modal-title" className="font-serif text-lg sm:text-xl font-bold text-[#213B3E] leading-tight mt-0.5">
                    {product.name}
                  </h2>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xl sm:text-2xl font-extrabold text-[#437579]">
                      {formatCurrency(product.price)}
                    </span>
                    <span className="text-[10px] text-[#597477] font-medium">c/u</span>
                  </div>
                </div>

                <p className="text-[#597477] text-xs leading-relaxed">
                  {product.description}
                </p>

                <div className="h-px bg-gradient-to-r from-transparent via-[#C4D8D9] to-transparent" />

                {/* Tipo de Hilo Priorizado */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] sm:text-xs font-bold text-[#213B3E]">
                    🧵 Tipo de Hilo:
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5 text-[11px] sm:text-xs" role="radiogroup" aria-label="Seleccionar tipo de hilo">
                    {availableYarns.map((yarn) => (
                      <button
                        key={yarn}
                        type="button"
                        onClick={() => setSelectedYarn(yarn)}
                        role="radio"
                        aria-checked={selectedYarn === yarn}
                        className={`px-2.5 py-1.5 md:py-1 rounded-lg border font-semibold text-left transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#437579] ${
                          selectedYarn === yarn
                            ? 'border-[#437579] bg-[#437579] text-white shadow-sm'
                            : 'border-[#C4D8D9] bg-white text-[#597477] hover:border-[#437579] hover:bg-[#F2F7F7]'
                        }`}
                      >
                        {yarn}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Priorizado */}
                <div className="space-y-1.5">
                  <label htmlFor="colorSelect" className="block text-[11px] sm:text-xs font-bold text-[#213B3E]">
                    🎨 Color de Hilo:
                  </label>
                  <select
                    id="colorSelect"
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    aria-label="Seleccionar color de hilo"
                    className="w-full bg-[#F8F5EF] border border-[#C4D8D9] rounded-xl px-3 py-2.5 md:py-2 text-xs font-semibold text-[#213B3E] focus:outline-none focus:ring-2 focus:ring-[#437579] transition-all"
                  >
                    {availableColors.map((col) => (
                      <option key={col} value={col}>
                        {col}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Talla / Medida */}
                <div className="space-y-1.5">
                  <span className="block text-[11px] sm:text-xs font-bold text-[#213B3E]">
                    {sizeType === 'unica' ? '📏 Talla:' : sizeType === 'dimensiones' ? '📐 Dimensiones:' : '📏 Talla:'}
                  </span>

                  {sizeType === 'unica' ? (
                    <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 border border-amber-300 px-3 py-2 rounded-xl text-xs font-bold shadow-sm">
                      <span>👑</span>
                      <span>Talla Única (Estándar)</span>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Seleccionar talla o dimensión">
                      {availableSizes.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          role="radio"
                          aria-checked={selectedSize === size}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#437579] ${
                            selectedSize === size
                              ? 'border-[#437579] bg-[#437579] text-white shadow-sm'
                              : 'border-[#C4D8D9] bg-white text-[#597477] hover:border-[#437579]'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Indicaciones con maxLength de 300 caracteres */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label htmlFor="customNotes" className="block text-[11px] sm:text-xs font-bold text-[#213B3E]">
                      ✏️ Indicaciones (Opcional):
                    </label>
                    <span className="text-[10px] text-[#597477] font-semibold">
                      {customNotes.length}/300
                    </span>
                  </div>
                  <textarea
                    id="customNotes"
                    rows={2}
                    maxLength={300}
                    value={customNotes}
                    onChange={(e) => setCustomNotes(e.target.value)}
                    placeholder="Escribe detalles como largo en cm, preferencia de escote..."
                    className="w-full bg-[#F8F5EF] border border-[#C4D8D9] rounded-xl px-3 py-2 md:h-14 text-xs text-[#213B3E] placeholder:text-[#A8B8B9] focus:outline-none focus:ring-2 focus:ring-[#437579] transition-all resize-none"
                  />
                </div>

              </div>
            </div>

            {/* Acciones */}
            <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-2 grid grid-cols-1 md:grid-cols-2 gap-2 bg-gradient-to-t from-[#F2F7F7] to-white border-t border-[#E2ECEC]">

              {/* WhatsApp (Deshabilitado si inStock es false) */}
              {product.inStock !== false ? (
                <a
                  href={generateWhatsAppConfiguredProductLink(product, selectedSize, selectedYarn, selectedColor, customNotes)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold py-3 px-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 text-xs uppercase tracking-wider hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Pedir por WhatsApp</span>
                </a>
              ) : (
                <button
                  disabled
                  className="w-full inline-flex items-center justify-center gap-2 bg-stone-300 text-stone-600 font-bold py-3 px-4 rounded-2xl text-xs uppercase tracking-wider cursor-not-allowed"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>Producto No Disponible</span>
                </button>
              )}

              {/* Añadir a Encargos */}
              <button
                type="button"
                onClick={handleAdd}
                disabled={product.inStock === false || addedSuccess}
                className={`w-full inline-flex items-center justify-center gap-2 font-bold py-2.5 px-4 rounded-2xl border-2 transition-all duration-200 text-xs uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-[#437579] ${
                  addedSuccess
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg'
                    : product.inStock !== false
                    ? 'bg-white hover:bg-[#F2F7F7] text-[#213B3E] hover:text-[#437579] border-[#C4D8D9] hover:border-[#437579] hover:-translate-y-0.5'
                    : 'bg-stone-200 text-stone-400 border-stone-300 cursor-not-allowed'
                }`}
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>¡Añadido a Encargos!</span>
                  </>
                ) : (
                  <span>{product.inStock !== false ? 'Añadir a Encargos' : 'Agotado'}</span>
                )}
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Lightbox Zoom de Imagen Full Screen */}
      {imageZoomed && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setImageZoomed(false)}>
          <button
            type="button"
            onClick={() => setImageZoomed(false)}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full shadow-lg transition-all"
            aria-label="Cerrar zoom de imagen"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={product.imageUrl}
            alt={product.name}
            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
          />
        </div>
      )}
    </>
  );
}
