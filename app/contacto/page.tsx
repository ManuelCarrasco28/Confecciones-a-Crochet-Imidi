'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { CartDrawer } from '@/components/CartDrawer';
import { AuthModal } from '@/components/AuthModal';
import { Footer } from '@/components/Footer';
import { CartItem, UserAccount } from '@/lib/types';
import { STORE_WHATSAPP_NUMBER, STORE_FACEBOOK_URL } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { MessageCircle, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';

const FacebookIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

export default function ContactoPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState<UserAccount | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [sent, setSent] = useState(false);

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

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Ignorar
    }
    setUser(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.message) return;

    let text = `¡Hola Confecciones a Crochet Imidi! 📩\nTe escribo desde el formulario de contacto:\n\n`;
    text += `• Nombre: ${formData.name}\n`;
    if (formData.email) text += `• Correo: ${formData.email}\n`;
    if (formData.phone) text += `• Teléfono: ${formData.phone}\n`;
    text += `• Mensaje: ${formData.message}\n`;

    const whatsappUrl = `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#213B3E] font-sans flex flex-col">
      <Navbar
        cart={cart}
        user={user}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onSelectCategory={() => {}}
      />

      <main className="flex-1 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold bg-[#E2ECEC] text-[#437579] border border-[#437579]/30">
              Estamos para Atenderte
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#213B3E]">
              Contacto & Atención Personalizada
            </h1>
            <p className="text-sm text-[#597477]">
              ¿Tienes alguna duda sobre tejidos a crochet, tipos de hilo o arreglos de costura? Escríbenos directamente o síguenos en redes sociales.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Tarjetas de Información de Contacto */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white p-6 rounded-3xl border border-[#C4D8D9] shadow-sm space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#E2ECEC] text-[#437579] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#213B3E]">Teléfono & WhatsApp</h3>
                    <p className="text-xs text-[#597477] mt-0.5">+51 935 240 485</p>
                    <a
                      href={`https://wa.me/${STORE_WHATSAPP_NUMBER}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-xs text-emerald-600 font-bold mt-1 hover:underline"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Escribir al WhatsApp Oficial</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-[#C4D8D9] shadow-sm space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                    <FacebookIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#213B3E]">Página Oficial de Facebook</h3>
                    <p className="text-xs text-[#597477] mt-0.5">Confecciones a Crochet Imidi</p>
                    <a
                      href={STORE_FACEBOOK_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-xs text-sky-600 font-bold mt-1 hover:underline"
                    >
                      <FacebookIcon className="w-3.5 h-3.5" />
                      <span>Visitar nuestra página en Facebook</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-[#C4D8D9] shadow-sm space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#E2ECEC] text-[#437579] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#213B3E]">Correo Electrónico</h3>
                    <p className="text-xs text-[#597477] mt-0.5 break-all">josemanuelcarrascomillan@gmail.com</p>
                    <p className="text-[11px] text-[#437579] mt-1 font-semibold">Atención de consultas administrativas y pedidos</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-[#C4D8D9] shadow-sm space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#E2ECEC] text-[#437579] flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#213B3E]">Horarios de Atención</h3>
                    <p className="text-xs text-[#597477] mt-0.5">Lunes a Sábado: 9:00 AM – 7:00 PM</p>
                    <p className="text-[11px] text-emerald-600 font-semibold mt-1">Respuestas inmediatas vía WhatsApp y Facebook</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulario de Mensaje con Floating Labels estilo Facebook */}
            <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-[#C4D8D9] shadow-lg">
              <h2 className="font-serif text-xl font-bold text-[#213B3E] mb-1">Envía tu Mensaje Directo</h2>
              <p className="text-xs text-[#597477] mb-6">Te responderemos al instante por WhatsApp o correo electrónico.</p>

              {sent ? (
                <div className="text-center py-10 space-y-3">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-lg font-bold">¡Mensaje Enviado!</h3>
                  <p className="text-xs text-[#597477]">Se ha abierto WhatsApp con tu mensaje. Gracias por escribirnos.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  
                  <div className="relative">
                    <input
                      type="text"
                      id="contactName"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder=" "
                      className="peer w-full bg-[#F8F5EF] border border-[#C4D8D9] rounded-2xl px-4 pt-5 pb-2 text-xs text-[#213B3E] font-medium focus:outline-none focus:border-[#437579] focus:bg-white transition-all shadow-sm"
                    />
                    <label
                      htmlFor="contactName"
                      className="absolute left-4 top-2 text-[10px] font-bold text-[#437579] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs peer-placeholder-shown:font-normal peer-placeholder-shown:text-[#597477] peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:font-bold peer-focus:text-[#437579] pointer-events-none"
                    >
                      Nombre Completo
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative">
                      <input
                        type="email"
                        id="contactEmail"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder=" "
                        className="peer w-full bg-[#F8F5EF] border border-[#C4D8D9] rounded-2xl px-4 pt-5 pb-2 text-xs text-[#213B3E] font-medium focus:outline-none focus:border-[#437579] focus:bg-white transition-all shadow-sm"
                      />
                      <label
                        htmlFor="contactEmail"
                        className="absolute left-4 top-2 text-[10px] font-bold text-[#437579] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs peer-placeholder-shown:font-normal peer-placeholder-shown:text-[#597477] peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:font-bold peer-focus:text-[#437579] pointer-events-none"
                      >
                        Correo Electrónico (Opcional)
                      </label>
                    </div>

                    <div className="relative">
                      <input
                        type="tel"
                        id="contactPhone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder=" "
                        className="peer w-full bg-[#F8F5EF] border border-[#C4D8D9] rounded-2xl px-4 pt-5 pb-2 text-xs text-[#213B3E] font-medium focus:outline-none focus:border-[#437579] focus:bg-white transition-all shadow-sm"
                      />
                      <label
                        htmlFor="contactPhone"
                        className="absolute left-4 top-2 text-[10px] font-bold text-[#437579] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs peer-placeholder-shown:font-normal peer-placeholder-shown:text-[#597477] peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:font-bold peer-focus:text-[#437579] pointer-events-none"
                      >
                        Teléfono / WhatsApp
                      </label>
                    </div>
                  </div>

                  <div className="relative">
                    <textarea
                      id="contactMessage"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder=" "
                      className="peer w-full bg-[#F8F5EF] border border-[#C4D8D9] rounded-2xl px-4 pt-6 pb-2 text-xs text-[#213B3E] font-medium focus:outline-none focus:border-[#437579] focus:bg-white transition-all shadow-sm resize-none"
                    />
                    <label
                      htmlFor="contactMessage"
                      className="absolute left-4 top-2 text-[10px] font-bold text-[#437579] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs peer-placeholder-shown:font-normal peer-placeholder-shown:text-[#597477] peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:font-bold peer-focus:text-[#437579] pointer-events-none"
                    >
                      Mensaje o Consulta
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center space-x-2 bg-[#437579] hover:bg-[#335C60] text-white font-bold py-3.5 px-6 rounded-2xl shadow-md transition-all uppercase tracking-wider text-xs"
                  >
                    <Send className="w-4 h-4" />
                    <span>Enviar Mensaje por WhatsApp</span>
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>
      </main>

      <Footer user={user} />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={(index, newQty) => {
          if (newQty <= 0) {
            setCart((prev) => prev.filter((_, i) => i !== index));
          } else {
            setCart((prev) =>
              prev.map((item, i) => (i === index ? { ...item, quantity: newQty } : item))
            );
          }
        }}
        onRemoveItem={(index) => setCart((prev) => prev.filter((_, i) => i !== index))}
        onClearCart={() => setCart([])}
      />

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
