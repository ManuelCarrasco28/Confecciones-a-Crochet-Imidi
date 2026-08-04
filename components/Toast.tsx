'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { gsap } from 'gsap';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export function Toast({ message, onClose }: ToastProps) {
  const toastRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    if (!toastRef.current) {
      onClose();
      return;
    }
    gsap.to(toastRef.current, {
      y: -20,
      opacity: 0,
      scale: 0.9,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: onClose,
    });
  }, [onClose]);

  useEffect(() => {
    const toast = toastRef.current;
    const icon = iconRef.current;
    if (!message || !toast) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
      gsap.fromTo(
        toast,
        { y: -30, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(1.7)' }
      );

      if (icon) {
        gsap.fromTo(
          icon,
          { scale: 0, rotate: -45 },
          { scale: 1, rotate: 0, duration: 0.35, delay: 0.1, ease: 'back.out(2)' }
        );
      }
    }

    // Auto-desaparición con animación de salida GSAP
    const timer = setTimeout(() => {
      handleClose();
    }, 1800);

    return () => {
      clearTimeout(timer);
      gsap.killTweensOf(toast);
      if (icon) gsap.killTweensOf(icon);
    };
  }, [handleClose, message]);

  if (!message) return null;

  // Extraer el nombre de la prenda limpiando la cadena
  const cleanTitle = message
    .replace(/^¡"/, '')
    .replace(/" añadido a tus Encargos! 🛍️$/, '')
    .replace(/^¡/, '')
    .replace(/!$/, '');

  return (
    <div
      ref={toastRef}
      role="status"
      aria-live="polite"
      className="fixed top-24 right-4 sm:right-8 z-50 pointer-events-auto"
    >
      <div className="bg-white text-slate-800 p-3 sm:py-3 sm:px-4 rounded-xl shadow-xl border border-slate-100 border-l-4 border-l-emerald-500 flex items-center gap-3 max-w-xs sm:max-w-sm w-full transition-transform duration-200 hover:scale-[1.02]">
        
        {/* Icono de Éxito Verde GSAP */}
        <div ref={iconRef} className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-white" />
        </div>

        {/* Texto Corto y Conciso */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-slate-900 leading-tight">
            Añadido a tus Encargos
          </p>
          <p className="text-[11px] text-slate-500 truncate mt-0.5 font-medium">
            {cleanTitle}
          </p>
        </div>

        {/* Botón de Cierre Simple */}
        <button
          onClick={handleClose}
          className="p-1 text-slate-400 hover:text-slate-600 transition-colors shrink-0"
          aria-label="Cerrar"
        >
          <X className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
}
