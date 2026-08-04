'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Catalog } from '@/components/Catalog';
import { ProductModal } from '@/components/ProductModal';
import { Footer } from '@/components/Footer';
import { AuthModal } from '@/components/AuthModal';
import { Toast } from '@/components/Toast';

import { getStoredCart, addToStoredCart } from '@/lib/cart';
import { getCachedProducts, setCachedProducts } from '@/lib/productsCache';
import { Product, CartItem, CategoryType, UserAccount, YarnType } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';
import { AlertCircle } from 'lucide-react';

const VALID_CATEGORIES: CategoryType[] = ['todas', 'blusas', 'vestidos', 'tapetes', 'diadema', 'gorros'];

export function CatalogoClientContent() {
  const searchParams = useSearchParams();
  const rawCat = searchParams.get('cat') as CategoryType;
  const validCat: CategoryType = VALID_CATEGORIES.includes(rawCat) ? rawCat : 'todas';

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [categorySelection, setCategorySelection] = useState({
    urlCategory: validCat,
    selectedCategory: validCat,
  });
  const selectedCategory = categorySelection.urlCategory === validCat
    ? categorySelection.selectedCategory
    : validCat;
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

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

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState<UserAccount | null>(null);

  // Sesión Auth
  useEffect(() => {
    const supabase = createClient();
    async function syncAuth() {
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
        // Ignorar errores no críticos de auth
      }
    }
    syncAuth();
  }, []);

  // Cargar Productos desde Supabase con manejo de errores y actualización de estado limpia
  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      setLoadError(null);
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from('products').select('*');
        
        if (error) {
          if (cancelled) return;
          setProducts(getCachedProducts());
          setLoadError('No se pudo sincronizar el catálogo con el servidor en tiempo real. Mostrando catálogo guardado.');
          return;
        }

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
            category: item.category as CategoryType,
            price: Number(item.price),
            description: item.description,
            details: item.details || [],
            colors: item.colors || [],
            yarnTypes: item.yarn_types || [],
            sizes: item.sizes || [],
            imageUrl: item.image_url,
            inStock: item.in_stock ?? true,
          }));

        if (cancelled) return;
        setProducts(mapped);
        setCachedProducts(mapped);
      } catch (err: unknown) {
        if (cancelled) return;
        const errObj = err as Error;
        setProducts(getCachedProducts());
        setLoadError(errObj?.message || 'Error de conexión con el catálogo.');
      } finally {
        if (!cancelled) setIsLoadingProducts(false);
      }
    }
    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  // Guardar Carrito
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

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#213B3E] flex flex-col font-sans">
      <Navbar
        cart={cart}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={async () => {
          try {
            const supabase = createClient();
            await supabase.auth.signOut();
          } catch {
            // Ignorar
          }
          setUser(null);
        }}
      />

      {loadError && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-800 text-xs font-semibold px-4 py-2 text-center flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{loadError}</span>
        </div>
      )}

      <main className="flex-1">
        {isLoadingProducts ? (
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8" aria-live="polite">
            <div className="max-w-2xl mx-auto text-center space-y-3 mb-6">
              <div className="h-5 w-56 max-w-full mx-auto rounded-full bg-[#E2ECEC] animate-pulse" />
              <div className="h-9 w-96 max-w-full mx-auto rounded-xl bg-[#D5E3E3] animate-pulse" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6 lg:ml-[25%]">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="overflow-hidden rounded-2xl border border-[#C4D8D9] bg-white">
                  <div className="aspect-[4/5] bg-[#E2ECEC] animate-pulse" />
                  <div className="p-3 sm:p-5 space-y-3">
                    <div className="h-4 rounded bg-[#D5E3E3] animate-pulse" />
                    <div className="h-3 w-2/3 rounded bg-[#E2ECEC] animate-pulse" />
                    <span className="sr-only">Cargando productos del catálogo</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <Catalog
            products={products}
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => setCategorySelection({
              urlCategory: validCat,
              selectedCategory: cat,
            })}
            onOpenModal={(prod) => setSelectedProduct(prod)}
            onAddToCart={handleAddToCart}
          />
        )}
      </main>

      <Footer user={user} />

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(u) => setUser(u)}
      />

      {/* Toast de Notificación */}
      <Toast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
}
