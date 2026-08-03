# 🧵 Confecciones a Crochet Imidi - Tienda Web & Catálogo a Medida

Bienvenido al repositorio oficial de **Confecciones a Crochet Imidi**, una plataforma web moderna para la exhibición, cotización y gestión de prendas artesanales tejidas a mano y servicios de costura en Perú.

---

## 🌟 Características Principales

- **Catálogo Interactivo con Selección Múltiple:**
  - Filtrado dinámico por categorías: *Blusas, Vestidos, Tapetes, Diademas y Gorros*.
  - Rango de precios estricto en soles (S/ 0.50 – S/ 500.00).
  - Búsqueda en tiempo real por nombre o descripción.
  - Carrusel animado cíclico e infinito en la página de inicio.

- **Formulario de Cotización a Medida (`/arreglos` y Sección Principal):**
  - Selección de tipo de hilo (*Algodón, Silvia, Tren, Fino Cable, Quesito, Pavino en Cono, Nylon*).
  - Paleta de colores personalizados e ingreso de medidas.
  - **Validaciones para Perú:**
    - Celular peruano de 9 dígitos (comienza con `9`).
    - Nombres y apellidos completos (mínimo 2 palabras).
    - Selección de Ciudad / Distrito (ej. Jaén, Cajamarca, Lima).
    - Protección anti-spam (Honeypot) y Aceptación de Ley de Protección de Datos Personales (LPDP).

- **Integración Directa con WhatsApp:**
  - Generación automática de enlaces formativos a WhatsApp con el desglose del pedido o cotización.

- **Panel de Administración (`/admin`):**
  - **Gestión de Productos (CRUD):** Alta, edición, eliminación y control de stock en tiempo real.
  - **Gestión de Categorías:** Configuración de nombres y descripciones.
  - **Módulo de Negocio:** Configuración centralizada de nombre, WhatsApp, correo oficial, horarios y redes sociales.
  - **Gestión de Clientes y Usuarios:** Edición y asignación de roles (`admin` / `cliente`).
  - **Modo Claro ☀️ y Oscuro 🌙:** Interfaz adaptable de alto contraste.

---

## 🛠️ Tecnologías Utilizadas

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router & Turbopack)
- **Frontend:** React 19, TypeScript
- **Estilos:** TailwindCSS, Lucide Icons
- **Base de Datos & Auth:** Supabase Auth & Supabase Database
- **Calidad de Código:** ESLint (0 errores, 0 warnings)

---

## 🚀 Instalación y Ejecución Local

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/tienda-imidi.git
cd tienda-imidi
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno (`.env.local`)
Crea un archivo `.env.local` en la raíz del proyecto:
```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

### 4. Iniciar servidor de desarrollo
```bash
npm run dev
```
Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🧪 Comandos de Verificación

```bash
# Validar linteado de código (0 errores, 0 warnings)
npm run lint

# Probar compilación de producción
npm run build
```

---

## 📍 Datos de Contacto del Negocio

- **Marca:** Confecciones a Crochet Imidi
- **Ubicación:** Jaén, Cajamarca - Perú
- **WhatsApp:** +51 935 240 485
- **Correo:** `josemanuelcarrascomillan@gmail.com`
- **Facebook:** [Confecciones a Crochet Imidi](https://www.facebook.com/profile.php?id=100054925651425)

---

Developed with ❤️ for **Confecciones Imidi**.
