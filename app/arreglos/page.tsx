'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { CustomOrderSection } from '@/components/CustomOrderSection';
import { CartDrawer } from '@/components/CartDrawer';
import { AuthModal } from '@/components/AuthModal';
import { Footer } from '@/components/Footer';
import { CartItem, UserAccount } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';

export default function ArreglosPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState<UserAccount | null>(null);

  useEffect(() => {
    async function syncAuth() {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const userEmail = session.user.email?.toLowerCase() || '';
          const userMetaRole = session.user.user_metadata?.role;
          setUser({
            id: session.user.id,
            name: session.user.user_metadata?.full_name || userEmail.split('@')[0],
            email: userEmail,
            role: userEmail === 'josemanuelcarrascomillan@gmail.com' || userMetaRole === 'admin' ? 'admin' : 'cliente',
          });
        }
      } catch {
        // Ignorar
      }
    }
    syncAuth();
  }, []);

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Ignorar
    }
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#213B3E] font-sans flex flex-col">
      <Navbar
        cart={cart}
        user={user}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onSelectCategory={() => {}}
      />

      <main className="flex-1">
        <CustomOrderSection />
      </main>

      <Footer user={user} />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={(index, newQty) => {
          if (newQty <= 0) {
            setCart((prev) => prev.filter((_, i) => i !== index));
          } else {
            setCart((prev) =>
              prev.map((item, i) => (i === index ? { ...item, quantity: newQty } : item))
            );
          }
        }}
        onRemoveItem={(index) => setCart((prev) => prev.filter((_, i) => i !== index))}
        onClearCart={() => setCart([])}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(account) => {
          setUser(account);
          setIsAuthOpen(false);
        }}
      />
    </div>
  );
}
