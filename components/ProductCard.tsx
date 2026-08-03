'use client';

import React from 'react';
import { Product } from '@/lib/types';
import { generateWhatsAppProductLink, formatCurrency } from '@/lib/utils';
import { MessageCircle, Eye, ShoppingBag, Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onOpenModal: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onOpenModal, onAddToCart }: ProductCardProps) {
  const whatsappUrl = generateWhatsAppProductLink(product);

  const categoryLabels: Record<string, string> = {
    blusas: 'Blusa',
    vestidos: 'Vestido',
    tapetes: 'Tapete',
    diadema: 'Diadema',
    gorros: 'Gorro',
  };

  return (
    <div className="group w-full max-w-sm mx-auto sm:max-w-none bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-[#C4D8D9] hover:border-[#437579] shadow-sm hover:shadow-xl hover:shadow-[#437579]/15 transition-all duration-300 flex flex-col justify-between">
      
      {/* Imagen & Badges */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#F2F7F7] cursor-pointer" onClick={() => onOpenModal(product)}>
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-stone-900/5 group-hover:bg-transparent transition-colors" />

        {/* Categoría Badge */}
        <span className="absolute top-1.5 sm:top-3 left-1.5 sm:left-3 bg-white/95 backdrop-blur-md text-[#437579] text-[8px] sm:text-[11px] font-bold px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-full border border-[#C4D8D9] shadow-sm">
          {categoryLabels[product.category] || product.category}
        </span>

        {/* Badge Confección bajo Pedido */}
        <span className="absolute top-1.5 sm:top-3 right-1.5 sm:right-3 bg-[#437579]/90 backdrop-blur-md text-white text-[7px] sm:text-[9px] font-extrabold px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full shadow-sm flex items-center gap-0.5 sm:gap-1">
          <Heart className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-rose-300 fill-rose-300" />
          <span>A Pedido</span>
        </span>

        {/* Botón Flotante Vista Rápida */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenModal(product);
          }}
          className="absolute bottom-1.5 sm:bottom-3 right-1.5 sm:right-3 bg-white/90 hover:bg-[#437579] text-[#213B3E] hover:text-white p-1.5 sm:p-2.5 rounded-full shadow-lg border border-[#C4D8D9] opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Ver detalles"
        >
          <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>

      {/* Contenido de la Tarjeta */}
      <div className="p-2.5 sm:p-5 flex-1 flex flex-col justify-between space-y-1.5 sm:space-y-4">
        <div>
          <h3
            onClick={() => onOpenModal(product)}
            className="font-serif text-xs sm:text-lg font-bold text-[#213B3E] hover:text-[#437579] cursor-pointer transition-colors line-clamp-1 leading-tight"
          >
            {product.name}
          </h3>
          <p className="text-[#597477] text-[10px] sm:text-xs mt-0.5 sm:mt-1.5 line-clamp-1 sm:line-clamp-2 font-normal">
            {product.description}
          </p>
        </div>

        {/* Opciones de Tipos de Hilo */}
        <div className="space-y-0.5 text-[9px] sm:text-[11px] text-[#597477]">
          <div className="flex items-center space-x-1">
            <span className="font-bold text-[#213B3E] hidden sm:inline">Hilos:</span>
            <span className="truncate text-[9px] sm:text-[11px]">Hilos de algodón peruano</span>
          </div>
          <p className="text-[8px] sm:text-[10px] text-emerald-700 font-semibold items-center gap-1 hidden sm:flex">
            <span>🧶 Se teje a tu medida y color</span>
          </p>
        </div>

        {/* Precio & Acciones */}
        <div className="pt-1.5 sm:pt-3 border-t border-[#E2ECEC] flex items-center justify-between gap-1">
          <div className="min-w-0 shrink">
            <span className="text-[9px] text-[#597477] hidden sm:block font-medium leading-none">Precio</span>
            <span className="text-[#437579] font-bold text-[11px] xs:text-xs sm:text-xl leading-none block truncate">
              {formatCurrency(product.price)}
            </span>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
            
            {/* Botón Añadir a Lista */}
            <button
              onClick={() => onAddToCart(product)}
              className="p-1 sm:p-2.5 rounded-lg sm:rounded-2xl bg-[#F2F7F7] hover:bg-[#E2ECEC] text-[#213B3E] hover:text-[#437579] border border-[#C4D8D9] transition-colors"
              title="Añadir a mi lista de encargos"
            >
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#437579]" />
            </button>

            {/* Pedir directo por WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-0.5 sm:space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[9px] sm:text-xs font-bold px-1.5 sm:px-3.5 py-1 sm:py-2.5 rounded-lg sm:rounded-2xl transition-all shadow-sm shrink-0"
            >
              <MessageCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Pedir</span>
            </a>
          </div>
        </div>

      </div>

    </div>
  );
}
