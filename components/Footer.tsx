'use client';

import React from 'react';
import Link from 'next/link';
import { MessageCircle, Heart, MapPin, Clock, Truck, ShieldCheck, Phone, Lock } from 'lucide-react';
import { STORE_WHATSAPP_NUMBER, STORE_FACEBOOK_URL } from '@/lib/utils';
import { UserAccount } from '@/lib/types';

interface FooterProps {
  user?: UserAccount | null;
}

const FacebookIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

export function Footer({ user }: FooterProps) {
  const isAdminUser = user?.role === 'admin';

  return (
    <footer className="bg-white text-[#213B3E] border-t border-[#C4D8D9] pt-10 sm:pt-16 pb-8 sm:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 pb-8 sm:pb-12 border-b border-[#E2ECEC]">
          
          {/* Columna 1: Marca & Descripción */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-[#437579] shadow-md bg-white shrink-0">
                <img
                  src="/img/logo.png"
                  alt="Confecciones a Crochet Imidi Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-serif text-base sm:text-lg font-bold text-[#213B3E]">
                Confecciones Imidi
              </h3>
            </div>
            
            <p className="text-[#597477] text-[11px] sm:text-xs leading-relaxed font-normal">
              Blusas, vestidos, diademas, gorros y tapetes hechos a mano a crochet, además de servicio profesional de costura y arreglos a tu medida.
            </p>

            <div className="pt-2 flex flex-wrap gap-2">
              <a
                href={`https://wa.me/${STORE_WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 p-2 px-3 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-xl transition-all border border-emerald-200 text-[11px] sm:text-xs font-bold shadow-sm"
                aria-label="WhatsApp Directo"
              >
                <MessageCircle className="w-4 h-4" />
                <span>+51 935 240 485</span>
              </a>

              <a
                href={STORE_FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 p-2 px-3 bg-sky-50 text-sky-700 hover:bg-sky-600 hover:text-white rounded-xl transition-all border border-sky-200 text-[11px] sm:text-xs font-bold shadow-sm"
                aria-label="Página de Facebook"
              >
                <FacebookIcon className="w-4 h-4" />
                <span>Facebook</span>
              </a>
            </div>
          </div>

          {/* Columna 2: Páginas Principales */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-[#213B3E] uppercase tracking-wider">
              Navegación
            </h4>
            <ul className="space-y-2 text-xs text-[#597477]">
              <li>
                <Link href="/" className="hover:text-[#437579] transition-colors font-medium">
                  • Inicio
                </Link>
              </li>
              <li>
                <Link href="/catalogo" className="hover:text-[#437579] transition-colors font-medium">
                  • Catálogo de Prendas
                </Link>
              </li>
              <li>
                <Link href="/arreglos" className="hover:text-[#437579] transition-colors font-medium">
                  • Costura & Arreglos $
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="hover:text-[#437579] transition-colors font-medium">
                  • Contacto & Atención
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Atención y Redes */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-[#213B3E] uppercase tracking-wider">
              Atención & Redes
            </h4>
            <div className="space-y-2.5 text-xs text-[#597477]">
              <div className="flex items-start space-x-2">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="font-bold text-[#213B3E]">WhatsApp: +51 935 240 485</span>
              </div>
              <div className="flex items-start space-x-2">
                <FacebookIcon className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <a href={STORE_FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="font-bold text-[#213B3E] hover:underline">
                  Facebook: Confecciones Imidi
                </a>
              </div>
              <div className="flex items-start space-x-2">
                <Clock className="w-4 h-4 text-[#437579] shrink-0 mt-0.5" />
                <span>Lunes a Sábado: 9:00 AM - 7:00 PM</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-[#D97B84] shrink-0 mt-0.5" />
                <span>Atención directa y envíos a todo el Perú</span>
              </div>
            </div>
          </div>

          {/* Columna 4: Garantía y Envíos */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-[#213B3E] uppercase tracking-wider">
              Garantía Artesanal
            </h4>
            <div className="space-y-2 text-xs text-[#597477]">
              <div className="flex items-center space-x-2 text-[#213B3E] font-semibold">
                <ShieldCheck className="w-4 h-4 text-[#437579]" />
                <span>100% Hecho a Mano</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Confección en hilos de Algodón, Silvia, Tren, Fino Cable, Quesito, Pavino en Cono y Nylon.
              </p>
              <div className="flex items-center space-x-2 text-[#213B3E] font-semibold pt-1">
                <Truck className="w-4 h-4 text-[#D97B84]" />
                <span>Envíos Coordinados</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Coordinación directa del tiempo de confección y envío por WhatsApp.
              </p>
            </div>
          </div>

        </div>

        {/* Copyright & Acceso Admin Exclusivo */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center text-[11px] sm:text-xs text-[#597477] space-y-3 sm:space-y-0">
          <p className="text-center sm:text-left">© {new Date().getFullYear()} Confecciones a Crochet Imidi. Todos los derechos reservados.</p>
          
          <div className="flex items-center space-x-4 text-[#213B3E]">
            <div className="flex items-center space-x-1">
              <span>Hecho con</span>
              <Heart className="w-3.5 h-3.5 text-[#D97B84] fill-[#D97B84]" />
              <span className="hidden sm:inline">para vestir con estilo artesanal</span>
            </div>

            {isAdminUser && (
              <Link
                href="/admin"
                className="flex items-center space-x-1 text-slate-600 hover:text-[#437579] transition-colors font-bold text-[11px] border-l border-[#C4D8D9] pl-3"
              >
                <Lock className="w-3 h-3 text-slate-400" />
                <span>Panel Admin</span>
              </Link>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
}
