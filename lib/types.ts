export type CategoryType = 'todas' | 'blusas' | 'vestidos' | 'tapetes' | 'diadema' | 'gorros';

export type YarnType = 'Algodón' | 'Silvia' | 'Tren' | 'Fino Cable' | 'Quesito' | 'Pavino en Cono' | 'Nylon';

export const YARN_OPTIONS: YarnType[] = [
  'Algodón',
  'Silvia',
  'Tren',
  'Fino Cable',
  'Quesito',
  'Pavino en Cono',
  'Nylon',
];

export const COLOR_OPTIONS = [
  'Turquesa Imidi (Original)',
  'Rosa Pastel / Empolvado',
  'Marrón Canela / Miel',
  'Blanco Nieve / Marfil',
  'Negro Ébano',
  'Amarillo Mostaza',
  'Lila / Morado',
  'Verde Esmeralda / Olivo',
  'Rojo Pasión',
  'Beige / Arena',
  'Azul Rey',
  'Combinado Personalizado (Todos los colores)'
];

export interface UserAccount {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'cliente';
  createdAt?: string;
}

export interface Product {
  id: string;
  name: string;
  category: CategoryType;
  price: number;
  description: string;
  details: string[];
  colors: string[];
  yarnTypes?: YarnType[];
  sizes: string[];
  imageUrl: string;
  popular?: boolean;
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  selectedYarn?: string;
  customNotes?: string;
}

export interface CustomOrderRequest {
  fullName: string;
  phone: string;
  serviceType: 'prenda_medida' | 'arreglo_costura' | 'diseno_personalizado';
  garmentType: string;
  city?: string;
  measurements?: string;
  selectedYarn?: string;
  selectedColor?: string;
  details: string;
}

export interface CustomOrderRow {
  id?: string;
  created_at?: string;
  full_name: string;
  phone: string;
  service_type: string;
  garment_type: string;
  city?: string;
  measurements?: string;
  details: string;
}
