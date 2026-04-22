import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { AtmosphereProvider } from '@/context/AtmosphereContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import WhatsAppWidget from '@/components/WhatsAppWidget';
import VizagIntro from '@/components/VizagIntro';
import { SpeedInsights } from '@vercel/speed-insights/next';

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
          </AtmosphereProvider>
        </CartProvider>
      </body>
    </html>
  );
}
