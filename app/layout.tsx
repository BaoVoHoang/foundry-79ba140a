import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

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
        <div className="min-h-screen flex flex-col">{children}</div>
      </body>
    </html>
  );
}
