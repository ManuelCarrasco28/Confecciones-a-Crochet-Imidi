-- ==========================================================
-- ESTRUCTURA SQL Y POLÍTICAS RLS (SUPABASE) - TIENDA IMIDI
-- ==========================================================

-- 1. TABLA DE PERFILES DE USUARIO (profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'cliente' CHECK (role IN ('cliente', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activar RLS en profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles:
-- Lectura: los administradores pueden leer todos los perfiles; los usuarios pueden leer su propio perfil.
CREATE POLICY "Profiles read policy" ON public.profiles
  FOR SELECT USING (
    auth.uid() = id OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Modificación: los usuarios pueden modificar su propio perfil; admins pueden modificar roles.
CREATE POLICY "Profiles update policy" ON public.profiles
  FOR UPDATE USING (
    auth.uid() = id OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Eliminación: solo administradores pueden eliminar registros de perfiles.
CREATE POLICY "Profiles delete policy" ON public.profiles
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );


-- 2. TABLA DE PRODUCTOS (products)
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0.50),
  description TEXT NOT NULL,
  details TEXT[] DEFAULT '{}',
  colors TEXT[] DEFAULT '{}',
  yarn_types TEXT[] DEFAULT '{}',
  sizes TEXT[] DEFAULT '{}',
  image_url TEXT NOT NULL,
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activar RLS en products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Lectura pública para cualquier visitante
CREATE POLICY "Products public select" ON public.products
  FOR SELECT USING (true);

-- Inserción, actualización y eliminación exclusiva para admins
CREATE POLICY "Products admin insert" ON public.products
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Products admin update" ON public.products
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Products admin delete" ON public.products
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );


-- 3. TABLA DE SOLICITUDES A MEDIDA (custom_requests)
CREATE TABLE IF NOT EXISTS public.custom_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  service_type TEXT NOT NULL,
  selected_yarn TEXT,
  selected_color TEXT,
  city TEXT,
  measurements TEXT,
  details TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activar RLS en custom_requests
ALTER TABLE public.custom_requests ENABLE ROW LEVEL SECURITY;

-- Permitir crear solicitudes a cualquier visitante (anónimo o autenticado)
CREATE POLICY "Custom requests public insert" ON public.custom_requests
  FOR INSERT WITH CHECK (true);

-- Solo administradores pueden leer o eliminar solicitudes
CREATE POLICY "Custom requests admin select" ON public.custom_requests
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Custom requests admin delete" ON public.custom_requests
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );


-- 4. TABLA DE CATEGORÍAS (categories)
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories public select" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "Categories admin all" ON public.categories
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );


-- 5. TABLA DE CONFIGURACIÓN DEL NEGOCIO (business_config)
CREATE TABLE IF NOT EXISTS public.business_config (
  id INT PRIMARY KEY DEFAULT 1,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  facebook TEXT,
  address TEXT,
  schedule TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.business_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Business config public select" ON public.business_config
  FOR SELECT USING (true);

CREATE POLICY "Business config admin update" ON public.business_config
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
