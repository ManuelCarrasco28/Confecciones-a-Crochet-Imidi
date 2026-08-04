import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import { CatalogoClientContent } from '@/components/CatalogoClientContent';

export const metadata: Metadata = {
  title: 'Catálogo de Prendas y Tejidos a Crochet | Confecciones Imidi',
  description: 'Descubre nuestra colección exclusiva de blusas, vestidos, tapetes y diademas tejidas a mano con hilos de algodón peruano.',
  openGraph: {
    title: 'Catálogo de Prendas y Tejidos a Crochet | Confecciones Imidi',
    description: 'Blusas caladas, vestidos de ensueño, vinchas y tapetes artesanales tejidos a mano.',
    type: 'website',
  },
};

export default function CatalogoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8F5EF] flex items-center justify-center p-8 text-center text-xs font-bold text-[#437579]">
          Cargando Catálogo Imidi...
        </div>
      }
    >
      <CatalogoClientContent />
    </Suspense>
  );
}
