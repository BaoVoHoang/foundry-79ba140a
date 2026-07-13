import { getDb } from '@/lib/db';
import { Product } from '@/lib/types';
import ProductCard from '@/components/ProductCard';

export default function HomePage() {
  const db = getDb();
  const products = db.prepare('SELECT * FROM products ORDER BY id').all() as Product[];

  return (
    <main className="flex-1 p-8">
      <h1 className="mb-2 text-3xl font-bold">PC Parts Shop</h1>
      <p className="mb-6 text-gray-600">Browse CPUs, GPUs, RAM, and more.</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}
