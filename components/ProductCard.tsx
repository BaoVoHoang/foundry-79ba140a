'use client';

import { useState, useRef, useEffect } from 'react';
import { Product } from '@/lib/types';
import { addToCart } from '@/lib/cart';
import { useCart } from '@/lib/CartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { refreshCart } = useCart();
  const [showToast, setShowToast] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleAddToCart = () => {
    addToCart(product);
    refreshCart();
    setShowToast(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="relative flex flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">{product.name}</h3>
      </div>
      <p className="mb-1 text-sm text-gray-500">{product.category}</p>
      <p className="mb-1 font-medium text-gray-900">${product.price.toFixed(2)}</p>
      <p className="mb-3 text-xs text-gray-400">
        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
      </p>
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={product.stock <= 0}
        className="mt-auto rounded-md bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Add to Cart
      </button>

      {showToast && (
        <div
          role="status"
          data-testid="add-to-cart-toast"
          className="absolute left-1/2 top-2 -translate-x-1/2 rounded-md bg-green-600 px-3 py-1 text-xs font-medium text-white shadow"
        >
          Added to cart!
        </div>
      )}
    </div>
  );
}
