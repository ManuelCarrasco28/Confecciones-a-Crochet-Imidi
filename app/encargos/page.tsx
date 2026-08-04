'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AuthModal } from '@/components/AuthModal';

import { getStoredCart, saveStoredCart } from '@/lib/cart';
import { fetchStoreAttributes, getStoredAttributes, StoreAttributes } from '@/lib/attributes';
import { getCategorySizeType } from '@/lib/categories';
import { CartItem, UserAccount } from '@/lib/types';
import { formatCurrency, generateWhatsAppCartLink } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { ShoppingBag, Trash2, Plus, Minus, MessageCircle, ArrowLeft, ShieldCheck, Heart } from 'lucide-react';
import { gsap } from '@/lib/gsap';

export default function EncargosPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [storeAttrs, setStoreAttrs] = useState<StoreAttributes>(getStoredAttributes);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState<UserAccount | null>(null);

  // Escuchar cambios en atributos globales de la tienda
  useEffect(() => {
    const handleAttrsUpdate = () => setStoreAttrs(getStoredAttributes());
    fetchStoreAttributes().then(setStoreAttrs).catch(() => {
      // Mantener atributos locales como respaldo si no hay conexión.
    });
    window.addEventListener('imidi_attributes_updated', handleAttrsUpdate);
    return () => window.removeEventListener('imidi_attributes_updated', handleAttrsUpdate);
  }, []);

  // Cargar carrito de localStorage en cliente y escuchar actualizaciones en tiempo real
  useEffect(() => {
    const loadCartFromStorage = () => {
      setCart(getStoredCart());
    };

    loadCartFromStorage();
    window.addEventListener('imidi_cart_updated', loadCartFromStorage);
    window.addEventListener('storage', loadCartFromStorage);
    return () => {
      window.removeEventListener('imidi_cart_updated', loadCartFromStorage);
      window.removeEventListener('storage', loadCartFromStorage);
    };
  }, []);

  // Sync Auth
  useEffect(() => {
    async function syncAuth() {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const userEmail = session.user.email?.toLowerCase() || '';
          const userMetaRole = session.user.user_metadata?.role;
          setUser({
            id: session.user.id,
            name: session.user.user_metadata?.full_name || userEmail.split('@')[0],
            email: userEmail,
            role: userEmail === 'josemanuelcarrascomillan@gmail.com' || userMetaRole === 'admin' ? 'admin' : 'cliente',
          });
        }
      } catch {
        // Ignorar
      }
    }
    syncAuth();
  }, []);

  const handleUpdateItem = (index: number, updatedItem: Partial<CartItem>) => {
    const current = getStoredCart();
    if (!current[index]) return;
    current[index] = { ...current[index], ...updatedItem };
    saveStoredCart(current);
    setCart(current);
  };

  const handleUpdateQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(index);
      return;
    }
    const current = getStoredCart();
    if (!current[index]) return;
    current[index].quantity = newQty;
    saveStoredCart(current);
    setCart(current);
  };

  const handleRemoveItem = (index: number, element?: HTMLElement | null) => {
    if (element) {
      gsap.to(element, {
        height: 0,
        opacity: 0,
        scale: 0.95,
        marginBottom: 0,
        paddingTop: 0,
        paddingBottom: 0,
        duration: 0.3,
        ease: 'power2.inOut',
        onComplete: () => {
          const current = getStoredCart();
          const updated = current.filter((_, i) => i !== index);
          saveStoredCart(updated);
          setCart(updated);
        },
      });
    } else {
      const current = getStoredCart();
      const updated = current.filter((_, i) => i !== index);
      saveStoredCart(updated);
      setCart(updated);
    }
  };

  const handleClearCart = () => {
    saveStoredCart([]);
    setCart([]);
  };

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const whatsappUrl = generateWhatsAppCartLink(cart);

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#213B3E] font-sans flex flex-col">
      <Navbar
        cart={cart}
        user={user}
        onOpenCart={() => {}}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={async () => {
          try {
            const supabase = createClient();
            await supabase.auth.signOut();
          } catch {
            // Ignorar
          }
          setUser(null);
        }}
      />

      <main className="flex-1 py-8 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#C4D8D9] pb-6">
            <div>
              <div className="inline-flex items-center space-x-2 bg-[#E2ECEC] border border-[#437579]/30 text-[#437579] px-3.5 py-1 rounded-full text-xs font-bold mb-2">
                <ShoppingBag className="w-3.5 h-3.5 text-[#437579]" />
                <span>Lista Personalizable de Encargos</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#213B3E]">
                Configurar tus Encargos a Medida
              </h1>
              <p className="text-xs sm:text-sm text-[#597477] mt-1">
                Elige la talla, hilo, color e indicaciones especiales para cada una de tus prendas antes de enviar el pedido a WhatsApp.
              </p>
            </div>

            <Link
              href="/catalogo"
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#437579] hover:text-[#335C60] bg-white border border-[#C4D8D9] px-4 py-2.5 rounded-2xl shadow-sm transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Seguir Explorando Catálogo</span>
            </Link>
          </div>

          {/* Estado Vacío vs Lista */}
          {cart.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-[#C4D8D9] p-8 max-w-lg mx-auto space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-[#E2ECEC] text-[#437579] flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h2 className="font-serif text-xl font-bold text-[#213B3E]">
                Aún no has añadido prendas a tu lista de encargos
              </h2>
              <p className="text-xs text-[#597477]">
                Explora nuestro catálogo, selecciona tus diseños preferidos de blusas, vestidos, diademas o tapetes e inclúyelos en tus encargos.
              </p>
              <Link
                href="/catalogo"
                className="inline-flex items-center space-x-2 bg-[#437579] hover:bg-[#335C60] text-white font-bold text-xs px-6 py-3.5 rounded-2xl shadow-md transition-all uppercase tracking-wider mt-2"
              >
                <Heart className="w-4 h-4 text-[#D97B84] fill-[#D97B84]" />
                <span>Explorar Catálogo de Tejidos</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Lista de Ítems Personalizables (Izquierda) */}
              <div className="lg:col-span-8 space-y-4">
                {cart.map((item, index) => {
                  const sizeType = getCategorySizeType(item.product.category);

                  // Asegurar que las opciones incluyan la talla seleccionada
                  const availableSizes = sizeType === 'dimensiones'
                    ? Array.from(new Set(['30x30 cm', '40x40 cm', '50x50 cm', 'A Medida', ...(item.selectedSize ? [item.selectedSize] : [])]))
                    : Array.from(new Set([...storeAttrs.sizes, ...(item.selectedSize ? [item.selectedSize] : [])]));

                  const availableYarns = Array.from(new Set([...storeAttrs.yarns, ...(item.selectedYarn ? [item.selectedYarn] : [])]));
                  const availableColors = Array.from(new Set([...storeAttrs.colors, ...(item.selectedColor ? [item.selectedColor] : [])]));

                  return (
                    <div
                      key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${item.selectedYarn}-${index}`}
                      className="bg-white p-4 sm:p-6 rounded-3xl border border-[#C4D8D9] shadow-sm space-y-4 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E2ECEC]">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#F8F5EF] overflow-hidden border border-[#C4D8D9] shrink-0">
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] uppercase font-extrabold text-[#437579] bg-[#E2ECEC] px-2.5 py-0.5 rounded-full border border-[#437579]/20">
                                Prenda #{index + 1}
                              </span>
                              <span className="text-[10px] uppercase font-bold text-[#597477]">
                                · {item.product.category}
                              </span>
                            </div>
                            <h3 className="font-serif text-base sm:text-lg font-bold text-[#213B3E] mt-1">
                              {item.product.name}
                            </h3>
                            <span className="text-[#437579] font-bold text-sm sm:text-base">
                              {formatCurrency(item.product.price)} c/u
                            </span>
                          </div>
                        </div>

                        {/* Controles de Cantidad y Eliminar */}
                        <div className="flex items-center space-x-3 self-end sm:self-auto">
                          <div className="flex items-center space-x-1.5 border border-[#C4D8D9] rounded-xl p-1 bg-[#F8F5EF]">
                            <button
                              onClick={() => handleUpdateQuantity(index, item.quantity - 1)}
                              className="p-1.5 hover:bg-white rounded-lg text-[#213B3E] transition-colors"
                              title="Disminuir"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-xs font-extrabold px-2">{item.quantity}</span>
                            <button
                              onClick={() => handleUpdateQuantity(index, item.quantity + 1)}
                              className="p-1.5 hover:bg-white rounded-lg text-[#213B3E] transition-colors"
                              title="Aumentar"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <button
                            onClick={() => handleRemoveItem(index)}
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                            title="Eliminar del encargo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Controles de Personalización por Ítem */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                        
                        {/* Talla / Dimensión */}
                        <div>
                          <label className="block text-[11px] font-bold text-[#213B3E] mb-1">
                            📏 Talla / Medida:
                          </label>
                          {sizeType === 'unica' ? (
                            <div className="w-full bg-[#E2ECEC] border border-[#437579]/30 rounded-xl px-3 py-2 text-xs font-bold text-[#437579]">
                              👑 Talla Única (Estándar)
                            </div>
                          ) : (
                            <select
                              value={item.selectedSize || availableSizes[0]}
                              onChange={(e) => handleUpdateItem(index, { selectedSize: e.target.value })}
                              className="w-full bg-[#F8F5EF] border border-[#C4D8D9] rounded-xl px-3 py-2 text-xs font-bold text-[#213B3E] focus:outline-none focus:border-[#437579]"
                            >
                              {availableSizes.map((sz) => (
                                <option key={sz} value={sz}>
                                  Talla: {sz}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>

                        {/* Hilo */}
                        <div>
                          <label className="block text-[11px] font-bold text-[#213B3E] mb-1">
                            🧵 Tipo de Hilo:
                          </label>
                          <select
                            value={item.selectedYarn || availableYarns[0]}
                            onChange={(e) => handleUpdateItem(index, { selectedYarn: e.target.value })}
                            className="w-full bg-[#F8F5EF] border border-[#C4D8D9] rounded-xl px-3 py-2 text-xs font-bold text-[#213B3E] focus:outline-none focus:border-[#437579]"
                          >
                            {availableYarns.map((yarn) => (
                              <option key={yarn} value={yarn}>
                                {yarn}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Color */}
                        <div>
                          <label className="block text-[11px] font-bold text-[#213B3E] mb-1">
                            🎨 Color de Hilo:
                          </label>
                          <select
                            value={item.selectedColor || availableColors[0]}
                            onChange={(e) => handleUpdateItem(index, { selectedColor: e.target.value })}
                            className="w-full bg-[#F8F5EF] border border-[#C4D8D9] rounded-xl px-3 py-2 text-xs font-bold text-[#213B3E] focus:outline-none focus:border-[#437579]"
                          >
                            {availableColors.map((col) => (
                              <option key={col} value={col}>
                                {col}
                              </option>
                            ))}
                          </select>
                        </div>

                      </div>

                      {/* Notas Especiales / Medidas Exactas */}
                      <div>
                        <label className="block text-[11px] font-bold text-[#213B3E] mb-1">
                          📝 Indicaciones o Medidas Especiales:
                        </label>
                        <input
                          type="text"
                          value={item.customNotes || ''}
                          onChange={(e) => handleUpdateItem(index, { customNotes: e.target.value })}
                          placeholder="Ej. Busto 92cm, largo 55cm, escote más cerrado..."
                          className="w-full bg-[#F8F5EF] border border-[#C4D8D9] rounded-xl px-3.5 py-2 text-xs text-[#213B3E] font-medium focus:outline-none focus:border-[#437579]"
                        />
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Resumen de Pago y Enviar a WhatsApp (Derecha) */}
              <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-[#C4D8D9] shadow-lg space-y-5 lg:sticky lg:top-24">
                
                <h3 className="font-serif text-lg font-bold text-[#213B3E] border-b border-[#E2ECEC] pb-3">
                  Resumen de tu Pedido ({cart.reduce((sum, item) => sum + item.quantity, 0)} prendas)
                </h3>

                <div className="space-y-2 text-xs">
                  {cart.map((item, i) => (
                    <div key={i} className="flex justify-between items-start text-[#597477] border-b border-dashed border-[#E2ECEC] pb-2">
                      <div>
                        <p className="font-bold text-[#213B3E]">
                          Prenda #{i + 1}: {item.product.name} x{item.quantity}
                        </p>
                        <p className="text-[10px]">
                          Talla: <span className="font-bold text-[#437579]">{item.selectedSize}</span> · {item.selectedYarn}
                        </p>
                      </div>
                      <span className="font-bold text-[#213B3E]">
                        {formatCurrency(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-[#C4D8D9] space-y-1">
                  <div className="flex justify-between items-center text-sm font-extrabold text-[#213B3E]">
                    <span>Total Estimado:</span>
                    <span className="text-xl font-bold text-[#437579]">{formatCurrency(total)}</span>
                  </div>
                  <p className="text-[10px] text-[#597477]">
                    * El pago se acuerda directamente por WhatsApp.
                  </p>
                </div>

                {/* Enviar Solicitud Oficial por WhatsApp */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all text-xs uppercase tracking-wider hover:-translate-y-0.5"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Enviar Pedido a WhatsApp ({cart.length})</span>
                </a>

                {/* Vaciar Carrito */}
                <button
                  onClick={handleClearCart}
                  className="w-full text-center text-xs font-bold text-rose-500 hover:text-rose-700 py-1 transition-colors"
                >
                  Vaciar toda la lista
                </button>

                <div className="pt-2 border-t border-[#E2ECEC] flex items-center space-x-2 text-[11px] text-[#597477]">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Trato directo con la artesana. Confección garantizada.</span>
                </div>

              </div>

            </div>
          )}

        </div>
      </main>

      <Footer />

      {/* Modal Autenticación */}
      {isAuthOpen && (
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onLoginSuccess={(userData) => setUser(userData)}
        />
      )}
    </div>
  );
}
