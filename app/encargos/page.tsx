'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AuthModal } from '@/components/AuthModal';

import { CartItem, UserAccount, YARN_OPTIONS, COLOR_OPTIONS } from '@/lib/types';
import { formatCurrency, generateWhatsAppCartLink } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { ShoppingBag, Trash2, Plus, Minus, MessageCircle, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';

export default function EncargosPage() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('imidi_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState<UserAccount | null>(null);

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

  // Save Cart to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('imidi_cart', JSON.stringify(cart));
    } catch {
      // Ignorar
    }
  }, [cart]);

  const handleUpdateItem = (index: number, updatedItem: Partial<CartItem>) => {
    setCart((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...updatedItem };
      return copy;
    });
  };

  const handleUpdateQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(index);
      return;
    }
    setCart((prev) => {
      const copy = [...prev];
      copy[index].quantity = newQty;
      return copy;
    });
  };

  const handleRemoveItem = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearCart = () => {
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
                <Sparkles className="w-4 h-4 text-[#D89B53]" />
                <span>Explorar Catálogo de Tejidos</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Lista de Ítems Personalizables (Izquierda) */}
              <div className="lg:col-span-8 space-y-4">
                {cart.map((item, index) => (
                  <div
                    key={`${item.product.id}-${index}`}
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
                          <span className="text-[10px] uppercase font-bold text-[#437579] bg-[#E2ECEC] px-2 py-0.5 rounded-full">
                            {item.product.category}
                          </span>
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
                      
                      {/* Talla */}
                      <div>
                        <label className="block text-[11px] font-bold text-[#213B3E] mb-1">
                          📐 Talla / Dimensión:
                        </label>
                        <select
                          value={item.selectedSize || 'M'}
                          onChange={(e) => handleUpdateItem(index, { selectedSize: e.target.value })}
                          className="w-full bg-[#F8F5EF] border border-[#C4D8D9] rounded-xl px-3 py-2 text-xs font-bold text-[#213B3E] focus:outline-none focus:border-[#437579]"
                        >
                          <option value="S">Talla S</option>
                          <option value="M">Talla M</option>
                          <option value="L">Talla L</option>
                          <option value="XL">Talla XL</option>
                          <option value="A Medida">Confección a Medida Exacta</option>
                        </select>
                      </div>

                      {/* Hilo */}
                      <div>
                        <label className="block text-[11px] font-bold text-[#213B3E] mb-1">
                          🧵 Tipo de Hilo:
                        </label>
                        <select
                          value={item.selectedYarn || 'Algodón'}
                          onChange={(e) => handleUpdateItem(index, { selectedYarn: e.target.value })}
                          className="w-full bg-[#F8F5EF] border border-[#C4D8D9] rounded-xl px-3 py-2 text-xs font-bold text-[#213B3E] focus:outline-none focus:border-[#437579]"
                        >
                          {YARN_OPTIONS.map((yarn) => (
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
                          value={item.selectedColor || COLOR_OPTIONS[0]}
                          onChange={(e) => handleUpdateItem(index, { selectedColor: e.target.value })}
                          className="w-full bg-[#F8F5EF] border border-[#C4D8D9] rounded-xl px-3 py-2 text-xs font-bold text-[#213B3E] focus:outline-none focus:border-[#437579]"
                        >
                          {COLOR_OPTIONS.map((col) => (
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
                ))}
              </div>

              {/* Resumen de Pago y Enviar a WhatsApp (Derecha) */}
              <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-[#C4D8D9] shadow-lg space-y-5 lg:sticky lg:top-24">
                
                <h3 className="font-serif text-lg font-bold text-[#213B3E] border-b border-[#E2ECEC] pb-3">
                  Resumen de tu Encargo
                </h3>

                <div className="bg-[#E2ECEC] p-3 rounded-2xl border border-[#437579]/20 flex items-start space-x-2 text-xs text-[#213B3E]">
                  <ShieldCheck className="w-4 h-4 text-[#437579] shrink-0 mt-0.5" />
                  <span>
                    <strong>Atención Directa:</strong> Al presionar el botón verde abajo, se enviará este resumen con tus tallas e hilos seleccionados a nuestro WhatsApp oficial para coordinar el tiempo de tejido y la entrega.
                  </span>
                </div>

                <div className="space-y-2 text-xs text-[#597477] border-t border-[#E2ECEC] pt-3">
                  <div className="flex justify-between">
                    <span>Prendas a confeccionar:</span>
                    <strong className="text-[#213B3E]">{cart.reduce((sum, item) => sum + item.quantity, 0)} unidades</strong>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold text-[#213B3E] pt-2 border-t border-[#E2ECEC]">
                    <span>Total Estimado:</span>
                    <span className="text-[#437579] font-serif text-xl font-bold">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transition-all uppercase tracking-wider text-xs"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Enviar Encargo Completo por WhatsApp</span>
                </a>

                <button
                  onClick={handleClearCart}
                  className="w-full text-center text-xs text-rose-600 hover:underline font-bold py-1"
                >
                  Vaciar lista de encargos
                </button>

              </div>

            </div>
          )}

        </div>
      </main>

      <Footer user={user} />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(account) => {
          setUser(account);
          setIsAuthOpen(false);
        }}
      />
    </div>
  );
}
