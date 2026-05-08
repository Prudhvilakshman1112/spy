import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import CartDrawer from '@/components/CartDrawer';
import WishlistDrawer from '@/components/WishlistDrawer';
import LayoutClient from './LayoutClient';
import Footer from '@/components/Footer';
import WhatsAppWidget from '@/components/WhatsAppWidget';

export const metadata = {
  title: "Cult Clothing | Men's Fashion Store",
  description:
    "Shop premium men's clothing at Cult Clothing. T-Shirts, Shirts, Polos, Jeans, Joggers & more. Men's fashion, redefined.",
  keywords: 'Cult Clothing, men fashion, t-shirts, shirts, jeans, joggers, Vizag',
  openGraph: {
    title: "Cult Clothing | Men's Fashion",
    description: "Premium Men's Fashion Store",
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
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
