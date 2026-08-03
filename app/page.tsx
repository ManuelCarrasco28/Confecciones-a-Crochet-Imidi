'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { ProductCard } from '@/components/ProductCard';
import { ProductModal } from '@/components/ProductModal';
import { CartDrawer } from '@/components/CartDrawer';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { Footer } from '@/components/Footer';
import { AuthModal } from '@/components/AuthModal';

import { Product, CartItem, YARN_OPTIONS, UserAccount, YarnType, CategoryType } from '@/lib/types';
import { INITIAL_PRODUCTS } from '@/lib/mockData';
import { createClient } from '@/lib/supabase/client';
import { Sparkles, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const savedCart = localStorage.getItem('imidi_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });
  
  // Modales y Estados de Usuario
  const [isCartOpen, setIsCartOpen] = useState(false);
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
    async function loadProductsFromSupabase() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from('products').select('*');
        
        if (data && data.length > 0 && !error) {
          const mapped: Product[] = data.map((item: {
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
          setProducts(mapped);
        }
      } catch {
        // Ignorar fallos de carga
      }
    }
    loadProductsFromSupabase();
  }, []);

  // Timer para Carrusel Automático Infinito (Se desplaza solo cada 3.5 segundos)
  useEffect(() => {
    if (isHovered || products.length === 0) return;
    const interval = setInterval(() => {
      setCarouselIndex((prevIndex) => (prevIndex + 1) % products.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [isHovered, products.length]);

  // Obtener siempre 4 productos exactos de forma CÍCLICA e INFINITA (Cero espacios vacíos)
  const visibleProducts = useMemo(() => {
    if (products.length === 0) return [];
    const count = Math.min(4, products.length);
    return Array.from({ length: count }).map((_, offset) => {
      const idx = (carouselIndex + offset) % products.length;
      return products[idx];
    });
  }, [products, carouselIndex]);

  // Guardar carrito
  useEffect(() => {
    try {
      localStorage.setItem('imidi_cart', JSON.stringify(cart));
    } catch {
      // Ignorar fallos de escritura en localStorage
    }
  }, [cart]);

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
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor &&
          item.selectedYarn === selectedYarn
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += 1;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            product,
            quantity: 1,
            selectedSize: selectedSize || product.sizes[0],
            selectedColor: selectedColor || product.colors[0],
            selectedYarn: selectedYarn || 'Algodón',
            customNotes,
          },
        ];
      }
    });
  };

  const handleUpdateQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(index);
      return;
    }
    setCart((prev) => {
      const updated = [...prev];
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const handleRemoveItem = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const nextSlide = () => {
    setCarouselIndex((prev) => (prev + 1) % products.length);
  };

  const prevSlide = () => {
    setCarouselIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#213B3E] flex flex-col font-sans selection:bg-[#437579] selection:text-white">
      
      {/* Navegación Superior */}
      <Navbar
        cart={cart}
        user={user}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
      />

      <main className="flex-1">
        {/* Banner Principal Hero */}
        <Hero />

        {/* Sección de Carrusel Cíclico Infinito de Prendas Destacadas (Cero espacios en blanco) */}
        <section
          className="py-16 bg-[#F8F5EF] overflow-hidden relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
              <div>
                <div className="inline-flex items-center space-x-2 bg-white border border-[#C4D8D9] px-3.5 py-1 rounded-full text-xs font-bold text-[#437579] shadow-sm mb-2">
                  <Sparkles className="w-4 h-4 text-[#D89B53] animate-pulse" />
                  <span>Catálogo Animado & Continuo</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#213B3E]">
                  Prendas & Diseños Destacados
                </h2>
              </div>

              <Link
                href="/catalogo"
                className="inline-flex items-center space-x-2 bg-[#437579] hover:bg-[#335C60] text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-md transition-all uppercase tracking-wider"
              >
                <span>Ver Todo el Catálogo</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Pista del Carrusel Cíclico Infinito con Botones Flotantes Laterales */}
            <div className="relative group">
              
              {/* Botón Flotante Lateral Izquierda (Atrás) */}
              <button
                onClick={prevSlide}
                className="absolute -left-4 sm:-left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white text-[#437579] border-2 border-[#437579] shadow-xl hover:scale-110 hover:bg-[#437579] hover:text-white flex items-center justify-center transition-all"
                aria-label="Flecha Atrás"
                title="Atrás"
              >
                <ChevronLeft className="w-7 h-7 stroke-[2.5]" />
              </button>

              {/* Botón Flotante Lateral Derecha (Adelante) */}
              <button
                onClick={nextSlide}
                className="absolute -right-4 sm:-right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-[#437579] text-white border-2 border-[#437579] shadow-xl hover:scale-110 hover:bg-[#335C60] flex items-center justify-center transition-all"
                aria-label="Flecha Adelante"
                title="Adelante"
              >
                <ChevronRight className="w-7 h-7 stroke-[2.5]" />
              </button>

              {/* Grilla Cíclica de 4 Productos Continuos (Sin espacios vacíos) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-2 px-1 transition-all duration-500">
                {visibleProducts.map((prod, idx) => (
                  <ProductCard
                    key={`${prod.id}-${idx}`}
                    product={prod}
                    onOpenModal={(product) => setSelectedProduct(product)}
                    onAddToCart={(product) => handleAddToCart(product)}
                  />
                ))}
              </div>
            </div>

            {/* Indicadores de Puntos (Dots) Cíclicos */}
            {products.length > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8">
                {products.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCarouselIndex(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      carouselIndex === idx ? 'w-8 bg-[#437579]' : 'w-2.5 bg-[#C4D8D9] hover:bg-[#437579]/60'
                    }`}
                    aria-label={`Ir a prenda ${idx + 1}`}
                  />
                ))}
              </div>
            )}

            <div className="mt-8 text-center">
              <Link
                href="/catalogo"
                className="inline-flex items-center space-x-2 bg-white border border-[#437579] text-[#437579] hover:bg-[#E2ECEC] font-bold text-xs px-6 py-3.5 rounded-2xl shadow-sm transition-all"
              >
                <span>Explorar Todas las Categorías y Filtros →</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonios y Garantía de Calidad */}
        <TestimonialsSection />
      </main>

      {/* Pie de Página */}
      <Footer user={user} />

      {/* Modal de Detalle de Producto */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Lista de Encargos Lateral */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* Modal de Autenticación */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

    </div>
  );
}
