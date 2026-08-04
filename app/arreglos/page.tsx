'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { CustomOrderSection } from '@/components/CustomOrderSection';

import { AuthModal } from '@/components/AuthModal';
import { Footer } from '@/components/Footer';
import { UserAccount } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';

export default function ArreglosPage() {
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
        cart={[]}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onSelectCategory={() => {}}
      />

      <main className="flex-1">
        <CustomOrderSection />
      </main>

      <Footer user={user} />

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
