import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const defaultAppUrl = process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://confecciones-a-crochet-imidi-one.vercel.app');

export const metadata: Metadata = {
  metadataBase: new URL(defaultAppUrl),
  title: 'Confecciones a Crochet Imidi | Blusas, Vestidos & Arreglos a Medida',
  description:
    'Tienda online oficial de Confecciones Imidi. Venta de blusas, vestidos, diademas, gorros y tapetes hechos a mano a crochet, y servicio profesional de costura y arreglos a tu medida en Perú.',
  keywords: [
    'crochet',
    'confecciones a crochet',
    'blusas a crochet',
    'vestidos a crochet',
    'tapetes tejidos',
    'arreglos de costura',
    'confecciones imidi',
    'ropa hecha a mano peru',
    'jaen peru',
  ],
  authors: [{ name: 'Confecciones a Crochet Imidi' }],
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
  openGraph: {
    title: 'Confecciones a Crochet Imidi | Blusas, Vestidos & Arreglos a Medida',
    description: 'Tienda oficial de Confecciones Imidi. Tejidos hechos a mano a crochet y servicios de costura a tu medida.',
    url: defaultAppUrl,
    siteName: 'Confecciones Imidi',
    images: [
      {
        url: '/img/logo.png',
        width: 1200,
        height: 630,
        alt: 'Confecciones a Crochet Imidi Logo',
      },
    ],
    locale: 'es_PE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Confecciones a Crochet Imidi',
    description: 'Blusas, vestidos y arreglos de costura a medida hechos a mano.',
    images: ['/img/logo.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable} scroll-smooth`}>
      <body className="font-sans antialiased bg-[#F8F5EF] text-[#213B3E]">
        {children}
      </body>
    </html>
  );
}
