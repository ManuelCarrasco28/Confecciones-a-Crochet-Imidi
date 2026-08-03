'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, CheckCircle2, ArrowRight, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export function Toast({ message, onClose }: ToastProps) {
  // Auto-desaparecer en 2.5 segundos
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 2500);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-4 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
      <div className="bg-white/95 backdrop-blur-md text-[#213B3E] p-3 sm:p-3.5 rounded-2xl shadow-xl border border-[#437579]/30 flex items-center space-x-2.5 sm:space-x-3 max-w-md mx-auto sm:mx-0">
        
        <div className="w-8 h-8 rounded-full bg-[#E2ECEC] text-[#437579] flex items-center justify-center shrink-0 border border-[#437579]/20">
          <CheckCircle2 className="w-4 h-4 text-[#437579]" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-[#213B3E] truncate">{message}</p>
          <p className="text-[10px] text-[#597477] font-medium">Añadido a tu lista de encargos</p>
        </div>

        <div className="flex items-center space-x-1.5 shrink-0">
          <Link
            href="/encargos"
            onClick={onClose}
            className="inline-flex items-center space-x-1 bg-[#437579] hover:bg-[#335C60] text-white font-bold text-[11px] px-3 py-1.5 rounded-xl transition-all shadow-sm"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Ver Encargos</span>
            <ArrowRight className="w-3 h-3" />
          </Link>

          <button
            onClick={onClose}
            className="p-1 text-[#597477] hover:text-[#213B3E] transition-colors"
            aria-label="Cerrar notificación"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
