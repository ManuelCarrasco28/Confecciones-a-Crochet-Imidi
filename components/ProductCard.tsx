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
        <span className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-white/95 backdrop-blur-md text-[#437579] text-[10px] sm:text-[11px] font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-[#C4D8D9] shadow-sm">
          {categoryLabels[product.category] || product.category}
        </span>

        {/* Badge Confección bajo Pedido */}
        <span className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-[#437579]/90 backdrop-blur-md text-white text-[8px] sm:text-[9px] font-extrabold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shadow-sm flex items-center gap-1">
          <Heart className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-rose-300 fill-rose-300" />
          <span>A Pedido</span>
        </span>

        {/* Botón Flotante Vista Rápida */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenModal(product);
          }}
          className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 bg-white/90 hover:bg-[#437579] text-[#213B3E] hover:text-white p-2 sm:p-2.5 rounded-full shadow-lg border border-[#C4D8D9] opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Ver detalles"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Contenido de la Tarjeta */}
      <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between space-y-2 sm:space-y-4">
        <div>
          <h3
            onClick={() => onOpenModal(product)}
            className="font-serif text-sm sm:text-lg font-bold text-[#213B3E] hover:text-[#437579] cursor-pointer transition-colors line-clamp-1"
          >
            {product.name}
          </h3>
          <p className="text-[#597477] text-[11px] sm:text-xs mt-1 sm:mt-1.5 line-clamp-2 font-normal">
            {product.description}
          </p>
        </div>

        {/* Opciones de Tipos de Hilo */}
        <div className="space-y-1 text-[10px] sm:text-[11px] text-[#597477]">
          <div className="flex items-center space-x-1">
            <span className="font-bold text-[#213B3E]">Hilos:</span>
            <span className="truncate">Algodón, Silvia, Tren, Fino Cable...</span>
          </div>
          <p className="text-[9px] sm:text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
            <span>🧶 Se teje a tu medida y color exacto</span>
          </p>
        </div>

        {/* Precio & Acciones */}
        <div className="pt-2 sm:pt-3 border-t border-[#E2ECEC] flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[9px] sm:text-[10px] text-[#597477] block font-medium">Precio confección</span>
            <span className="text-[#437579] font-bold text-lg sm:text-xl">{formatCurrency(product.price)}</span>
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            
            {/* Botón Añadir a Lista */}
            <button
              onClick={() => onAddToCart(product)}
              className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-[#F2F7F7] hover:bg-[#E2ECEC] text-[#213B3E] hover:text-[#437579] border border-[#C4D8D9] transition-colors"
              title="Añadir a mi lista de encargos"
            >
              <ShoppingBag className="w-4 h-4 text-[#437579]" />
            </button>

            {/* Pedir directo por WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 sm:space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] sm:text-xs font-bold px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl transition-all shadow-sm"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Pedir</span>
            </a>
          </div>
        </div>

      </div>

    </div>
  );
}
