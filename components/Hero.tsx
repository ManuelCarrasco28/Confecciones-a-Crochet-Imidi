'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Scissors, Heart, ShieldCheck, ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F8F5EF] via-[#EAF1F1] to-[#F8F5EF] text-[#213B3E] py-12 lg:py-20 border-b border-[#C4D8D9]">
      
      {/* Elementos Decorativos de Fondo inspirados en los hilos del logo */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#437579]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#D97B84]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Columna Izquierda: Información de Marca & CTA */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Distintivos Artesanales */}
            <div className="inline-flex items-center space-x-2 bg-white/90 border border-[#437579]/30 px-4 py-1.5 rounded-full shadow-sm">
              <Sparkles className="w-4 h-4 text-[#D89B53] animate-pulse" />
              <span className="text-xs sm:text-sm font-bold text-[#437579]">
                Confección Artesanal & Arreglos a Medida
              </span>
            </div>

            {/* Título Principal con Gradiente de Colores del Logo */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-[#213B3E]">
              Elegancia y Calidez en <span className="bg-gradient-to-r from-[#437579] via-[#244246] to-[#D97B84] bg-clip-text text-transparent">Tejidos a Crochet</span>
            </h1>

            {/* Descripción de Negocio */}
            <p className="text-[#3E5C60] text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              En <strong className="text-[#437579] font-bold">Confecciones a Crochet Imidi</strong> creamos prendas únicas hechas a mano: blusas caladas, vestidos de ensueño, vinchas, tapetes para el hogar y brindamos servicio profesional de costura y arreglos a tu medida.
            </p>

            {/* Botones de Acción Redirigidos Correctamente */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/catalogo"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-[#437579] hover:bg-[#335C60] text-white font-bold px-7 py-3.5 rounded-full shadow-lg shadow-[#437579]/20 hover:scale-[1.02] transition-all uppercase tracking-wider text-xs"
              >
                <span>Explorar Catálogo</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/arreglos"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-white hover:bg-[#F8F5EF] text-[#D97B84] hover:text-[#C66973] font-bold px-6 py-3.5 rounded-full border border-[#D97B84]/40 shadow-sm transition-all text-xs uppercase tracking-wider"
              >
                <Scissors className="w-4 h-4 text-[#D89B53]" />
                <span>Pedir a Medida / Costura $</span>
              </Link>
            </div>

            {/* Garantías y Beneficios */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-[#C4D8D9]/70 text-xs text-[#3E5C60]">
              <div className="flex flex-col items-center lg:items-start space-y-1">
                <div className="flex items-center space-x-1 text-[#D97B84] font-bold">
                  <Heart className="w-4 h-4 fill-[#D97B84]" />
                  <span>100% Hecho a Mano</span>
                </div>
                <span className="text-[#597477]">Hilos de alta calidad</span>
              </div>

              <div className="flex flex-col items-center lg:items-start space-y-1">
                <div className="flex items-center space-x-1 text-[#437579] font-bold">
                  <Scissors className="w-4 h-4 text-[#D89B53]" />
                  <span>Ajustes a Medida</span>
                </div>
                <span className="text-[#597477]">Talla y color perfecto</span>
              </div>

              <div className="flex flex-col items-center lg:items-start space-y-1">
                <div className="flex items-center space-x-1 text-emerald-700 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Atención Personal</span>
                </div>
                <span className="text-[#597477]">Envío por WhatsApp</span>
              </div>
            </div>

          </div>

          {/* Columna Derecha: Imagen Real Insignia */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Imagen Principal de la Blusa Insignia Turquesa */}
              <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white group">
                <img
                  src="/productos/466976345_1108162234357955_8056609349265798658_n.jpg"
                  alt="Blusa Turquesa con Volantes Confecciones Imidi"
                  className="w-full h-[400px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#213B3E]/80 via-transparent to-transparent" />

                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-[#C4D8D9] text-[#213B3E] shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs uppercase font-extrabold text-[#D97B84] tracking-wider">Insignia Imidi</span>
                      <h3 className="font-serif text-lg font-bold text-[#213B3E]">Blusa Turquesa con Volantes</h3>
                      <p className="text-xs text-[#597477]">100% hilo de algodón peruano</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-[#597477] block">Desde</span>
                      <span className="text-[#437579] font-bold text-lg">S/ 85.00</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Inset Flotante en esquina inferior sin solapamiento */}
              <div className="absolute -bottom-4 -left-4 hidden sm:flex items-center space-x-3 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-[#437579]/30 shadow-xl">
                <div className="w-9 h-9 rounded-full bg-[#E2ECEC] flex items-center justify-center text-[#437579] font-bold text-sm">
                  ✂️
                </div>
                <div className="text-xs">
                  <p className="font-bold text-[#213B3E]">Servicio de Costura $</p>
                  <p className="text-[#597477]">Arreglos y entalles rápidos</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
