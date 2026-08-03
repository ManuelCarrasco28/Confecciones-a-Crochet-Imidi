'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, MessageCircle, Scissors, Menu, X, User, LogOut, ShieldCheck, Home, Grid, Mail } from 'lucide-react';
import { STORE_WHATSAPP_NUMBER } from '@/lib/utils';
import { CartItem, CategoryType, UserAccount } from '@/lib/types';

interface NavbarProps {
  cart: CartItem[];
  user: UserAccount | null;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onSelectCategory?: (category: CategoryType) => void;
}

export function Navbar({
  cart,
  user,
  onOpenCart,
  onOpenAuth,
  onLogout,
}: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Cerrar el dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('#user-dropdown-container')) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Bloquear scroll del body cuando menú está abierto
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const firstName = user?.name ? user.name.split(' ')[0] : 'Mi Cuenta';
  const isAdminUser = user?.role === 'admin';

  return (
    <header className="sticky top-0 z-40 bg-[#F8F5EF]/95 backdrop-blur-md text-[#213B3E] border-b border-[#C4D8D9] shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-20 gap-2 sm:gap-4">
          
          {/* Logo Oficial con enlace a la raíz / */}
          <Link
            href="/"
            className="flex items-center space-x-2 sm:space-x-3 cursor-pointer shrink-0"
          >
            <div className="relative w-9 h-9 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-[#437579] shadow-md hover:scale-105 transition-transform bg-white shrink-0">
              <img
                src="/img/logo.png"
                alt="Confecciones a Crochet Imidi"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="shrink-0">
              <h1 className="font-serif text-sm sm:text-lg font-bold tracking-tight text-[#213B3E] leading-tight">
                <span className="hidden xs:inline">Confecciones </span>
                <span className="text-[#437579]">Imidi</span>
              </h1>
            </div>
          </Link>

          {/* Navegación Principal Creativa y Uniforme */}
          <nav className="hidden lg:flex items-center space-x-2.5 text-xs font-bold whitespace-nowrap">
            
            {/* Inicio */}
            <Link
              href="/"
              className={`inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-full border transition-all shadow-sm hover:scale-105 ${
                pathname === '/'
                  ? 'bg-[#437579] text-white border-[#437579] shadow-md'
                  : 'bg-white text-[#213B3E] hover:bg-[#E2ECEC] hover:text-[#437579] border-[#C4D8D9]'
              }`}
            >
              <Home className={`w-3.5 h-3.5 shrink-0 ${pathname === '/' ? 'text-white' : 'text-[#437579]'}`} />
              <span>Inicio</span>
            </Link>

            {/* Catálogo */}
            <Link
              href="/catalogo"
              className={`inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-full border transition-all shadow-sm hover:scale-105 ${
                pathname === '/catalogo'
                  ? 'bg-[#437579] text-white border-[#437579] shadow-md'
                  : 'bg-white text-[#213B3E] hover:bg-[#E2ECEC] hover:text-[#437579] border-[#C4D8D9]'
              }`}
            >
              <Grid className={`w-3.5 h-3.5 shrink-0 ${pathname === '/catalogo' ? 'text-white' : 'text-[#D89B53]'}`} />
              <span>Catálogo</span>
            </Link>

            {/* Costura & Arreglos $ (Estilo blanco idéntico a las demás pestañas) */}
            <Link
              href="/arreglos"
              className={`inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-full border transition-all shadow-sm hover:scale-105 ${
                pathname === '/arreglos'
                  ? 'bg-[#437579] text-white border-[#437579] shadow-md'
                  : 'bg-white text-[#213B3E] hover:bg-[#E2ECEC] hover:text-[#437579] border-[#C4D8D9]'
              }`}
            >
              <Scissors className={`w-3.5 h-3.5 shrink-0 ${pathname === '/arreglos' ? 'text-white' : 'text-[#D89B53]'}`} />
              <span>Costura & Arreglos $</span>
            </Link>

            {/* Contacto */}
            <Link
              href="/contacto"
              className={`inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-full border transition-all shadow-sm hover:scale-105 ${
                pathname === '/contacto'
                  ? 'bg-[#437579] text-white border-[#437579] shadow-md'
                  : 'bg-white text-[#213B3E] hover:bg-[#E2ECEC] hover:text-[#437579] border-[#C4D8D9]'
              }`}
            >
              <Mail className={`w-3.5 h-3.5 shrink-0 ${pathname === '/contacto' ? 'text-white' : 'text-emerald-600'}`} />
              <span>Contacto</span>
            </Link>
          </nav>

          {/* Acciones Rápidas del Usuario */}
          <div className="flex items-center space-x-1.5 sm:space-x-2.5 shrink-0">
            
            {/* Estado del Usuario / Ingresar */}
            {user ? (
              <div className="relative" id="user-dropdown-container">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-1.5 sm:space-x-2 bg-white border border-[#C4D8D9] hover:border-[#437579] px-2 sm:px-3 py-1.5 rounded-full shadow-sm text-xs font-bold text-[#213B3E] transition-all"
                >
                  <div className="w-5 h-5 rounded-full bg-[#437579] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline max-w-[100px] truncate">{firstName}</span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white border border-[#C4D8D9] rounded-2xl shadow-2xl py-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2 border-b border-[#E2ECEC]">
                      <p className="font-bold text-[#213B3E] truncate">{user.name}</p>
                      <p className="text-[10px] text-[#597477] truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#E2ECEC] text-[#437579] uppercase">
                        {user.role}
                      </span>
                    </div>

                    {isAdminUser && (
                      <Link
                        href="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="w-full text-left px-4 py-2 text-[#213B3E] hover:bg-[#F8F5EF] flex items-center gap-2 font-semibold"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-[#437579]" />
                        <span>Panel Admin</span>
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-semibold border-t border-[#E2ECEC] mt-1"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="inline-flex items-center space-x-1.5 bg-white hover:bg-[#E2ECEC] text-[#213B3E] font-bold text-xs px-2.5 sm:px-3 py-2 rounded-full border border-[#C4D8D9] transition-all shadow-sm whitespace-nowrap"
              >
                <User className="w-3.5 h-3.5 text-[#437579]" />
                <span className="hidden sm:inline">Ingresar</span>
              </button>
            )}

            {/* Lista de Encargos */}
            <button
              onClick={onOpenCart}
              className="relative p-2 sm:p-2.5 rounded-full bg-[#E2ECEC] hover:bg-[#C4D8D9] text-[#213B3E] hover:text-[#437579] transition-all border border-[#437579]/30 flex items-center gap-1 px-2.5 sm:px-3 whitespace-nowrap"
              aria-label="Ver lista de encargos"
              title="Lista de Encargos a WhatsApp"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-[#437579]" />
              <span className="hidden sm:inline text-xs font-bold text-[#213B3E]">Encargos</span>
              {totalItemsCount > 0 && (
                <span className="bg-[#D97B84] text-white text-[10px] sm:text-xs font-extrabold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-md ml-0.5 animate-pulse">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* Botón WhatsApp Directo */}
            <a
              href={`https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent('¡Hola Confecciones a Crochet Imidi! Quisiera consultar disponibilidad y hacer un pedido.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-full shadow-md transition-all whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>

            {/* Menú Móvil */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#213B3E] hover:text-[#437579] focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Menú Móvil Desplegable con animación */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-4 border-t border-[#C4D8D9] space-y-2 bg-[#F8F5EF] px-2 rounded-b-2xl font-bold text-xs">
            {!user ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="block w-full text-left px-3 py-3 bg-[#437579] text-white rounded-lg font-bold"
              >
                🔑 Iniciar Sesión / Registro
              </button>
            ) : (
              <div className="px-3 py-2.5 bg-white rounded-lg border border-[#C4D8D9] flex items-center justify-between">
                <span>Hola, <strong>{user.name}</strong></span>
                <button onClick={onLogout} className="text-rose-600 text-xs font-bold">Salir</button>
              </div>
            )}

            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 w-full text-left px-3.5 py-3 bg-white border border-[#C4D8D9] text-[#213B3E] rounded-xl font-bold"
            >
              <Home className="w-4 h-4 text-[#437579]" />
              <span>Inicio</span>
            </Link>

            <Link
              href="/catalogo"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 w-full text-left px-3.5 py-3 bg-white border border-[#C4D8D9] text-[#213B3E] rounded-xl font-bold"
            >
              <Grid className="w-4 h-4 text-[#D89B53]" />
              <span>Catálogo de Prendas</span>
            </Link>

            <Link
              href="/arreglos"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 w-full text-left px-3.5 py-3 bg-white border border-[#C4D8D9] text-[#213B3E] rounded-xl font-bold"
            >
              <Scissors className="w-4 h-4 text-[#D89B53]" />
              <span>Costura & Arreglos $</span>
            </Link>

            <Link
              href="/contacto"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 w-full text-left px-3.5 py-3 bg-white border border-[#C4D8D9] text-[#213B3E] rounded-xl font-bold"
            >
              <Mail className="w-4 h-4 text-emerald-600" />
              <span>Contacto</span>
            </Link>

            {isAdminUser && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 w-full text-left px-3.5 py-3 bg-slate-900 text-white rounded-xl font-bold"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Panel Admin</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
