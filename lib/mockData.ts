import { Product, YARN_OPTIONS, COLOR_OPTIONS } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Blusa Turquesa con Volantes a Crochet',
    category: 'blusas',
    price: 85.00,
    description: 'Blusa artesanal insignia en color turquesa con cuello de vuelo en cascada calada. Confeccionada a mano en hilo de algodón o Silvia.',
    details: [
      'Cuello de volantes en relieve calado',
      'Disponible en hilos Algodón, Silvia, Tren y Fino Cable',
      'Textura suave y caída elegante',
      'Ajuste cómodo a medida'
    ],
    colors: COLOR_OPTIONS,
    yarnTypes: YARN_OPTIONS,
    sizes: ['S', 'M', 'L', 'A Medida'],
    imageUrl: '/productos/466976345_1108162234357955_8056609349265798658_n.jpg',
    popular: true,
    inStock: true
  },
  {
    id: '2',
    name: 'Top Crop Rosa con Cuello Halter',
    category: 'blusas',
    price: 65.00,
    description: 'Top corto en tono rosa pastel con cuello halter tejido en punto tupido y borde ondulado.',
    details: [
      'Cuello halter alto',
      'Punto tupido con sujeción suave',
      'Ideal para outfits de verano'
    ],
    colors: COLOR_OPTIONS,
    yarnTypes: YARN_OPTIONS,
    sizes: ['S', 'M', 'L'],
    imageUrl: '/productos/474202861_1153778982968459_1255305328670323708_n.jpg',
    popular: true,
    inStock: true
  },
  {
    id: '3',
    name: 'Top Calado Turquesa a Crochet',
    category: 'blusas',
    price: 75.00,
    description: 'Top/Blusa calada en color azul turquesa con abanicos florales en el pecho y cuerpo respirable.',
    details: [
      'Pechera con calados florales',
      'Tirantes delgados ajustables',
      'Fresco y ligero'
    ],
    colors: COLOR_OPTIONS,
    yarnTypes: YARN_OPTIONS,
    sizes: ['S', 'M', 'L', 'A Medida'],
    imageUrl: '/productos/474465229_1153778882968469_6310741674904733102_n.jpg',
    popular: true,
    inStock: true
  },
  {
    id: '4',
    name: 'Top Crop Rosa con Pechera de Flor',
    category: 'blusas',
    price: 70.00,
    description: 'Top crop artesanal rosa con mandálica floral calada en el escote y diseño espigado en el torso.',
    details: [
      'Pechera floral concéntrica',
      'Espalda descubierta con amarre',
      'Hilo súper suave antialérgico'
    ],
    colors: COLOR_OPTIONS,
    yarnTypes: YARN_OPTIONS,
    sizes: ['S', 'M', 'L'],
    imageUrl: '/productos/474551220_1153778769635147_5991210426331842737_n.jpg',
    popular: false,
    inStock: true
  },
  {
    id: '5',
    name: 'Blusa Blanca Calada de Hojas',
    category: 'blusas',
    price: 95.00,
    description: 'Blusa blanca de vestir con canesú de hojas caladas y mangas cortas caladas. Elegancia y finura artesanal.',
    details: [
      'Canesú tejido con patrón de hojas',
      'Manga corta acampanada',
      'Disponible en hilos mercerizados Fino Cable y Algodón'
    ],
    colors: COLOR_OPTIONS,
    yarnTypes: YARN_OPTIONS,
    sizes: ['S', 'M', 'L', 'A Medida'],
    imageUrl: '/productos/475130864_1159205962586915_4073072884325696942_n.jpg',
    popular: true,
    inStock: true
  },
  {
    id: '6',
    name: 'Tapete Circular Blanco con Flores Rosadas',
    category: 'tapetes',
    price: 55.00,
    description: 'Centro de mesa o tapete circular calado con apliques de flores rosas en relieve y hojas verdes.',
    details: [
      'Detalle de rosas y hojas 3D tejidas a mano',
      'Diámetro aproximado de 50cm',
      'Tejido con hilo Pavino en Cono o Algodón'
    ],
    colors: COLOR_OPTIONS,
    yarnTypes: YARN_OPTIONS,
    sizes: ['Estándar Hogar (50cm)', 'A Medida'],
    imageUrl: '/productos/475155230_1159206352586876_4142466618637073819_n.jpg',
    popular: true,
    inStock: true
  },
  {
    id: '7',
    name: 'Vestido Turquesa Calado a Crochet',
    category: 'vestidos',
    price: 150.00,
    description: 'Vestido corto/mediano turquesa con escote V y tirantes calados. Horma entallada que estiliza la silueta.',
    details: [
      'Confección 100% artesanal a medida',
      'Escote V pronunciado',
      'Fresco e ideal para verano'
    ],
    colors: COLOR_OPTIONS,
    yarnTypes: YARN_OPTIONS,
    sizes: ['S', 'M', 'L', 'A Medida'],
    imageUrl: '/productos/482028261_1188845939622917_4427961712584709951_n.jpg',
    popular: true,
    inStock: true
  },
  {
    id: '8',
    name: 'Camino de Mesa Amarillo Mostaza',
    category: 'tapetes',
    price: 70.00,
    description: 'Camino de mesa largo tejido en punto calado continuo para comedores y sofás.',
    details: [
      'Largo aproximado de 1.20m',
      'Hilo firme de alta durabilidad',
      'Aporta un toque cálido a tu hogar'
    ],
    colors: COLOR_OPTIONS,
    yarnTypes: YARN_OPTIONS,
    sizes: ['120cm x 40cm', 'A Medida'],
    imageUrl: '/productos/482030263_1188845752956269_5825016526503057427_n.jpg',
    popular: false,
    inStock: true
  },
  {
    id: '9',
    name: 'Blusa Blanca de Líneas Caladas',
    category: 'blusas',
    price: 85.00,
    description: 'Blusa blanca sin mangas con calado vertical en relieve y escote cuadrado. Frescura clásica.',
    details: [
      'Líneas verticales estilizadoras',
      'Sisas cómodas',
      'Tejido duradero'
    ],
    colors: COLOR_OPTIONS,
    yarnTypes: YARN_OPTIONS,
    sizes: ['S', 'M', 'L', 'A Medida'],
    imageUrl: '/productos/482059200_1188845942956250_6698469195623139113_n.jpg',
    popular: false,
    inStock: true
  },
  {
    id: '10',
    name: 'Top Crop Lila con Escote V',
    category: 'blusas',
    price: 68.00,
    description: 'Top corto en color lila/morado con copas en relieve y pretina ancha en calado de red.',
    details: [
      'Pretina calada elástica',
      'Copa estructurada a ganchillo',
      'Tirante al cuello'
    ],
    colors: COLOR_OPTIONS,
    yarnTypes: YARN_OPTIONS,
    sizes: ['S', 'M', 'L'],
    imageUrl: '/productos/482062459_1188849776289200_3890717960246344489_n.jpg',
    popular: true,
    inStock: true
  },
  {
    id: '11',
    name: 'Diadema / Vincha Tejida a Mano',
    category: 'diadema',
    price: 25.00,
    description: 'Diadema/vincha artesanal en tejido de crochet. Suave, no maltrata el cabello y se elabora en cualquier color de hilo.',
    details: [
      'Ajuste cómodo y acolchado',
      'Disponible en hilos Algodón, Silvia y Tren',
      'Todos los colores disponibles'
    ],
    colors: COLOR_OPTIONS,
    yarnTypes: YARN_OPTIONS,
    sizes: ['Estándar Adulto', 'Estándar Niña'],
    imageUrl: '/productos/482071155_1189777066196471_4989761167786084639_n.jpg',
    popular: true,
    inStock: true
  },
  {
    id: '12',
    name: 'Diadema Floral con Relieve a Crochet',
    category: 'diadema',
    price: 28.00,
    description: 'Diadema con aplique de tres flores tridimensionales a crochet. Femenina, coqueta y elegante.',
    details: [
      'Detalle floral en relieve 3D',
      'Tejido antialérgico de alta calidad'
    ],
    colors: COLOR_OPTIONS,
    yarnTypes: YARN_OPTIONS,
    sizes: ['Estándar'],
    imageUrl: '/productos/482226724_1189777062863138_8404013085174547437_n.jpg',
    popular: true,
    inStock: true
  },
  {
    id: '13',
    name: 'Gorro tejido a Crochet / Boina Artesanal',
    category: 'gorros',
    price: 45.00,
    description: 'Gorro cálido y abrigador tejido a crochet en hilo Silvia o Algodón. Diseño clásico y cómodo para temporadas frías.',
    details: [
      'Tejido abrigador de alta calidad',
      'Ajuste suave sin oprimir la cabeza',
      'Confección en todos los colores'
    ],
    colors: COLOR_OPTIONS,
    yarnTypes: YARN_OPTIONS,
    sizes: ['Estándar Adulto', 'Estándar Niña'],
    imageUrl: '/productos/483848578_1188845729622938_1274061094109419727_n.jpg',
    popular: true,
    inStock: true
  },
  {
    id: '14',
    name: 'Gorro Bohemio con Borlas a Crochet',
    category: 'gorros',
    price: 48.00,
    description: 'Gorro calado con diseño boho y apliques de borlas. Tejido con la suavidad del hilo Tren o Silvia.',
    details: [
      'Detalles de borlas trenzadas',
      'Textura suave y respirable'
    ],
    colors: COLOR_OPTIONS,
    yarnTypes: YARN_OPTIONS,
    sizes: ['Estándar'],
    imageUrl: '/productos/93614385_111439830535718_7767474051605331968_n.jpg',
    popular: false,
    inStock: true
  },
  {
    id: '15',
    name: 'Tapete Ovalado Azul, Verde y Gris',
    category: 'tapetes',
    price: 75.00,
    description: 'Hermoso tapete/alfombra ovalado a crochet tejido en combinación de azul, verde y gris con bordes festonados.',
    details: [
      'Tejido tupido y firme de gran resistencia',
      'Ideal para pisos, comedores o salas',
      'Confeccionado en hilo Pavino en Cono, Nylon o Algodón'
    ],
    colors: COLOR_OPTIONS,
    yarnTypes: YARN_OPTIONS,
    sizes: ['75cm x 45cm', 'A Medida'],
    imageUrl: '/productos/93620797_113273357019032_5170674470108528640_n.jpg',
    popular: true,
    inStock: true
  }
];

export const TESTIMONIALS = [
  {
    id: '1',
    name: 'María Fernanda G.',
    role: 'Cliente Frecuente',
    comment: 'La blusa turquesa confeccionada en hilo Silvia superó mis expectativas. Las puntadas son pulcras y la talla quedó exacta.',
    rating: 5,
    avatar: '/productos/466976345_1108162234357955_8056609349265798658_n.jpg'
  },
  {
    id: '2',
    name: 'Lucía Benítez',
    role: 'Cliente de Blusas',
    comment: 'Me encantó mi top calado en hilo de algodón. El envío por WhatsApp fue súper rápido y la atención muy amable.',
    rating: 5,
    avatar: '/productos/474202861_1153778982968459_1255305328670323708_n.jpg'
  },
  {
    id: '3',
    name: 'Carmen Rosa M.',
    role: 'Compradora de Tapetes',
    comment: 'El tapete ovalado en hilo Pavino en Cono quedó precioso en mi centro de mesa. El tejido es súper firme y los colores hermosos.',
    rating: 5,
    avatar: '/productos/93620797_113273357019032_5170674470108528640_n.jpg'
  }
];
