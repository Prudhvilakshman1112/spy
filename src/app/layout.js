import './globals.css';
import dynamic from 'next/dynamic';
import { CartProvider } from '@/context/CartContext';
import { AtmosphereProvider } from '@/context/AtmosphereContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppWidget from '@/components/WhatsAppWidget';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';

// Lazy-load heavy components — still SSR but code-split into separate chunks
const CartDrawer = dynamic(() => import('@/components/CartDrawer'));
const VizagIntro = dynamic(() => import('@/components/VizagIntro'));

export const metadata = {
  title: "Brand Two Brand's | Premium Men's Fashion Store - Vizag",
  description:
    "Vizag's premier men's lifestyle destination. Shop curated clothing, footwear & accessories at Brand Two Brand, Visakhapatnam's finest fashion store.",
  keywords: 'Brand Two Brand, Vizag fashion, men clothing Vizag, footwear Visakhapatnam, watches, accessories',
  openGraph: {
    title: "Brand Two Brand's | Fashion Store",
    description: "Premium Men's Lifestyle Store in Visakhapatnam",
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <CartProvider>
          <AtmosphereProvider>
            <VizagIntro />
            <Header />
            <CartDrawer />
            <main className="page-content">
              {children}
            </main>
            <Footer />
            <WhatsAppWidget />
            <SpeedInsights />
            <Analytics />
          </AtmosphereProvider>
        </CartProvider>
      </body>
    </html>
  );
}
