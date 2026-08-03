'use client';

import React, { useState } from 'react';
import { X, Check, Copy } from 'lucide-react';

interface SupabaseGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SupabaseGuideModal({ isOpen, onClose }: SupabaseGuideModalProps) {
  // Regla de Hooks de React: Declarar Hooks SIEMPRE en la parte superior
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white border border-[#C4D8D9] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-[#213B3E]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#F8F5EF] hover:bg-[#E2ECEC] text-[#213B3E] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-serif text-xl font-bold text-[#213B3E] mb-2">Guía de Configuración Supabase</h3>
        <p className="text-xs text-[#597477] mb-4">Variables de entorno configuradas para el proyecto.</p>

        <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl text-xs font-mono relative space-y-1">
          <p>NEXT_PUBLIC_SUPABASE_URL=https://fldtgbnjmkdhowndvftj.supabase.co</p>
          <p>NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_57UyTw_C4wwzqYdnFtdAqw_3FP0vF5r</p>
          <button
            onClick={handleCopy}
            className="absolute top-3 right-3 p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs flex items-center gap-1 text-white font-sans"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copiado' : 'Copiar'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
