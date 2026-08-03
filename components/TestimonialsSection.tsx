'use client';

import React from 'react';
import { TESTIMONIALS } from '@/lib/mockData';
import { Star, HeartHandshake, Scissors, Award } from 'lucide-react';

export function TestimonialsSection() {
  return (
    <section className="py-12 sm:py-20 bg-[#F8F5EF] text-[#213B3E] border-b border-[#C4D8D9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabecera de Opiniones */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-16 space-y-3">
          <div className="inline-flex items-center space-x-1.5 text-xs font-extrabold text-[#437579] uppercase tracking-widest">
            <HeartHandshake className="w-4 h-4 text-[#D97B84]" />
            <span>Confianza & Satisfacción</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#213B3E]">
            Lo que dicen nuestras clientas
          </h2>
          <p className="text-[#597477] text-sm font-normal">
            Cada puntada a crochet y cada arreglo de costura lleva nuestra dedicación artesanal y cariño por la moda peruana.
          </p>
        </div>

        {/* Rejilla de Opiniones */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white p-6 rounded-3xl border border-[#C4D8D9] shadow-sm flex flex-col justify-between space-y-4 hover:border-[#437579] transition-all"
            >
              <div className="space-y-3">
                <div className="flex space-x-1 text-[#D89B53]">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#D89B53]" />
                  ))}
                </div>
                <p className="text-[#3E5C60] text-xs sm:text-sm font-normal italic leading-relaxed">
                  &quot;{testimonial.comment}&quot;
                </p>
              </div>

              <div className="flex items-center space-x-3 pt-4 border-t border-[#E2ECEC]">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#437579]"
                />
                <div>
                  <h4 className="font-serif text-xs font-bold text-[#213B3E]">
                    {testimonial.name}
                  </h4>
                  <p className="text-[11px] text-[#D97B84] font-bold">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pilares de Calidad */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 border-t border-[#C4D8D9]">
          <div className="flex items-center space-x-4 bg-white p-4 rounded-2xl border border-[#C4D8D9] shadow-sm">
            <div className="p-3 bg-[#E2ECEC] text-[#437579] rounded-xl">
              <Award className="w-6 h-6 text-[#D89B53]" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-[#213B3E]">Crochet 100% Manual</h4>
              <p className="text-xs text-[#597477]">Confección meticulosa a mano</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 bg-white p-4 rounded-2xl border border-[#C4D8D9] shadow-sm">
            <div className="p-3 bg-[#F9EBEF] text-[#D97B84] rounded-xl">
              <Scissors className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-[#213B3E]">Servicio de Costura</h4>
              <p className="text-xs text-[#597477]">Entalles y arreglos a tu medida</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 bg-white p-4 rounded-2xl border border-[#C4D8D9] shadow-sm">
            <div className="p-3 bg-[#E2ECEC] text-[#437579] rounded-xl">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-[#213B3E]">Hilos Seleccionados</h4>
              <p className="text-xs text-[#597477]">Algodón suave y resistente</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
