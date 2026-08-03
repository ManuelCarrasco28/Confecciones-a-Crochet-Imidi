'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Scissors,
  Plus,
  Search,
  MessageCircle,
  Edit,
  Trash2,
  ArrowLeft,
  X,
  ShieldCheck,
  Users,
  UserCheck,
  ExternalLink,
  Image as ImageIcon,
  Check,
  FolderTree,
  Sun,
  Moon,
  Upload,
  Store,
  Save,
  RotateCcw,
} from 'lucide-react';
import { Product, YARN_OPTIONS, COLOR_OPTIONS, CategoryType, UserAccount, CustomOrderRow } from '@/lib/types';
import { INITIAL_PRODUCTS } from '@/lib/mockData';
import { formatCurrency } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

export default function AdminPage() {
  const router = useRouter();

  // Tema: Inicia SIEMPRE en Modo Claro (Blanco) por defecto
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Validación de Autenticación
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'productos' | 'categorias' | 'pedidos' | 'solicitudes' | 'clientes' | 'usuarios' | 'config'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter] = useState<string>('todas');

  const [categories, setCategories] = useState([
    { id: 'blusas', name: 'Blusas', description: 'Blusas caladas, tops y pecheras a crochet' },
    { id: 'vestidos', name: 'Vestidos', description: 'Vestidos de fiesta, playa y salidas' },
    { id: 'tapetes', name: 'Tapetes', description: 'Centros de mesa, caminos y tapetería' },
    { id: 'diadema', name: 'Diademas', description: 'Vinchas y accesorios para el cabello' },
    { id: 'gorros', name: 'Gorros', description: 'Boinas y gorros boho abrigadores' },
  ]);

  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({
    name: '',
    category: 'blusas',
    price: undefined,
    description: '',
    details: ['Tejido a mano', 'Algodón peruano'],
    colors: COLOR_OPTIONS,
    sizes: ['S', 'M', 'L'],
    imageUrl: '',
    inStock: true,
  });

  const [systemUsers, setSystemUsers] = useState<UserAccount[]>([]);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [customRequests, setCustomRequests] = useState<CustomOrderRow[]>([]);

  // Configuración del Módulo de Negocio
  const [businessConfig, setBusinessConfig] = useState(() => {
    const defaultConfig = {
      name: 'Confecciones a Crochet Imidi',
      phone: '935240485',
      email: 'josemanuelcarrascomillan@gmail.com',
      facebook: 'https://www.facebook.com/profile.php?id=100054925651425',
      address: 'Jaén, Perú',
      schedule: 'Lunes a Sábado: 8:00 am - 8:00 pm',
    };
    if (typeof window === 'undefined') return defaultConfig;
    try {
      const saved = localStorage.getItem('imidi_business_config');
      return saved ? JSON.parse(saved) : defaultConfig;
    } catch {
      return defaultConfig;
    }
  });
  const [configSuccess, setConfigSuccess] = useState(false);

  // Verificación de Autenticación
  useEffect(() => {
    async function verifyAdminAuth() {
      setCheckingAuth(true);
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const userEmail = session.user.email?.toLowerCase() || '';
          const userMetaRole = session.user.user_metadata?.role;
          
          const isUserAdmin = userEmail === 'josemanuelcarrascomillan@gmail.com' || userMetaRole === 'admin';

          if (isUserAdmin) {
            setIsAdmin(true);
            setCurrentUser({
              id: session.user.id,
              name: session.user.user_metadata?.full_name || userEmail.split('@')[0],
              email: userEmail,
              role: 'admin',
            });
          } else {
            setIsAdmin(false);
            router.replace('/');
          }
        } else {
          setIsAdmin(false);
          router.replace('/');
        }
      } catch {
        setIsAdmin(false);
        router.replace('/');
      } finally {
        setCheckingAuth(false);
      }
    }
    verifyAdminAuth();
  }, [router]);

  // Cargar datos reales
  useEffect(() => {
    if (!isAdmin) return;

    async function loadData() {
      const supabase = createClient();

      try {
        const { data: prodData } = await supabase.from('products').select('*');
        if (prodData && prodData.length > 0) {
          const mapped: Product[] = prodData.map((item: {
            id: string;
            name: string;
            category: CategoryType;
            price: number;
            description: string;
            details?: string[];
            colors?: string[];
            yarn_types?: typeof YARN_OPTIONS;
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
        // Ignorar fallos de red en modo offline
      }

      try {
        const { data: profileData } = await supabase.from('profiles').select('*');
        if (profileData && profileData.length > 0) {
          const mappedUsers: UserAccount[] = profileData.map((p: {
            id: string;
            full_name?: string;
            email: string;
            phone?: string;
            role?: 'admin' | 'cliente';
            created_at?: string;
          }) => ({
            id: p.id,
            name: p.full_name || p.email.split('@')[0],
            email: p.email,
            phone: p.phone,
            role: p.role || 'cliente',
            createdAt: p.created_at,
          }));
          setSystemUsers(mappedUsers);
        } else {
          setSystemUsers([
            {
              id: 'USR-001',
              name: 'Jose Manuel Carrasco Millan',
              email: 'josemanuelcarrascomillan@gmail.com',
              phone: '935240485',
              role: 'admin',
              createdAt: '2026-08-01',
            },
          ]);
        }
      } catch {
        // Ignorar fallos de lectura de perfiles
      }

      try {
        const { data: reqData } = await supabase.from('custom_requests').select('*').order('created_at', { ascending: false });
        if (reqData && reqData.length > 0) {
          setCustomRequests(reqData as CustomOrderRow[]);
        }
      } catch {
        // Ignorar errores de carga
      }
    }

    loadData();
  }, [isAdmin]);

  if (checkingAuth || !isAdmin) {
    return null;
  }

  const clientsList = systemUsers.filter((u) => u.role === 'cliente');

  const filteredProducts = products.filter((prod) => {
    const matchesSearch = prod.name.toLowerCase().includes(searchTerm.toLowerCase()) || prod.category.includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'todas' || prod.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct.name || currentProduct.price === undefined || currentProduct.price === null) return;

    const trimmedName = currentProduct.name.trim();
    if (trimmedName.length < 3) {
      alert('El nombre del producto debe tener al menos 3 caracteres.');
      return;
    }

    const priceNum = Number(currentProduct.price);
    if (isNaN(priceNum) || priceNum <= 0 || priceNum > 500) {
      alert('El precio debe ser un número válido en soles entre S/ 0.50 y S/ 500.00.');
      return;
    }

    const prodId = currentProduct.id || `prod-${Date.now()}`;
    const newProd: Product = {
      id: prodId,
      name: trimmedName,
      category: (currentProduct.category as CategoryType) || 'blusas',
      price: priceNum,
      description: currentProduct.description || 'Prenda hecha a mano.',
      details: currentProduct.details || ['Tejido a mano'],
      colors: COLOR_OPTIONS,
      sizes: ['S', 'M', 'L'],
      imageUrl: currentProduct.imageUrl || '/productos/466976345_1108162234357955_8056609349265798658_n.jpg',
      inStock: currentProduct.inStock ?? true,
    };

    try {
      const supabase = createClient();
      await supabase.from('products').upsert({
        id: newProd.id,
        name: newProd.name,
        category: newProd.category,
        price: newProd.price,
        description: newProd.description,
        details: newProd.details,
        colors: newProd.colors,
        yarn_types: YARN_OPTIONS,
        sizes: newProd.sizes,
        image_url: newProd.imageUrl,
        in_stock: newProd.inStock,
      });
    } catch {
      // Ignorar fallos de sincronización remota
    }

    if (currentProduct.id) {
      setProducts((prev) => prev.map((p) => (p.id === currentProduct.id ? newProd : p)));
    } else {
      setProducts((prev) => [newProd, ...prev]);
    }

    setIsEditingProduct(false);
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const supabase = createClient();
      await supabase.from('products').delete().eq('id', id);
    } catch {
      // Ignorar
    }
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleToggleStock = async (prod: Product) => {
    const updatedStock = !prod.inStock;
    try {
      const supabase = createClient();
      await supabase.from('products').update({ in_stock: updatedStock }).eq('id', prod.id);
    } catch {
      // Ignorar
    }
    setProducts((prev) => prev.map((p) => (p.id === prod.id ? { ...p, inStock: updatedStock } : p)));
  };

  // Guardar / Editar Categoría CRUD
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;

    if (editingCatId) {
      setCategories((prev) =>
        prev.map((c) => (c.id === editingCatId ? { ...c, name: newCatName, description: newCatDesc } : c))
      );
      setEditingCatId(null);
    } else {
      const slug = newCatName.toLowerCase().replace(/\s+/g, '_');
      setCategories((prev) => [
        ...prev,
        {
          id: slug,
          name: newCatName,
          description: newCatDesc || 'Categoría de productos a crochet',
        },
      ]);
    }

    setNewCatName('');
    setNewCatDesc('');
  };

  const handleStartEditCategory = (cat: { id: string; name: string; description: string }) => {
    setEditingCatId(cat.id);
    setNewCatName(cat.name);
    setNewCatDesc(cat.description);
  };

  const handleCancelEditCategory = () => {
    setEditingCatId(null);
    setNewCatName('');
    setNewCatDesc('');
  };

  const handleDeleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const handleToggleUserRole = async (userId?: string) => {
    if (!userId) return;
    const targetUser = systemUsers.find((u) => u.id === userId);
    if (!targetUser || targetUser.email === 'josemanuelcarrascomillan@gmail.com') return;

    const newRole = targetUser.role === 'admin' ? 'cliente' : 'admin';

    try {
      const supabase = createClient();
      await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
    } catch {
      // Ignorar
    }

    setSystemUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
  };

  // Editar y Eliminar Usuarios / Clientes
  const handleDeleteUser = async (userId?: string) => {
    if (!userId) return;

    try {
      const supabase = createClient();
      await supabase.from('profiles').delete().eq('id', userId);
    } catch {
      // Ignorar
    }

    setSystemUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const handleDeleteCustomRequest = async (reqId?: string) => {
    if (!reqId) return;
    try {
      const supabase = createClient();
      await supabase.from('custom_requests').delete().eq('id', reqId);
    } catch {
      // Ignorar
    }
    setCustomRequests((prev) => prev.filter((r) => r.id !== reqId));
  };

  const handleSaveEditedUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const supabase = createClient();
      await supabase.from('profiles').update({
        full_name: editingUser.name,
        email: editingUser.email,
        phone: editingUser.phone,
      }).eq('id', editingUser.id);
    } catch {
      // Ignorar
    }

    setSystemUsers((prev) =>
      prev.map((u) => (u.id === editingUser.id ? editingUser : u))
    );
    setEditingUser(null);
  };

  // Guardar Módulo de Negocio
  const handleSaveBusinessConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('imidi_business_config', JSON.stringify(businessConfig));
      const supabase = createClient();
      await supabase.from('store_settings').upsert({
        id: 'default',
        name: businessConfig.name,
        phone: businessConfig.phone,
        email: businessConfig.email,
        facebook_url: businessConfig.facebook,
        address: businessConfig.address,
        schedule: businessConfig.schedule,
      });
    } catch {
      // Ignorar
    }

    setConfigSuccess(true);
    setTimeout(() => setConfigSuccess(false), 3000);
  };

  // Restablecer/Cancelar Formulario de Negocio
  const handleResetBusinessConfig = () => {
    try {
      const saved = localStorage.getItem('imidi_business_config');
      if (saved) {
        setBusinessConfig(JSON.parse(saved));
      } else {
        setBusinessConfig({
          name: 'Confecciones a Crochet Imidi',
          phone: '935240485',
          email: 'josemanuelcarrascomillan@gmail.com',
          facebook: 'https://www.facebook.com/profile.php?id=100054925651425',
          address: 'Jaén, Perú',
          schedule: 'Lunes a Sábado: 8:00 am - 8:00 pm',
        });
      }
    } catch {
      // Ignorar
    }
  };

  // Clases dinámicas de Alto Contraste para Modo Claro y Modo Oscuro
  const isDark = theme === 'dark';
  const pageBg = isDark ? 'bg-slate-950 text-slate-100' : 'bg-[#F4F1EA] text-[#162C2E]';
  const sidebarBg = isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-[#B2CFCF]';
  const cardBg = isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-[#B2CFCF] shadow-sm';
  const headerBg = isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white/95 border-[#B2CFCF] shadow-sm';
  
  // Inputs y Textos de Alto Contraste en Ambos Modos
  const inputBg = isDark
    ? 'bg-slate-950 border-slate-700 text-white font-bold focus:border-[#437579]'
    : 'bg-white border-[#B2CFCF] text-[#112325] font-bold focus:border-[#214347] shadow-sm';
  const subText = isDark ? 'text-slate-300' : 'text-[#2D4D51] font-semibold';
  const floatingLabel = isDark
    ? 'text-[#6BB3B8] peer-placeholder-shown:text-slate-400 peer-focus:text-[#6BB3B8] font-bold'
    : 'text-[#214347] peer-placeholder-shown:text-[#38595D] peer-focus:text-[#214347] font-extrabold';
  const tableHeaderBg = isDark ? 'bg-slate-950 text-slate-300' : 'bg-[#DDE8E8] text-[#162C2E] font-extrabold';

  return (
    <div className={`min-h-screen ${pageBg} flex flex-col font-sans transition-colors duration-200 selection:bg-[#437579] selection:text-white`}>
      
      <div className="flex flex-1 min-h-screen overflow-hidden">
        
        {/* Sidebar Lateral Fijo */}
        <aside className={`w-64 ${sidebarBg} border-r flex flex-col justify-between p-4 shrink-0 hidden md:flex transition-colors`}>
          <div className="space-y-6">
            
            <div className="flex items-center space-x-3 px-2 py-1">
              <div className="w-10 h-10 rounded-full bg-white p-0.5 border border-[#437579] overflow-hidden shrink-0 shadow-md">
                <img src="/img/logo.png" alt="Logo Imidi" className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <h3 className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-[#162C2E]'}`}>Confecciones Imidi</h3>
                <span className="text-[10px] text-[#437579] font-bold block truncate">{currentUser?.email}</span>
              </div>
            </div>

            <nav className="space-y-1">
              <span className={`px-3 text-[10px] font-extrabold uppercase tracking-wider block mb-2 ${subText}`}>
                VENTAS & MÉTRICAS
              </span>

              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-[#437579] text-white shadow-md'
                    : isDark ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'text-[#2D4D51] hover:bg-[#DDE8E8] hover:text-[#162C2E]'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-emerald-500" />
                <span>Dashboard Principal</span>
              </button>

              <button
                onClick={() => setActiveTab('pedidos')}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'pedidos'
                    ? 'bg-[#437579] text-white shadow-md'
                    : isDark ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'text-[#2D4D51] hover:bg-[#DDE8E8] hover:text-[#162C2E]'
                }`}
              >
                <ShoppingBag className="w-4 h-4 text-sky-500" />
                <span>Pedidos WhatsApp</span>
              </button>

              <span className={`px-3 text-[10px] font-extrabold uppercase tracking-wider block pt-4 mb-2 ${subText}`}>
                INVENTARIO & CATÁLOGO
              </span>

              <button
                onClick={() => setActiveTab('productos')}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'productos'
                    ? 'bg-[#437579] text-white shadow-md'
                    : isDark ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'text-[#2D4D51] hover:bg-[#DDE8E8] hover:text-[#162C2E]'
                }`}
              >
                <Package className="w-4 h-4 text-amber-500" />
                <span>Productos ({products.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('categorias')}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'categorias'
                    ? 'bg-[#437579] text-white shadow-md'
                    : isDark ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'text-[#2D4D51] hover:bg-[#DDE8E8] hover:text-[#162C2E]'
                }`}
              >
                <FolderTree className="w-4 h-4 text-indigo-500" />
                <span>Gestión de Categorías</span>
              </button>

              <button
                onClick={() => setActiveTab('solicitudes')}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'solicitudes'
                    ? 'bg-[#437579] text-white shadow-md'
                    : isDark ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'text-[#2D4D51] hover:bg-[#DDE8E8] hover:text-[#162C2E]'
                }`}
              >
                <Scissors className="w-4 h-4 text-[#D97B84]" />
                <span>Solicitudes a Medida ({customRequests.length})</span>
              </button>

              <span className={`px-3 text-[10px] font-extrabold uppercase tracking-wider block pt-4 mb-2 ${subText}`}>
                ADMINISTRACIÓN & CONFIG
              </span>

              <button
                onClick={() => setActiveTab('config')}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'config'
                    ? 'bg-[#437579] text-white shadow-md'
                    : isDark ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'text-[#2D4D51] hover:bg-[#DDE8E8] hover:text-[#162C2E]'
                }`}
              >
                <Store className="w-4 h-4 text-indigo-600" />
                <span>Módulo de Negocio</span>
              </button>

              <button
                onClick={() => setActiveTab('clientes')}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'clientes'
                    ? 'bg-[#437579] text-white shadow-md'
                    : isDark ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'text-[#2D4D51] hover:bg-[#DDE8E8] hover:text-[#162C2E]'
                }`}
              >
                <Users className="w-4 h-4 text-teal-500" />
                <span>Gestión de Clientes ({clientsList.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('usuarios')}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'usuarios'
                    ? 'bg-[#437579] text-white shadow-md'
                    : isDark ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'text-[#2D4D51] hover:bg-[#DDE8E8] hover:text-[#162C2E]'
                }`}
              >
                <UserCheck className="w-4 h-4 text-[#D89B53]" />
                <span>Gestión de Usuarios</span>
              </button>
            </nav>
          </div>

          <div className="pt-4 border-t border-slate-800/20 text-[11px] space-y-2">
            <Link
              href="/"
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl font-bold transition-all ${
                isDark ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-[#DDE8E8] hover:bg-[#B2CFCF] text-[#162C2E]'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a la Tienda</span>
            </Link>
          </div>
        </aside>

        {/* Área Principal */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          
          <header className={`h-16 border-b px-6 flex items-center justify-between ${headerBg} shrink-0 transition-colors`}>
            <div className="flex items-center space-x-3">
              <h1 className="text-base font-bold flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <span className={isDark ? 'text-white' : 'text-[#162C2E]'}>
                  {activeTab === 'dashboard' && 'Dashboard Principal / Ventas'}
                  {activeTab === 'productos' && 'Gestión de Productos & Catálogo'}
                  {activeTab === 'categorias' && 'Gestión de Categorías de Tejidos'}
                  {activeTab === 'pedidos' && 'Pedidos Web & WhatsApp'}
                  {activeTab === 'solicitudes' && 'Solicitudes de Costura a Medida'}
                  {activeTab === 'config' && 'Módulo de Negocio (Teléfono, Nombre y Correo)'}
                  {activeTab === 'clientes' && 'Gestión de Clientes Registrados'}
                  {activeTab === 'usuarios' && 'Gestión de Usuarios & Roles de Acceso'}
                </span>
              </h1>
            </div>

            <div className="flex items-center space-x-3">
              
              {/* Botón Switch Modo Claro / Modo Oscuro */}
              <button
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-sm ${
                  isDark
                    ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700'
                    : 'bg-white border-[#B2CFCF] text-indigo-700 hover:bg-[#DDE8E8]'
                }`}
                title={isDark ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
              >
                {isDark ? (
                  <>
                    <Sun className="w-4 h-4 text-amber-400" />
                    <span className="hidden sm:inline text-slate-200">Modo Claro ☀️</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-indigo-600" />
                    <span className="hidden sm:inline text-[#162C2E]">Modo Oscuro 🌙</span>
                  </>
                )}
              </button>

              {activeTab === 'productos' && (
                <button
                  onClick={() => {
                    setCurrentProduct({
                      name: '',
                      category: 'blusas',
                      price: undefined,
                      description: '',
                      details: ['Tejido a mano'],
                      colors: COLOR_OPTIONS,
                      sizes: ['S', 'M', 'L'],
                      imageUrl: '',
                      inStock: true,
                    });
                    setIsEditingProduct(true);
                  }}
                  className="inline-flex items-center space-x-1.5 bg-[#437579] hover:bg-[#335C60] text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nuevo Producto</span>
                </button>
              )}

              <Link
                href="/"
                className={`inline-flex items-center space-x-1.5 text-xs px-3.5 py-2 rounded-xl border font-bold transition-all ${
                  isDark ? 'text-slate-300 hover:text-white bg-slate-800 border-slate-700' : 'text-[#162C2E] hover:text-[#437579] bg-white border-[#B2CFCF]'
                }`}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Ver Sitio Web</span>
              </Link>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* 1. DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className={`${cardBg} p-5 rounded-2xl flex items-center justify-between shadow-sm`}>
                    <div>
                      <span className={`text-xs uppercase tracking-wider ${subText}`}>Productos en BD</span>
                      <h3 className="text-2xl font-bold mt-1">{products.length}</h3>
                      <p className="text-[11px] text-emerald-600 mt-1 font-extrabold">Sincronizados en Supabase</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center">
                      <Package className="w-6 h-6" />
                    </div>
                  </div>

                  <div className={`${cardBg} p-5 rounded-2xl flex items-center justify-between shadow-sm`}>
                    <div>
                      <span className={`text-xs uppercase tracking-wider ${subText}`}>Solicitudes a Medida</span>
                      <h3 className="text-2xl font-bold mt-1">{customRequests.length}</h3>
                      <p className="text-[11px] text-sky-600 mt-1 font-extrabold">Cotizaciones por WhatsApp</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-500 border border-sky-500/20 flex items-center justify-center">
                      <Scissors className="w-6 h-6" />
                    </div>
                  </div>

                  <div className={`${cardBg} p-5 rounded-2xl flex items-center justify-between shadow-sm`}>
                    <div>
                      <span className={`text-xs uppercase tracking-wider ${subText}`}>Categorías</span>
                      <h3 className="text-2xl font-bold mt-1">{categories.length}</h3>
                      <p className="text-[11px] text-amber-600 mt-1 font-extrabold">Categorías de confección</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center">
                      <FolderTree className="w-6 h-6" />
                    </div>
                  </div>

                  <div className={`${cardBg} p-5 rounded-2xl flex items-center justify-between shadow-sm`}>
                    <div>
                      <span className={`text-xs uppercase tracking-wider ${subText}`}>Usuarios Registrados</span>
                      <h3 className="text-2xl font-bold mt-1">{systemUsers.length}</h3>
                      <p className="text-[11px] text-teal-600 mt-1 font-extrabold">Perfiles en Supabase Auth</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-500 border border-teal-500/20 flex items-center justify-center">
                      <Users className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. PRODUCTOS */}
            {activeTab === 'productos' && (
              <div className="space-y-4">
                <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${cardBg} p-4 rounded-2xl`}>
                  <div className="relative w-full sm:w-80">
                    <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${subText}`} />
                    <input
                      type="text"
                      placeholder="Buscar producto por nombre..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`w-full ${inputBg} rounded-xl pl-10 pr-4 py-2 text-xs placeholder-slate-400 focus:outline-none focus:border-[#437579]`}
                    />
                  </div>
                </div>

                <div className={`${cardBg} rounded-2xl overflow-hidden shadow-sm`}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className={`${tableHeaderBg} uppercase tracking-wider border-b border-slate-800/20 text-[10px]`}>
                        <tr>
                          <th className="px-4 py-3">Imagen</th>
                          <th className="px-4 py-3">Nombre del Producto</th>
                          <th className="px-4 py-3">Categoría</th>
                          <th className="px-4 py-3">Precio</th>
                          <th className="px-4 py-3">Estado Stock</th>
                          <th className="px-4 py-3 text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/20">
                        {filteredProducts.map((prod) => (
                          <tr key={prod.id} className="hover:bg-[#437579]/10 transition-colors">
                            <td className="px-4 py-3">
                              <div className="w-12 h-12 rounded-xl bg-slate-800/20 overflow-hidden border border-[#C4D8D9]/40 shrink-0">
                                <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover" />
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="font-bold block">{prod.name}</span>
                              <span className={`text-[10px] ${subText} line-clamp-1`}>{prod.description}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold capitalize ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-[#DDE8E8] text-[#162C2E]'}`}>
                                {prod.category}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-extrabold text-emerald-600">
                              {formatCurrency(prod.price)}
                            </td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => handleToggleStock(prod)}
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                                  prod.inStock
                                    ? 'bg-emerald-500/20 text-emerald-600 border border-emerald-500/30'
                                    : 'bg-rose-500/20 text-rose-600 border border-rose-500/30'
                                }`}
                              >
                                {prod.inStock ? 'Disponible' : 'Agotado'}
                              </button>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end space-x-1">
                                <button
                                  onClick={() => {
                                    setCurrentProduct(prod);
                                    setIsEditingProduct(true);
                                  }}
                                  className="p-1.5 bg-sky-600/20 text-sky-600 hover:bg-sky-600 hover:text-white rounded-lg transition-colors"
                                  title="Editar producto"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(prod.id)}
                                  className="p-1.5 bg-rose-600/20 text-rose-600 hover:bg-rose-600 hover:text-white rounded-lg transition-colors"
                                  title="Eliminar producto"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 3. CATEGORÍAS EN TABLA DE CRUD */}
            {activeTab === 'categorias' && (
              <div className="space-y-6">
                
                {/* Formulario de Agregar / Editar Categoría con Floating Labels de Alto Contraste */}
                <div className={`${cardBg} p-6 rounded-2xl space-y-4`}>
                  <h3 className="text-sm font-bold flex items-center justify-between border-b border-slate-800/20 pb-3">
                    <span className="flex items-center gap-2">
                      <FolderTree className="w-4 h-4 text-indigo-500" />
                      <span>{editingCatId ? 'Editar Categoría' : 'Agregar Nueva Categoría al Catálogo'}</span>
                    </span>
                    {editingCatId && (
                      <button
                        onClick={handleCancelEditCategory}
                        className="text-xs text-rose-500 font-bold hover:underline"
                      >
                        Cancelar Edición
                      </button>
                    )}
                  </h3>

                  <form onSubmit={handleSaveCategory} className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
                    <div className="sm:col-span-5 relative">
                      <input
                        type="text"
                        id="catName"
                        required
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        placeholder=" "
                        className={`peer w-full ${inputBg} rounded-2xl px-4 pt-5 pb-2 text-xs transition-all shadow-sm`}
                      />
                      <label
                        htmlFor="catName"
                        className={`absolute left-4 top-2 text-[10px] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs peer-focus:top-1.5 peer-focus:text-[10px] pointer-events-none ${floatingLabel}`}
                      >
                        Nombre de la Categoría
                      </label>
                    </div>

                    <div className="sm:col-span-5 relative">
                      <input
                        type="text"
                        id="catDesc"
                        value={newCatDesc}
                        onChange={(e) => setNewCatDesc(e.target.value)}
                        placeholder=" "
                        className={`peer w-full ${inputBg} rounded-2xl px-4 pt-5 pb-2 text-xs transition-all shadow-sm`}
                      />
                      <label
                        htmlFor="catDesc"
                        className={`absolute left-4 top-2 text-[10px] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs peer-focus:top-1.5 peer-focus:text-[10px] pointer-events-none ${floatingLabel}`}
                      >
                        Descripción corta (Opcional)
                      </label>
                    </div>

                    <div className="sm:col-span-2 flex items-end">
                      <button
                        type="submit"
                        className="w-full bg-[#437579] hover:bg-[#335C60] text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-1 shadow-md transition-all uppercase tracking-wider text-xs"
                      >
                        {editingCatId ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        <span>{editingCatId ? 'Guardar' : 'Crear'}</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* Tabla de Listado CRUD de Categorías */}
                <div className={`${cardBg} rounded-2xl overflow-hidden shadow-sm`}>
                  <div className="px-6 py-4 border-b border-slate-800/20 flex items-center justify-between">
                    <h3 className="text-sm font-bold">Listado de Categorías ({categories.length})</h3>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className={`${tableHeaderBg} uppercase tracking-wider border-b border-slate-800/20 text-[10px]`}>
                        <tr>
                          <th className="px-6 py-3">Nombre de la Categoría</th>
                          <th className="px-6 py-3">Descripción</th>
                          <th className="px-6 py-3">Productos Vinculados</th>
                          <th className="px-6 py-3 text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/20">
                        {categories.map((cat) => {
                          const count = products.filter((p) => p.category === cat.id).length;
                          return (
                            <tr key={cat.id} className="hover:bg-[#437579]/10 transition-colors">
                              <td className="px-6 py-4 font-bold text-sm">{cat.name}</td>
                              <td className="px-6 py-4">{cat.description}</td>
                              <td className="px-6 py-4">
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-600 border border-indigo-500/20">
                                  {count} productos
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end space-x-1">
                                  <button
                                    onClick={() => handleStartEditCategory(cat)}
                                    className="p-1.5 bg-sky-600/20 text-sky-600 hover:bg-sky-600 hover:text-white rounded-lg transition-colors"
                                    title="Editar categoría"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteCategory(cat.id)}
                                    className="p-1.5 bg-rose-600/20 text-rose-600 hover:bg-rose-600 hover:text-white rounded-lg transition-colors"
                                    title="Eliminar categoría"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* 4. SOLICITUDES DE COSTURA REALES CON ACCIONES COMPLETAS */}
            {activeTab === 'solicitudes' && (
              <div className="space-y-4">
                <div className={`${cardBg} rounded-2xl p-6 space-y-4`}>
                  <div className="flex items-center justify-between border-b border-slate-800/20 pb-3">
                    <h3 className="text-sm font-bold">Solicitudes de Confección & Costura $ en Supabase</h3>
                    <span className="text-xs text-[#437579] font-bold">{customRequests.length} solicitudes</span>
                  </div>

                  {customRequests.length === 0 ? (
                    <p className={`text-xs ${subText} italic`}>No hay solicitudes registradas por el momento.</p>
                  ) : (
                    customRequests.map((req) => (
                      <div key={req.id} className={`${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-[#B2CFCF]'} p-4 rounded-xl border space-y-2.5`}>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-xs">{req.full_name} ({req.phone})</span>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] ${subText}`}>
                              {req.created_at ? new Date(req.created_at).toLocaleString('es-PE') : 'Reciente'}
                            </span>
                            <button
                              onClick={() => handleDeleteCustomRequest(req.id)}
                              className="p-1.5 bg-rose-600/20 text-rose-600 hover:bg-rose-600 hover:text-white rounded-lg transition-colors"
                              title="Eliminar solicitud de costura"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="text-xs">
                          <span className="text-[#D97B84] font-bold">{req.service_type}:</span> {req.garment_type} • Medidas: {req.measurements || 'A coordinar'}
                        </div>
                        <p className={`text-xs ${subText} ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-[#F4F1EA] border-[#B2CFCF]'} p-2.5 rounded-lg border`}>{req.details}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* 5. MÓDULO DE NEGOCIO COMPACTO (ALTO CONTRASDE EN MODO CLARO Y OSCURO) */}
            {activeTab === 'config' && (
              <div className="max-w-4xl mx-auto space-y-4">
                <form onSubmit={handleSaveBusinessConfig} className={`${cardBg} p-5 sm:p-6 rounded-3xl space-y-4 border shadow-md`}>
                  
                  {/* Header Compacto con Título e Indicador de Estado */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800/10">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-9 h-9 rounded-xl bg-[#437579]/15 text-[#214347] dark:text-[#6BB3B8] flex items-center justify-center shrink-0">
                        <Store className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className={`font-serif text-base font-extrabold ${isDark ? 'text-white' : 'text-[#162C2E]'}`}>
                          Módulo de Negocio & Datos Oficiales
                        </h3>
                        <p className={`text-[11px] ${subText}`}>
                          Configura el nombre del negocio, número de teléfono/WhatsApp, correo y redes sociales.
                        </p>
                      </div>
                    </div>

                    {configSuccess && (
                      <span className="bg-emerald-500/20 text-emerald-600 border border-emerald-500/30 px-3 py-1 rounded-full text-[11px] font-extrabold flex items-center gap-1 animate-in fade-in">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>¡Guardado!</span>
                      </span>
                    )}
                  </div>

                  {/* Grid de Campos Compactos con Floating Labels de Alto Contraste */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    
                    {/* 1. Nombre Oficial del Negocio */}
                    <div className="sm:col-span-2 relative">
                      <input
                        type="text"
                        id="bizName"
                        required
                        value={businessConfig.name}
                        onChange={(e) => setBusinessConfig({ ...businessConfig, name: e.target.value })}
                        placeholder=" "
                        className={`peer w-full ${inputBg} rounded-2xl px-4 pt-5 pb-2 text-xs transition-all shadow-sm`}
                      />
                      <label
                        htmlFor="bizName"
                        className={`absolute left-4 top-2 text-[10px] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs peer-focus:top-1.5 peer-focus:text-[10px] pointer-events-none ${floatingLabel}`}
                      >
                        🏢 Nombre Oficial del Negocio / Marca
                      </label>
                    </div>

                    {/* 2. Teléfono / WhatsApp Principal */}
                    <div className="relative">
                      <input
                        type="tel"
                        id="bizPhone"
                        required
                        value={businessConfig.phone}
                        onChange={(e) => setBusinessConfig({ ...businessConfig, phone: e.target.value })}
                        placeholder=" "
                        className={`peer w-full ${inputBg} rounded-2xl px-4 pt-5 pb-2 text-xs text-emerald-600 font-extrabold focus:outline-none transition-all shadow-sm`}
                      />
                      <label
                        htmlFor="bizPhone"
                        className={`absolute left-4 top-2 text-[10px] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs peer-focus:top-1.5 peer-focus:text-[10px] pointer-events-none ${floatingLabel}`}
                      >
                        📞 Teléfono / WhatsApp Principal (ej. 935240485)
                      </label>
                    </div>

                    {/* 3. Correo Electrónico de Contacto */}
                    <div className="relative">
                      <input
                        type="email"
                        id="bizEmail"
                        required
                        value={businessConfig.email}
                        onChange={(e) => setBusinessConfig({ ...businessConfig, email: e.target.value })}
                        placeholder=" "
                        className={`peer w-full ${inputBg} rounded-2xl px-4 pt-5 pb-2 text-xs transition-all shadow-sm`}
                      />
                      <label
                        htmlFor="bizEmail"
                        className={`absolute left-4 top-2 text-[10px] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs peer-focus:top-1.5 peer-focus:text-[10px] pointer-events-none ${floatingLabel}`}
                      >
                        ✉️ Correo Electrónico Oficial
                      </label>
                    </div>

                    {/* 4. URL de Facebook */}
                    <div className="sm:col-span-2 relative">
                      <input
                        type="url"
                        id="bizFacebook"
                        value={businessConfig.facebook}
                        onChange={(e) => setBusinessConfig({ ...businessConfig, facebook: e.target.value })}
                        placeholder=" "
                        className={`peer w-full ${inputBg} rounded-2xl px-4 pt-5 pb-2 text-xs transition-all shadow-sm`}
                      />
                      <label
                        htmlFor="bizFacebook"
                        className={`absolute left-4 top-2 text-[10px] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs peer-focus:top-1.5 peer-focus:text-[10px] pointer-events-none ${floatingLabel}`}
                      >
                        🌐 URL Perfil Oficial de Facebook
                      </label>
                    </div>

                    {/* 5. Ubicación del Taller */}
                    <div className="relative">
                      <input
                        type="text"
                        id="bizAddress"
                        value={businessConfig.address}
                        onChange={(e) => setBusinessConfig({ ...businessConfig, address: e.target.value })}
                        placeholder=" "
                        className={`peer w-full ${inputBg} rounded-2xl px-4 pt-5 pb-2 text-xs transition-all shadow-sm`}
                      />
                      <label
                        htmlFor="bizAddress"
                        className={`absolute left-4 top-2 text-[10px] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs peer-focus:top-1.5 peer-focus:text-[10px] pointer-events-none ${floatingLabel}`}
                      >
                        📍 Ciudad / Dirección del Taller
                      </label>
                    </div>

                    {/* 6. Horarios de Atención */}
                    <div className="relative">
                      <input
                        type="text"
                        id="bizSchedule"
                        value={businessConfig.schedule}
                        onChange={(e) => setBusinessConfig({ ...businessConfig, schedule: e.target.value })}
                        placeholder=" "
                        className={`peer w-full ${inputBg} rounded-2xl px-4 pt-5 pb-2 text-xs transition-all shadow-sm`}
                      />
                      <label
                        htmlFor="bizSchedule"
                        className={`absolute left-4 top-2 text-[10px] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs peer-focus:top-1.5 peer-focus:text-[10px] pointer-events-none ${floatingLabel}`}
                      >
                        ⏰ Horario de Atención
                      </label>
                    </div>

                  </div>

                  {/* Botones de Acción Inmediatamente Visibles */}
                  <div className="pt-3 border-t border-slate-800/10 flex items-center justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={handleResetBusinessConfig}
                      className="inline-flex items-center space-x-1.5 bg-white hover:bg-rose-50 text-rose-600 border border-rose-300 font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Deshacer / Cancelar</span>
                    </button>

                    <button
                      type="submit"
                      className="inline-flex items-center space-x-1.5 bg-[#437579] hover:bg-[#335C60] text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all uppercase tracking-wider"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Guardar Configuración</span>
                    </button>
                  </div>

                </form>
              </div>
            )}

            {/* 6. GESTIÓN DE CLIENTES CON ACCIONES COMPLETAS */}
            {activeTab === 'clientes' && (
              <div className="space-y-4">
                <div className={`${cardBg} rounded-2xl overflow-hidden shadow-sm`}>
                  <div className="px-6 py-4 border-b border-slate-800/20 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold">Gestión de Clientes Registrados</h3>
                      <p className={`text-xs ${subText}`}>Perfiles de clientes registrados en Supabase</p>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className={`${tableHeaderBg} uppercase tracking-wider border-b border-slate-800/20 text-[10px]`}>
                        <tr>
                          <th className="px-6 py-3">Cliente</th>
                          <th className="px-6 py-3">Teléfono / WhatsApp</th>
                          <th className="px-6 py-3">Correo Electrónico</th>
                          <th className="px-6 py-3">Rol</th>
                          <th className="px-6 py-3">Contacto</th>
                          <th className="px-6 py-3 text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/20">
                        {clientsList.map((client) => (
                          <tr key={client.id || client.email} className="hover:bg-[#437579]/10 transition-colors">
                            <td className="px-6 py-4 font-bold">{client.name}</td>
                            <td className="px-6 py-4 text-emerald-600 font-mono font-bold">{client.phone || '935240485'}</td>
                            <td className="px-6 py-4">{client.email}</td>
                            <td className="px-6 py-4">
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-600 border border-teal-500/30">
                                Cliente
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <a
                                href={`https://wa.me/51${client.phone || '935240485'}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 bg-emerald-600/20 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-lg transition-all inline-flex items-center gap-1 font-bold text-[11px]"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                <span>WhatsApp</span>
                              </a>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end space-x-1">
                                <button
                                  onClick={() => setEditingUser(client)}
                                  className="p-1.5 bg-sky-600/20 text-sky-600 hover:bg-sky-600 hover:text-white rounded-lg transition-colors"
                                  title="Editar cliente"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(client.id)}
                                  className="p-1.5 bg-rose-600/20 text-rose-600 hover:bg-rose-600 hover:text-white rounded-lg transition-colors"
                                  title="Eliminar cliente"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 7. GESTIÓN DE USUARIOS CON ACCIONES COMPLETAS */}
            {activeTab === 'usuarios' && (
              <div className="space-y-4">
                <div className={`${cardBg} rounded-2xl overflow-hidden shadow-sm`}>
                  <div className="px-6 py-4 border-b border-slate-800/20 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold">Gestión de Usuarios & Roles en Supabase</h3>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className={`${tableHeaderBg} uppercase tracking-wider border-b border-slate-800/20 text-[10px]`}>
                        <tr>
                          <th className="px-6 py-3">Nombre</th>
                          <th className="px-6 py-3">Correo Electrónico</th>
                          <th className="px-6 py-3">Rol Actual</th>
                          <th className="px-6 py-3">Acción de Rol</th>
                          <th className="px-6 py-3 text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/20">
                        {systemUsers.map((usr) => {
                          const isAdminUser = usr.email === 'josemanuelcarrascomillan@gmail.com';
                          return (
                            <tr key={usr.id || usr.email} className="hover:bg-[#437579]/10 transition-colors">
                              <td className="px-6 py-4 font-bold">{usr.name}</td>
                              <td className="px-6 py-4">{usr.email}</td>
                              <td className="px-6 py-4">
                                {usr.role === 'admin' ? (
                                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-600 border border-emerald-500/30 flex items-center gap-1 w-max">
                                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                    <span>Administrador</span>
                                  </span>
                                ) : (
                                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-800/20 text-slate-500 w-max block">
                                    Cliente
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                {isAdminUser ? (
                                  <span className="text-[10px] text-emerald-600 font-bold italic">
                                    Admin Principal
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => handleToggleUserRole(usr.id)}
                                    className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-all ${
                                      isDark ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-[#DDE8E8] hover:bg-[#B2CFCF] text-[#162C2E]'
                                    }`}
                                  >
                                    {usr.role === 'admin' ? 'Cambiar a Cliente' : 'Hacer Admin'}
                                  </button>
                                )}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end space-x-1">
                                  <button
                                    onClick={() => setEditingUser(usr)}
                                    className="p-1.5 bg-sky-600/20 text-sky-600 hover:bg-sky-600 hover:text-white rounded-lg transition-colors"
                                    title="Editar información de usuario"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteUser(usr.id)}
                                    className="p-1.5 bg-rose-600/20 text-rose-600 hover:bg-rose-600 hover:text-white rounded-lg transition-colors"
                                    title="Eliminar usuario"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

          </div>

        </main>

      </div>

      {/* Modal Editar Información de Usuario / Cliente con Floating Labels */}
      {editingUser && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`${isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-[#B2CFCF] text-[#162C2E]'} border rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl`}>
            
            <div className="flex items-center justify-between border-b border-slate-800/20 pb-3">
              <h3 className="font-bold text-base">Editar Información del Usuario</h3>
              <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-rose-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedUser} className="space-y-4 text-xs">
              
              <div className="relative">
                <input
                  type="text"
                  id="editUserName"
                  required
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  placeholder=" "
                  className={`peer w-full ${inputBg} rounded-2xl px-4 pt-5 pb-2 text-xs transition-all shadow-sm`}
                />
                <label
                  htmlFor="editUserName"
                  className={`absolute left-4 top-2 text-[10px] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs peer-focus:top-1.5 peer-focus:text-[10px] pointer-events-none ${floatingLabel}`}
                >
                  Nombre Completo
                </label>
              </div>

              <div className="relative">
                <input
                  type="email"
                  id="editUserEmail"
                  required
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  placeholder=" "
                  className={`peer w-full ${inputBg} rounded-2xl px-4 pt-5 pb-2 text-xs transition-all shadow-sm`}
                />
                <label
                  htmlFor="editUserEmail"
                  className={`absolute left-4 top-2 text-[10px] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs peer-focus:top-1.5 peer-focus:text-[10px] pointer-events-none ${floatingLabel}`}
                >
                  Correo Electrónico
                </label>
              </div>

              <div className="relative">
                <input
                  type="tel"
                  id="editUserPhone"
                  value={editingUser.phone || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                  placeholder=" "
                  className={`peer w-full ${inputBg} rounded-2xl px-4 pt-5 pb-2 text-xs transition-all shadow-sm`}
                />
                <label
                  htmlFor="editUserPhone"
                  className={`absolute left-4 top-2 text-[10px] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs peer-focus:top-1.5 peer-focus:text-[10px] pointer-events-none ${floatingLabel}`}
                >
                  Teléfono / WhatsApp
                </label>
              </div>

              <div className="pt-3 flex justify-end space-x-2 border-t border-slate-800/20">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className={`px-4 py-2 rounded-xl font-bold ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-[#DDE8E8] text-[#162C2E]'}`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#437579] hover:bg-[#335C60] text-white rounded-xl font-bold shadow-md"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Modal Crear/Editar Producto con Floating Labels */}
      {isEditingProduct && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`${isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-[#B2CFCF] text-[#162C2E]'} border rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto`}>
            
            <div className="flex items-center justify-between border-b border-slate-800/20 pb-3">
              <h3 className="font-bold text-base">
                {currentProduct.id ? 'Editar Producto' : 'Crear Nuevo Producto'}
              </h3>
              <button onClick={() => setIsEditingProduct(false)} className="text-slate-400 hover:text-rose-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              
              {/* Sección de Imagen */}
              <div className={`space-y-3 p-4 rounded-2xl border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-[#F4F1EA] border-[#B2CFCF]'}`}>
                <label className="block font-bold text-xs flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-[#437579]" />
                  <span>Imagen del Producto</span>
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-5">
                  <div className={`relative w-36 aspect-[4/5] rounded-2xl overflow-hidden border-2 border-dashed border-[#437579] shadow-md shrink-0 flex items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
                    {currentProduct.imageUrl ? (
                      <img
                        src={currentProduct.imageUrl}
                        alt="Vista previa"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-3 text-[#38595D] space-y-1">
                        <ImageIcon className="w-8 h-8 mx-auto text-[#437579]/60" />
                        <span className="text-[10px] font-bold block">Sin imagen</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-3 w-full">
                    <div>
                      <h4 className="font-bold text-xs">
                        {currentProduct.imageUrl ? 'Cambiar Imagen' : 'Subir Foto del Producto'}
                      </h4>
                      <p className={`text-[11px] ${subText} mt-0.5`}>
                        Selecciona una imagen desde tu dispositivo para el producto.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <label className="cursor-pointer inline-flex items-center space-x-2 bg-[#437579] hover:bg-[#335C60] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md">
                        <Upload className="w-4 h-4" />
                        <span>Subir Foto desde Equipo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setCurrentProduct({ ...currentProduct, imageUrl: reader.result as string });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <input
                  type="text"
                  id="prodName"
                  required
                  value={currentProduct.name || ''}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                  placeholder=" "
                  className={`peer w-full ${inputBg} rounded-2xl px-4 pt-5 pb-2 text-xs transition-all shadow-sm`}
                />
                <label
                  htmlFor="prodName"
                  className={`absolute left-4 top-2 text-[10px] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs peer-focus:top-1.5 peer-focus:text-[10px] pointer-events-none ${floatingLabel}`}
                >
                  Nombre del Producto
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-[11px]">Categoría</label>
                  <select
                    value={currentProduct.category || 'blusas'}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, category: e.target.value as CategoryType })}
                    className={`w-full ${inputBg} rounded-2xl px-3 py-2.5 text-xs capitalize focus:outline-none shadow-sm`}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <input
                    type="number"
                    id="prodPrice"
                    step="0.50"
                    required
                    value={currentProduct.price ?? ''}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, price: e.target.value ? parseFloat(e.target.value) : undefined })}
                    placeholder=" "
                    className={`peer w-full ${inputBg} rounded-2xl px-4 pt-5 pb-2 text-xs text-emerald-600 font-extrabold transition-all shadow-sm`}
                  />
                  <label
                    htmlFor="prodPrice"
                    className={`absolute left-4 top-2 text-[10px] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs peer-focus:top-1.5 peer-focus:text-[10px] pointer-events-none ${floatingLabel}`}
                  >
                    Precio (S/)
                  </label>
                </div>
              </div>

              <div className="relative">
                <textarea
                  id="prodDesc"
                  rows={2}
                  value={currentProduct.description || ''}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                  placeholder=" "
                  className={`peer w-full ${inputBg} rounded-2xl px-4 pt-6 pb-2 text-xs focus:outline-none transition-all shadow-sm resize-none`}
                />
                <label
                  htmlFor="prodDesc"
                  className={`absolute left-4 top-2 text-[10px] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-xs peer-focus:top-1.5 peer-focus:text-[10px] pointer-events-none ${floatingLabel}`}
                >
                  Descripción del Producto
                </label>
              </div>

              <div className="flex items-center space-x-4 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer font-bold">
                  <input
                    type="checkbox"
                    checked={currentProduct.inStock ?? true}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, inStock: e.target.checked })}
                    className="rounded text-[#437579]"
                  />
                  <span>En Stock / Disponible</span>
                </label>
              </div>

              <div className="pt-3 flex justify-end space-x-2 border-t border-slate-800/20">
                <button
                  type="button"
                  onClick={() => setIsEditingProduct(false)}
                  className={`px-4 py-2 rounded-xl font-bold ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-[#DDE8E8] text-[#162C2E]'}`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#437579] hover:bg-[#335C60] text-white rounded-xl font-bold shadow-md"
                >
                  {currentProduct.id ? 'Guardar Cambios' : 'Crear Producto'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
