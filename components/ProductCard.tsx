import type { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export default function ProductCard({ product }: ProductCardProps) {
  const inStock = product.stock > 0;

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-square w-full bg-gray-100 flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/placeholder.png"
          alt={product.name}
          className="w-full h-full object-contain p-4"
        />
      </div>
      <div className="flex flex-col gap-2 p-4 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
            {product.name}
          </h3>
        </div>
        <span className="inline-block w-fit rounded-full bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1">
          {product.category}
        </span>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-base font-bold text-gray-900">
            {currencyFormatter.format(product.price)}
          </span>
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              inStock
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
      </div>
    </div>
  );
}
