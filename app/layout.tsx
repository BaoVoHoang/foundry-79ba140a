import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { getDb } from '@/lib/db';
import { CartProvider } from '@/lib/CartContext';
import { CartToggleButton } from '@/components/Cart';
import Cart from '@/components/Cart';
import Link from 'next/link';

// Ensure the SQLite database is created, migrated, and seeded as soon as the
// server starts handling requests. Importing/calling getDb() here runs once
// per server process (module-level singleton in lib/db.ts) and guarantees
// the `products` and `orders` tables exist before any page or API route runs.
getDb();

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PC Parts Shop',
  description: 'Your one-stop shop for PC parts: CPUs, GPUs, RAM, and more.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900 min-h-screen antialiased`}>
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-white px-4 py-3 shadow-sm">
              <Link href="/" className="text-lg font-bold text-gray-900">
                PC Parts Shop
              </Link>
              <CartToggleButton />
            </header>
            {children}
            <Cart />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
