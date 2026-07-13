import { getDb } from '@/lib/db';
import type { Product, Order } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default function TestDbPage() {
  const db = getDb();
  const products = db.prepare('SELECT * FROM products').all() as Product[];
  const orders = db.prepare('SELECT * FROM orders').all() as Order[];

  return (
    <main className="flex-1 p-8">
      <h1 className="text-2xl font-bold mb-4">Database Test</h1>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Products ({products.length})</h2>
        <ul className="list-disc pl-6">
          {products.map((p) => (
            <li key={p.id}>
              {p.name} — {p.category} — ${p.price} — stock: {p.stock}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">Orders ({orders.length})</h2>
        <ul className="list-disc pl-6">
          {orders.map((o) => (
            <li key={o.id}>
              {o.customer_name} — {o.customer_email} — ${o.total_price}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
