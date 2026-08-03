'use client';

import React from 'react';
import Link from 'next/link';
import { CartItem } from '@/lib/types';
import { generateWhatsAppCartLink, formatCurrency } from '@/lib/utils';
import { X, Trash2, Plus, Minus, MessageCircle, ShoppingBag, ShieldCheck } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) {
  if (!isOpen) return null;

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const whatsappUrl = generateWhatsAppCartLink(cart);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen sm:max-w-md bg-white border-l border-[#C4D8D9] text-[#213B3E] shadow-2xl flex flex-col justify-between">
          
          {/* Cabecera de la Lista */}
          <div className="p-4 sm:p-6 border-b border-[#E2ECEC] flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-[#437579]" />
              <div>
                <h2 className="font-serif text-base sm:text-lg font-bold text-[#213B3E]">Lista de Pedidos</h2>
                <p className="text-[10px] sm:text-[11px] text-[#597477]">Se envía directo a WhatsApp</p>
              </div>
              <span className="text-xs bg-[#D97B84] text-white font-bold px-2.5 py-0.5 rounded-full ml-1">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#E2ECEC] text-[#213B3E] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Lista de Ítems */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 sm:space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-12 sm:py-16 text-[#597477] space-y-3">
                <ShoppingBag className="w-10 sm:w-12 h-10 sm:h-12 mx-auto text-[#437579]" />
                <p className="font-serif text-sm sm:text-base text-[#213B3E] font-bold">Tu lista de pedidos está vacía</p>
                <p className="text-[11px] sm:text-xs text-[#597477]">
                  Explora nuestro catálogo e incluye tus prendas a crochet preferidas para pedir por WhatsApp.
                </p>
              </div>
            ) : (
              cart.map((item, index) => (
                <div
                  key={index}
                  className="bg-[#F8F5EF] p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-[#C4D8D9] flex space-x-2 sm:space-x-3 items-center"
                >
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl object-cover shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-xs sm:text-sm font-bold text-[#213B3E] truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-[#437579] text-[11px] sm:text-xs font-bold">
                      {formatCurrency(item.product.price)}
                    </p>

                    <div className="text-[10px] sm:text-[11px] text-[#597477] mt-0.5 sm:mt-1 flex flex-wrap gap-1">
                      {item.selectedSize && <span>Talla: {item.selectedSize}</span>}
                      {item.selectedColor && <span>• Hilo: {item.selectedColor}</span>}
                    </div>
                  </div>

                  {/* Controles de Cantidad */}
                  <div className="flex items-center space-x-1 border border-[#C4D8D9] rounded-lg p-0.5 sm:p-1 bg-white shrink-0">
                    <button
                      onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                      className="p-1.5 hover:bg-[#E2ECEC] text-[#213B3E] rounded"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold px-1.5 sm:px-2">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                      className="p-1.5 hover:bg-[#E2ECEC] text-[#213B3E] rounded"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Eliminar */}
                  <button
                    onClick={() => onRemoveItem(index)}
                    className="p-1.5 text-[#597477] hover:text-[#D97B84] transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Pie con Total Estimado y Enviar Pedido a WhatsApp */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-[#C4D8D9] bg-white space-y-3 sm:space-y-4 shrink-0 safe-bottom">
              
              <div className="bg-[#E2ECEC] p-2.5 sm:p-3 rounded-xl border border-[#437579]/20 flex items-start space-x-2 text-[10px] sm:text-[11px] text-[#213B3E]">
                <ShieldCheck className="w-4 h-4 text-[#437579] shrink-0 mt-0.5" />
                <span>
                  <strong>Sin pagos en la web:</strong> Al hacer clic abajo, se enviará la lista completa a nuestro WhatsApp para acordar la confección y entrega.
                </span>
              </div>

              <div className="flex justify-between items-center text-sm font-semibold text-[#597477]">
                <span>Total Estimado:</span>
                <span className="text-[#437579] font-serif text-lg sm:text-xl font-bold">
                  {formatCurrency(total)}
                </span>
              </div>

              <Link
                href="/encargos"
                onClick={onClose}
                className="w-full flex items-center justify-center space-x-2 bg-[#437579] hover:bg-[#335C60] text-white font-bold py-3 px-4 rounded-xl shadow-sm transition-all text-xs uppercase tracking-wider"
              >
                <ShoppingBag className="w-4 h-4 text-[#D89B53]" />
                <span>Elegir Talla e Hilos en /encargos →</span>
              </Link>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all text-xs uppercase tracking-wider"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Enviar Pedido a WhatsApp</span>
              </a>

              <button
                onClick={onClearCart}
                className="w-full text-center text-xs text-[#597477] hover:text-[#213B3E] py-1"
              >
                Vaciar lista
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
