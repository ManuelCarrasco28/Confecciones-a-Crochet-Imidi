'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Award, Scissors, Heart, ShieldCheck, ArrowRight } from 'lucide-react';
import { gsap } from '@/lib/gsap';

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Entrada en secuencia de elementos del hero
      if (badgeRef.current) {
        tl.fromTo(badgeRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 });
      }
      if (titleRef.current) {
        tl.fromTo(titleRef.current, { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.3');
      }
      if (descRef.current) {
        tl.fromTo(descRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '-=0.3');
      }
      if (ctaRef.current?.children) {
        tl.fromTo(Array.from(ctaRef.current.children), { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.1 }, '-=0.2');
      }
      if (featuresRef.current?.children) {
        tl.fromTo(Array.from(featuresRef.current.children), { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.1 }, '-=0.2');
      }
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative overflow-hidden bg-gradient-to-b from-[#F8F5EF] via-[#EAF1F1] to-[#F8F5EF] text-[#213B3E] py-7 sm:py-16 lg:py-24 border-b border-[#C4D8D9]">
      
      {/* Elementos Decorativos de Fondo */}
      <div className="absolute top-0 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-[#437579]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-48 sm:w-80 h-48 sm:h-80 bg-[#D97B84]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10 text-center space-y-4 sm:space-y-7">
        
        {/* Distintivos Artesanales */}
        <div ref={badgeRef} className="inline-flex max-w-full items-center space-x-2 bg-white/90 border border-[#437579]/30 px-3 sm:px-4 py-1.5 rounded-full shadow-sm">
          <Award className="w-4 h-4 text-[#D89B53] shrink-0" />
          <span className="text-[11px] sm:text-sm font-bold text-[#437579] leading-tight">
            Confección Artesanal & Arreglos a Medida
          </span>
        </div>

        {/* Título Principal */}
        <h1 ref={titleRef} className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-normal leading-tight text-[#213B3E]">
          Elegancia y Calidez en <span className="bg-gradient-to-r from-[#437579] via-[#244246] to-[#D97B84] bg-clip-text text-transparent">Tejidos a Crochet</span>
        </h1>

        {/* Descripción */}
        <p ref={descRef} className="text-[#3E5C60] text-sm sm:text-base lg:text-lg max-w-2xl mx-auto font-normal leading-6 sm:leading-relaxed">
          En <strong className="text-[#437579] font-bold">Confecciones a Crochet Imidi</strong> creamos prendas únicas hechas a mano: blusas caladas, vestidos de ensueño, vinchas, tapetes para el hogar y brindamos servicio profesional de costura y arreglos a tu medida.
        </p>

        {/* Botones de Acción */}
        <div ref={ctaRef} className="pt-1 sm:pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-4">
          <Link
            href="/catalogo"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-[#437579] hover:bg-[#335C60] text-white font-bold px-7 py-3 sm:py-3.5 rounded-full shadow-lg shadow-[#437579]/20 hover:scale-[1.02] transition-all uppercase tracking-wider text-xs"
          >
            <span>Explorar Catálogo</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/arreglos"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-white hover:bg-[#F8F5EF] text-[#D97B84] hover:text-[#C66973] font-bold px-6 py-3 sm:py-3.5 rounded-full border border-[#D97B84]/40 shadow-sm transition-all text-xs uppercase tracking-wider"
          >
            <Scissors className="w-4 h-4 text-[#D89B53]" />
            <span>Pedir a Medida / Costura</span>
          </Link>
        </div>

        {/* Garantías y Beneficios Escalonados */}
        <div ref={featuresRef} className="pt-4 sm:pt-6 grid grid-cols-3 gap-1.5 sm:gap-4 border-t border-[#C4D8D9]/70 text-[#3E5C60] max-w-2xl mx-auto">
          <div className="min-w-0 flex flex-col items-center gap-1 px-0.5">
            <div className="flex flex-col sm:flex-row items-center gap-1 text-[#D97B84] font-bold">
              <Heart className="w-4 h-4 fill-[#D97B84] shrink-0" />
              <span className="text-[10px] sm:text-xs leading-tight">100% Hecho a Mano</span>
            </div>
            <span className="text-[9px] sm:text-xs leading-tight text-[#597477]">Hilos de alta calidad</span>
          </div>

          <div className="min-w-0 flex flex-col items-center gap-1 px-0.5">
            <div className="flex flex-col sm:flex-row items-center gap-1 text-[#437579] font-bold">
              <Scissors className="w-4 h-4 text-[#D89B53] shrink-0" />
              <span className="text-[10px] sm:text-xs leading-tight">Ajustes a Medida</span>
            </div>
            <span className="text-[9px] sm:text-xs leading-tight text-[#597477]">Talla y color perfecto</span>
          </div>

          <div className="min-w-0 flex flex-col items-center gap-1 px-0.5">
            <div className="flex flex-col sm:flex-row items-center gap-1 text-emerald-700 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-[10px] sm:text-xs leading-tight">Atención Personal</span>
            </div>
            <span className="text-[9px] sm:text-xs leading-tight text-[#597477]">Envío por WhatsApp</span>
          </div>
        </div>

      </div>
    </section>
  );
}
