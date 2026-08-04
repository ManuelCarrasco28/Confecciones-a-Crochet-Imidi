'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { ProductCard } from '@/components/ProductCard';
import { ProductModal } from '@/components/ProductModal';
import { Footer } from '@/components/Footer';
import { AuthModal } from '@/components/AuthModal';
import { Toast } from '@/components/Toast';

import { getStoredCart, addToStoredCart } from '@/lib/cart';
import { getCachedProducts, setCachedProducts } from '@/lib/productsCache';
import { Product, CartItem, YARN_OPTIONS, UserAccount, YarnType, CategoryType } from '@/lib/types';
import { INITIAL_PRODUCTS } from '@/lib/mockData';
import { createClient } from '@/lib/supabase/client';
import { Award, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  const [cart, setCart] = useState<CartItem[]>([]);

  // Sincronizar carrito con localStorage
  useEffect(() => {
    const loadCart = () => setCart(getStoredCart());
    loadCart();
    window.addEventListener('imidi_cart_updated', loadCart);
    window.addEventListener('storage', loadCart);
    return () => {
      window.removeEventListener('imidi_cart_updated', loadCart);
      window.removeEventListener('storage', loadCart);
    };
  }, []);

  // Modales y Estados de Usuario
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState<UserAccount | null>(null);

  // Estado del Carrusel Infinito Continuo (Avance producto por producto)
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Escuchar cambios de sesión real de Supabase Auth
  useEffect(() => {
    const supabase = createClient();

    async function checkCurrentSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const userMetaRole = session.user.user_metadata?.role || 
            (session.user.email?.toLowerCase() === 'josemanuelcarrascomillan@gmail.com' ? 'admin' : 'cliente');
          
          setUser({
            id: session.user.id,
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Cliente Imidi',
            email: session.user.email || '',
            role: userMetaRole,
          });
        }
      } catch {
        // Ignorar errores de verificación de sesión en cliente
      }
    }

    checkCurrentSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const userMetaRole = session.user.user_metadata?.role || 
          (session.user.email?.toLowerCase() === 'josemanuelcarrascomillan@gmail.com' ? 'admin' : 'cliente');
        
        setUser({
          id: session.user.id,
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Cliente Imidi',
          email: session.user.email || '',
          role: userMetaRole,
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Cargar productos reales de Supabase
  useEffect(() => {
    let cancelled = false;

    async function loadProductsFromSupabase() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from('products').select('*');

        if (error) throw error;

        const mapped: Product[] = (data || []).map((item: {
            id: string;
            name: string;
            category: CategoryType;
            price: number;
            description: string;
            details?: string[];
            colors?: string[];
            yarn_types?: YarnType[];
            sizes?: string[];
            image_url: string;
            in_stock?: boolean;
          }) => ({
            id: item.id,
            name: item.name,
            category: item.category,
            price: Number(item.price),
            description: item.description,
            details: item.details || [],
            colors: item.colors || [],
            yarnTypes: item.yarn_types || YARN_OPTIONS,
            sizes: item.sizes || [],
            imageUrl: item.image_url,
            inStock: item.in_stock ?? true,
          }));

        if (cancelled) return;
        setProducts(mapped);
        setCachedProducts(mapped);
      } catch {
        if (cancelled) return;
        const cached = getCachedProducts();
        setProducts(cached.length > 0 ? cached : INITIAL_PRODUCTS);
      } finally {
        if (!cancelled) setIsLoadingProducts(false);
      }
    }
    loadProductsFromSupabase();

    return () => {
      cancelled = true;
    };
  }, []);

  // Filtrar solo productos disponibles en stock para los clientes
  const availableProducts = useMemo(() => {
    return products.filter((p) => p.inStock !== false);
  }, [products]);

  // Timer para Carrusel Automático Infinito (Se desplaza solo cada 15 segundos)
  useEffect(() => {
    if (isHovered || availableProducts.length === 0) return;
    const interval = setInterval(() => {
      setCarouselIndex((prevIndex) => (prevIndex + 1) % availableProducts.length);
    }, 15000);

    return () => clearInterval(interval);
  }, [isHovered, availableProducts.length]);

  // Obtener siempre 4 productos exactos de forma CÍCLICA e INFINITA (Cero espacios vacíos)
  const visibleProducts = useMemo(() => {
    if (availableProducts.length === 0) return [];
    const count = Math.min(4, availableProducts.length);
    return Array.from({ length: count }).map((_, offset) => {
      const idx = (carouselIndex + offset) % availableProducts.length;
      return availableProducts[idx];
    });
  }, [availableProducts, carouselIndex]);



  const handleLoginSuccess = (userData: UserAccount) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Ignorar
    }
    setUser(null);
  };

  const handleAddToCart = (
    product: Product,
    selectedSize?: string,
    selectedColor?: string,
    customNotes?: string,
    selectedYarn?: string
  ) => {
    const updated = addToStoredCart(product, selectedSize, selectedColor, customNotes, selectedYarn);
    setCart(updated);
    setToastMessage(`¡"${product.name}" añadido a tus Encargos! 🛍️`);
  };



  const carouselTrackRef = useRef<HTMLDivElement>(null);

  // Animación suave GSAP al cambiar de slide en el carrusel
  useEffect(() => {
    if (!carouselTrackRef.current) return;
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(
        carouselTrackRef.current,
        { opacity: 0.85, x: 20 },
        { opacity: 1, x: 0, duration: 0.45, ease: 'power2.out' }
      );
    });
    return () => mm.revert();
  }, [carouselIndex]);

  const nextSlide = () => {
    if (availableProducts.length === 0) return;
    setCarouselIndex((prev) => (prev + 1) % availableProducts.length);
  };

  const prevSlide = () => {
    if (availableProducts.length === 0) return;
    setCarouselIndex((prev) => (prev - 1 + availableProducts.length) % availableProducts.length);
  };

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#213B3E] flex flex-col font-sans selection:bg-[#437579] selection:text-white">
      
      {/* Navegación Superior */}
      <Navbar
        cart={cart}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
      />

      <main className="flex-1">
        {/* Banner Principal Hero */}
        <Hero />

        {/* Sección de Carrusel Cíclico Infinito de Prendas Destacadas */}
        <section className="py-16 bg-[#F8F5EF] overflow-hidden relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
              <div>
                <div className="inline-flex items-center space-x-2 bg-white border border-[#C4D8D9] px-3 sm:px-4 py-1 rounded-full text-[10px] sm:text-xs font-bold text-[#437579] shadow-sm mb-1.5">
                  <Award className="w-3.5 h-3.5 text-[#D89B53]" />
                  <span>Catálogo Animado & Continuo</span>
                </div>
                <h2 className="font-serif text-xl sm:text-3xl font-bold text-[#213B3E]">
                  Prendas & Diseños Destacados
                </h2>
              </div>

              <Link
                href="/catalogo"
                className="inline-flex items-center space-x-2 bg-[#437579] hover:bg-[#335C60] text-white font-bold text-xs px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl shadow-md transition-all uppercase tracking-wider"
              >
                <span>Ver Todo el Catálogo</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Link>
            </div>

            {/* Pista del Carrusel Cíclico Infinito con Pausa al Cursor */}
            <div
              className="relative group px-1 sm:px-0"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onTouchStart={() => setIsHovered(true)}
              onTouchEnd={() => setIsHovered(false)}
            >
              
              {/* Botón Flotante Lateral Izquierda (Atrás) */}
              <button
                onClick={prevSlide}
                className="flex absolute -left-2 sm:-left-6 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-white/95 text-[#437579] border border-sm:border-2 border-[#437579] shadow-lg hover:scale-110 hover:bg-[#437579] hover:text-white items-center justify-center transition-all"
                aria-label="Flecha Atrás"
                title="Atrás"
              >
                <ChevronLeft className="w-4 h-4 sm:w-7 sm:h-7 stroke-[2.5]" />
              </button>

              {/* Botón Flotante Lateral Derecha (Adelante) */}
              <button
                onClick={nextSlide}
                className="flex absolute -right-2 sm:-right-6 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-[#437579] text-white border border-sm:border-2 border-[#437579] shadow-lg hover:scale-110 hover:bg-[#335C60] items-center justify-center transition-all"
                aria-label="Flecha Adelante"
                title="Adelante"
              >
                <ChevronRight className="w-4 h-4 sm:w-7 sm:h-7 stroke-[2.5]" />
              </button>

              {/* Grilla Cíclica de Productos Animada con GSAP */}
              <div
                ref={carouselTrackRef}
                className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6 py-2 px-1"
              >
                {isLoadingProducts
                  ? Array.from({ length: 4 }).map((_, idx) => (
                      <div
                        key={`featured-skeleton-${idx}`}
                        className={`${idx >= 2 ? 'hidden sm:block' : 'block'} overflow-hidden rounded-2xl sm:rounded-3xl border border-[#C4D8D9] bg-white`}
                        aria-hidden="true"
                      >
                        <div className="aspect-[4/5] bg-[#E2ECEC] animate-pulse" />
                        <div className="p-2.5 sm:p-5 space-y-3">
                          <div className="h-4 rounded bg-[#D5E3E3] animate-pulse" />
                          <div className="h-3 w-3/4 rounded bg-[#E2ECEC] animate-pulse" />
                          <div className="h-8 rounded-xl bg-[#D5E3E3] animate-pulse" />
                        </div>
                      </div>
                    ))
                  : visibleProducts.slice(0, 4).map((prod, idx) => (
                      <div key={`${prod.id}-${idx}`} className={idx >= 2 ? 'hidden sm:block' : 'block'}>
                        <ProductCard
                          product={prod}
                          onOpenModal={(product) => setSelectedProduct(product)}
                          onAddToCart={(product) => handleAddToCart(product)}
                        />
                      </div>
                    ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Pie de Página */}
      <Footer user={user} />

      {/* Modal de Detalle de Producto */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Modal de Autenticación */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Toast de Notificación */}
      <Toast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />

    </div>
  );
}
