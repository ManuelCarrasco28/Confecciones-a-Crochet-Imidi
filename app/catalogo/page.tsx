'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Catalog } from '@/components/Catalog';
import { ProductModal } from '@/components/ProductModal';
import { CartDrawer } from '@/components/CartDrawer';
import { Footer } from '@/components/Footer';
import { AuthModal } from '@/components/AuthModal';

import { Product, CartItem, CategoryType, UserAccount, YarnType } from '@/lib/types';
import { INITIAL_PRODUCTS } from '@/lib/mockData';
import { createClient } from '@/lib/supabase/client';

function CatalogoContent() {
  const searchParams = useSearchParams();
  const catParam = (searchParams.get('cat') as CategoryType) || 'todas';

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>(catParam);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('imidi_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
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
        // Ignorar
      }
    }
    syncAuth();
  }, []);

  // Cargar Productos desde Supabase
  useEffect(() => {
    async function loadProducts() {
      try {
        const supabase = createClient();
        const { data } = await supabase.from('products').select('*');
        if (data && data.length > 0) {
          setProducts(
            data.map((item: {
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
            }))
          );
        }
      } catch {
        // Ignorar
      }
    }
    loadProducts();
  }, []);

  // Guardar Carrito
  useEffect(() => {
    try {
      localStorage.setItem('imidi_cart', JSON.stringify(cart));
    } catch {
      // Ignorar
    }
  }, [cart]);

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
      setCart((prev) => prev.filter((_, i) => i !== index));
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

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#213B3E] flex flex-col font-sans">
      <Navbar
        cart={cart}
        user={user}
        onOpenCart={() => setIsCartOpen(true)}
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

      <main className="flex-1">
        <Catalog
          products={products}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          onOpenModal={(prod) => setSelectedProduct(prod)}
          onAddToCart={handleAddToCart}
        />
      </main>

      <Footer user={user} />

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(u) => setUser(u)}
      />
    </div>
  );
}

export default function CatalogoPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs font-bold text-[#437579]">Cargando Catálogo Imidi...</div>}>
      <CatalogoContent />
    </Suspense>
  );
}
