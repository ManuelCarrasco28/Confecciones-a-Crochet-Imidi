'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Scissors, Heart, ShieldCheck, ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F8F5EF] via-[#EAF1F1] to-[#F8F5EF] text-[#213B3E] py-8 sm:py-12 lg:py-20 border-b border-[#C4D8D9]">
      
      {/* Elementos Decorativos de Fondo inspirados en los hilos del logo */}
      <div className="absolute top-0 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-[#437579]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-48 sm:w-80 h-48 sm:h-80 bg-[#D97B84]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-center">
          
          {/* Columna Izquierda: Información de Marca & CTA */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left">
            
            {/* Distintivos Artesanales */}
            <div className="inline-flex items-center space-x-2 bg-white/90 border border-[#437579]/30 px-3 sm:px-4 py-1.5 rounded-full shadow-sm">
              <Sparkles className="w-4 h-4 text-[#D89B53] animate-pulse" />
              <span className="text-[11px] sm:text-sm font-bold text-[#437579]">
                Confección Artesanal & Arreglos a Medida
              </span>
            </div>

            {/* Título Principal con Gradiente de Colores del Logo */}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-tight text-[#213B3E]">
              Elegancia y Calidez en <span className="bg-gradient-to-r from-[#437579] via-[#244246] to-[#D97B84] bg-clip-text text-transparent">Tejidos a Crochet</span>
            </h1>

            {/* Descripción de Negocio */}
            <p className="text-[#3E5C60] text-sm sm:text-base lg:text-lg max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              En <strong className="text-[#437579] font-bold">Confecciones a Crochet Imidi</strong> creamos prendas únicas hechas a mano: blusas caladas, vestidos de ensueño, vinchas, tapetes para el hogar y brindamos servicio profesional de costura y arreglos a tu medida.
            </p>

            {/* Botones de Acción Redirigidos Correctamente */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <Link
                href="/catalogo"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-[#437579] hover:bg-[#335C60] text-white font-bold px-6 sm:px-7 py-3.5 rounded-full shadow-lg shadow-[#437579]/20 hover:scale-[1.02] transition-all uppercase tracking-wider text-xs"
              >
                <span>Explorar Catálogo</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/arreglos"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-white hover:bg-[#F8F5EF] text-[#D97B84] hover:text-[#C66973] font-bold px-5 sm:px-6 py-3.5 rounded-full border border-[#D97B84]/40 shadow-sm transition-all text-xs uppercase tracking-wider"
              >
                <Scissors className="w-4 h-4 text-[#D89B53]" />
                <span>Pedir a Medida / Costura $</span>
              </Link>
            </div>

            {/* Garantías y Beneficios */}
            <div className="pt-4 sm:pt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 border-t border-[#C4D8D9]/70 text-xs text-[#3E5C60]">
              <div className="flex items-center sm:flex-col sm:items-center lg:items-start space-x-2 sm:space-x-0 sm:space-y-1">
                <div className="flex items-center space-x-1 text-[#D97B84] font-bold">
                  <Heart className="w-4 h-4 fill-[#D97B84]" />
                  <span>100% Hecho a Mano</span>
                </div>
                <span className="text-[#597477] hidden sm:inline">Hilos de alta calidad</span>
              </div>

              <div className="flex items-center sm:flex-col sm:items-center lg:items-start space-x-2 sm:space-x-0 sm:space-y-1">
                <div className="flex items-center space-x-1 text-[#437579] font-bold">
                  <Scissors className="w-4 h-4 text-[#D89B53]" />
                  <span>Ajustes a Medida</span>
                </div>
                <span className="text-[#597477] hidden sm:inline">Talla y color perfecto</span>
              </div>

              <div className="flex items-center sm:flex-col sm:items-center lg:items-start space-x-2 sm:space-x-0 sm:space-y-1">
                <div className="flex items-center space-x-1 text-emerald-700 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Atención Personal</span>
                </div>
                <span className="text-[#597477] hidden sm:inline">Envío por WhatsApp</span>
              </div>
            </div>

          </div>

          {/* Columna Derecha: Imagen Real Insignia */}
          <div className="lg:col-span-5 relative mt-2 lg:mt-0">
            <div className="relative mx-auto max-w-sm sm:max-w-md lg:max-w-none">
              
              {/* Imagen Principal de la Blusa Insignia Turquesa */}
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border-2 sm:border-4 border-white group">
                <img
                  src="/productos/466976345_1108162234357955_8056609349265798658_n.jpg"
                  alt="Blusa Turquesa con Volantes Confecciones Imidi"
                  className="w-full h-[280px] sm:h-[350px] lg:h-[400px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#213B3E]/80 via-transparent to-transparent" />

                <div className="absolute bottom-4 sm:bottom-6 left-3 sm:left-6 right-3 sm:right-6 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/95 backdrop-blur-md border border-[#C4D8D9] text-[#213B3E] shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] sm:text-xs uppercase font-extrabold text-[#D97B84] tracking-wider">Insignia Imidi</span>
                      <h3 className="font-serif text-sm sm:text-lg font-bold text-[#213B3E] truncate">Blusa Turquesa con Volantes</h3>
                      <p className="text-[10px] sm:text-xs text-[#597477]">100% hilo de algodón peruano</p>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <span className="text-[10px] sm:text-xs text-[#597477] block">Desde</span>
                      <span className="text-[#437579] font-bold text-base sm:text-lg">S/ 85.00</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Inset Flotante en esquina inferior */}
              <div className="absolute -bottom-3 sm:-bottom-4 -left-2 sm:-left-4 flex items-center space-x-2 sm:space-x-3 bg-white/95 backdrop-blur-md p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border border-[#437579]/30 shadow-xl">
                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-[#E2ECEC] flex items-center justify-center text-[#437579] font-bold text-xs sm:text-sm">
                  ✂️
                </div>
                <div className="text-[10px] sm:text-xs">
                  <p className="font-bold text-[#213B3E]">Servicio de Costura $</p>
                  <p className="text-[#597477] hidden sm:block">Arreglos y entalles rápidos</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
