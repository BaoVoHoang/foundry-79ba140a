import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import type { Product } from '@/lib/types';

export async function GET() {
  try {
    const db = getDb();
    const products = db
      .prepare('SELECT id, name, category, price, stock, created_at FROM products ORDER BY id ASC')
      .all() as Product[];

    return NextResponse.json(products);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const db = getDb();
    const body = await request.json();
    const { name, category, price, stock } = body;

    if (
      typeof name !== 'string' ||
      typeof category !== 'string' ||
      typeof price !== 'number' ||
      typeof stock !== 'number'
    ) {
      return NextResponse.json(
        { error: 'Invalid product payload' },
        { status: 400 }
      );
    }

    const insert = db.prepare(
      'INSERT INTO products (name, category, price, stock) VALUES (?, ?, ?, ?)'
    );
    const result = insert.run(name, category, price, stock);

    const product = db
      .prepare('SELECT id, name, category, price, stock FROM products WHERE id = ?')
      .get(result.lastInsertRowid) as Product;

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Failed to create product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
