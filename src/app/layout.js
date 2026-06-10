import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import CartDrawer from '@/components/CartDrawer';
import WishlistDrawer from '@/components/WishlistDrawer';
import LayoutClient from './LayoutClient';
import Footer from '@/components/Footer';
import WhatsAppWidget from '@/components/WhatsAppWidget';

export const metadata = {
  title: "SPY Multibrand Stores | Your Fashion Detective",
  description:
    "Shop premium men's clothing at SPY Multibrand Stores. Uncover the latest trends in T-Shirts, Shirts, Jeans, Joggers & more. Quality that speaks style.",
  keywords: 'SPY Multibrand Stores, men fashion, t-shirts, shirts, jeans, joggers, Visakhapatnam, Vizag',
  openGraph: {
    title: "SPY Multibrand Stores | Your Fashion Detective",
    description: "Uncover the latest trends in men's fashion. Quality that speaks style.",
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <CartProvider>
          <WishlistProvider>
            <LayoutClient />
            <CartDrawer />
            <WishlistDrawer />
            <main className="page-content">
              {children}
            </main>
            <Footer />
            <WhatsAppWidget />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
